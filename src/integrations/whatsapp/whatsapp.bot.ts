import axios from "axios";
import { prisma } from "../../common/prisma.js";
import { createTicket } from "../../modules/ticket/ticket.service.js";
import { ENV } from "../../config/env.js";

// Simple in-memory session store
const sessions: Record<string, { step: string; orgId?: string; serviceId?: string; name?: string }> = {};

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
    const orgs = await prisma.organization.findMany({
      select: { id: true, name: true, orgCode: true },
      take: 10,
    });

    if (orgs.length === 0) {
      await sendMessage(from, "Sorry, no organizations are available at the moment.");
      return;
    }

    const orgList = orgs.map((o, i) => `${i + 1}. ${o.name} (${o.orgCode})`).join("\n");
    await sendMessage(from, `Welcome to QueueEase! 👋\n\nPlease select an organization by replying with the number:\n\n${orgList}`);

    sessions[from] = { step: "select_org" };
    return;
  }

  if (session.step === "select_org") {
    const orgs = await prisma.organization.findMany({
      select: { id: true, name: true },
      take: 10,
    });

    const index = parseInt(text) - 1;

    if (isNaN(index) || index < 0 || index >= orgs.length) {
      await sendMessage(from, "Invalid selection. Please reply with a number from the list.");
      return;
    }

    const org = orgs[index]!;
    const services = await prisma.service.findMany({
      where: { orgId: session.orgId! },
      select: { id: true, name: true },
    });

    if (services.length === 0) {
      await sendMessage(from, `${org.name} has no services available at the moment.`);
      return;
    }

    const serviceList = services.map((s, i) => `${i + 1}. ${s.name}`).join("\n");
    await sendMessage(from, `You selected *${org.name}*.\n\nPlease select a service:\n\n${serviceList}`);

    sessions[from] = { step: "select_service", orgId: org.id };
    return;
  }

  if (session.step === "select_service") {
    if (!session.orgId) {
      await sendMessage(from, "Session expired. Reply *Hi* to start again.");
      delete sessions[from];
      return;
    }

    const services = await prisma.service.findMany({
      where: { orgId: session.orgId },
      select: { id: true, name: true },
    });

    const index = parseInt(text) - 1;

    if (isNaN(index) || index < 0 || index >= services.length) {
      await sendMessage(from, "Invalid selection. Please reply with a number from the list.");
      return;
    }

    const service = services[index]!;
    sessions[from] = { ...session, step: "enter_name", serviceId: service.id };

    await sendMessage(from, `You selected *${service.name}*.\n\nPlease enter your full name:`);
    return;
  }

  if (session.step === "enter_name") {
    sessions[from] = { ...session, step: "confirm", name: text };
    await sendMessage(from, `Thank you, *${text}*!\n\nReply *YES* to confirm joining the queue or *NO* to cancel.`);
    return;
  }

  if (session.step === "confirm") {
    if (text === "yes") {
      try {
        const ticket = await createTicket({
          name: session.name!,
          phone: from,
          address: "WhatsApp",
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
        await sendMessage(from, "Sorry, something went wrong. Please try again.");
        delete sessions[from];
      }
    } else {
      await sendMessage(from, "Queue joining cancelled. Reply *Hi* to start again.");
      delete sessions[from];
    }
    return;
  }

  await sendMessage(from, "Reply *Hi* to join a queue. 👋");
};