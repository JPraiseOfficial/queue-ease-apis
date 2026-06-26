import type { Request, Response } from "express";
import { processIncomingMessage } from "./whatsapp.bot.js";
import { ENV } from "../../config/env.js";

export const verifyWebhook = (req: Request, res: Response) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === ENV.WHATSAPP_VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.status(403).json({ message: "Verification failed" });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const messages = value?.messages;

      if (messages && messages.length > 0) {
        const message = messages[0];
        const from = message.from;
        const text = message.text?.body?.trim().toLowerCase();

        await processIncomingMessage(from, text);
      }
    }

    res.status(200).send("OK");
  } catch (error) {
    res.status(200).send("OK");
  }
};