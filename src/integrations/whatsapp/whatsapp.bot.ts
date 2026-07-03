import axios from "axios";
import { prisma } from "../../common/prisma.js";
import {
  createTicket,
  getOrgServices,
} from "../../modules/ticket/ticket.service.js";
import { ENV } from "../../config/env.js";

// Simple in-memory session store
const sessions: Record<
  string,
  { step: string; orgId?: string; serviceId?: string; name?: string }
> = {};

const sendMessage = async (to: string, message: string) => {
  await axios.post(
    `https://graph.facebook.com/v22.0/${ENV.WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: message },
    },
    {
      headers: {
        Authorization: `Bearer ${ENV.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
    },
  );
};

export const processIncomingMessage = async (from: string, text: string) => {
  const session = sessions[from] || { step: "start" };

  if (!text || ["hi", "hello", "hey", "start", "queue"].includes(text)) {
    await sendMessage(
      from,
      `Welcome to QueueEase! \nPlease reply with an Organization Code to join the queue`,
    );

    sessions[from] = { step: "select_org" };
    return;
  }

  if (session.step === "select_org") {
    const orgCode = text;
    const org = await getOrgServices(orgCode);
    if (org === null) {
      await sendMessage(
        from,
        "Organization not found! Please, contact the organization for the right code.",
      );
      return;
    }
    if (org.services.length === 0) {
      await sendMessage(
        from,
        `${org.name} has no services available at the moment.`,
      );
      return;
    }

    const serviceList = org.services
      .map((s, i) => `${i + 1}. ${s.name}`)
      .join("\n");
    await sendMessage(
      from,
      `You selected *${org.name}*. \n *Location:* ${org.location}\n\nPlease select a service:\n\n${serviceList}. \n\nIf this is not the intended organization, reply *CANCEL* to cancel session`,
    );

    sessions[from] = { step: "select_service", orgId: org.id };
    return;
  }

  if (session.step === "select_service") {
    if (!session.orgId) {
      await sendMessage(from, "Session expired. Reply *Hi* to start again.");
      delete sessions[from];
      return;
    }
    if (text === "cancel") {
      await sendMessage(
        from,
        "You have successfully cancelled this session. Reply *Hi* to start again.",
      );
      delete sessions[from];
      return;
    }

    if (!session.orgId) {
  await sendMessage(from, "Session expired. Reply *Hi* to start again.");
  delete sessions[from];
  return;
}

const services = await prisma.service.findMany({
  where: { orgId: session.orgId },
  select: { id: true, name: true },
  orderBy: { name: "asc" },
});

    const index = parseInt(text) - 1;

    if (isNaN(index) || index < 0 || index >= services.length) {
      await sendMessage(
        from,
        "Invalid selection. Please reply with a number from the list.",
      );
      return;
    }

    const service = services[index]!;
    sessions[from] = { ...session, step: "enter_name", serviceId: service.id };

    await sendMessage(
      from,
      `You selected *${service.name}*.\n\nPlease enter your full name:`,
    );
    return;
  }

  if (session.step === "enter_name") {
    sessions[from] = { ...session, step: "confirm", name: text };
    await sendMessage(
      from,
      `Thank you, *${text}*!\n\nReply *YES* to confirm joining the queue or *NO* to cancel.`,
    );
    return;
  }

  if (session.step === "confirm") {
    if (text === "yes") {
      try {
        const ticket = await createTicket({
          name: session.name!,
          phone: from,
          orgId: session.orgId!,
          serviceId: session.serviceId!,
          source: "whatsApp",
        });

        await sendMessage(
          from,
          `✅ You have successfully joined the queue!\n\n🎫 *Ticket Number:* ${ticket.ticketNo}\n📍 *Position:* ${ticket.peopleInLine + 1}\n\nWe will notify you when it's your turn. Thank you!`,
        );

        delete sessions[from];
      } catch (error) {
        await sendMessage(
          from,
          "Sorry, something went wrong. Please try again.",
        );
        delete sessions[from];
      }
    } else {
      await sendMessage(
        from,
        "Queue joining cancelled. Reply *Hi* to start again.",
      );
      delete sessions[from];
    }
    return;
  }

  await sendMessage(from, "Reply *Hi* to join a queue. 👋");
};
