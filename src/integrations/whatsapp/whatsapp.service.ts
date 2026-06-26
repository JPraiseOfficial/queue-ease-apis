import axios from "axios";
import { ENV } from "../../config/env.js";

const WHATSAPP_API_URL = `https://graph.facebook.com/v22.0/${ENV.WHATSAPP_PHONE_NUMBER_ID}/messages`;

const sendWhatsAppMessage = async (to: string, message: string) => {
  await axios.post(
    WHATSAPP_API_URL,
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

export const sendQueueConfirmationWhatsApp = async (
  phone: string,
  name: string,
  ticketNo: string,
  position: number,
) => {
  const message = `Hello ${name}! 👋\n\nYou have successfully joined the queue.\n\n🎫 *Ticket Number:* ${ticketNo}\n📍 *Position:* ${position}\n\nWe will notify you when it's almost your turn. Thank you for your patience!`;

  await sendWhatsAppMessage(phone, message);
};

export const sendYouAreNextWhatsApp = async (
  phone: string,
  name: string,
  ticketNo: string,
) => {
  const message = `Hello ${name}! 🔔\n\nIt's almost your turn!\n\n🎫 *Ticket Number:* ${ticketNo}\n\nPlease proceed to the service desk now. Thank you!`;

  await sendWhatsAppMessage(phone, message);
};

export const sendQueuePausedWhatsApp = async (
  phone: string,
  name: string,
) => {
  const message = `Hello ${name},\n\nWe wanted to let you know that the queue has been temporarily paused. ⏸️\n\nWe will resume shortly. Thank you for your patience!`;

  await sendWhatsAppMessage(phone, message);
};