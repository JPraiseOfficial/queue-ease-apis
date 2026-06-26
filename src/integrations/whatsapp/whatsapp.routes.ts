import { Router } from "express";
import { handleWebhook, verifyWebhook } from "./whatsapp.controller.js";

const router = Router();

/**
 * @swagger
 * /whatsapp/webhook:
 *   get:
 *     summary: Verify WhatsApp webhook
 *     tags: [WhatsApp]
 *     parameters:
 *       - in: query
 *         name: hub.mode
 *         schema:
 *           type: string
 *       - in: query
 *         name: hub.verify_token
 *         schema:
 *           type: string
 *       - in: query
 *         name: hub.challenge
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Webhook verified
 *       403:
 *         description: Verification failed
 */
router.get("/webhook", verifyWebhook);

/**
 * @swagger
 * /whatsapp/webhook:
 *   post:
 *     summary: Handle incoming WhatsApp messages
 *     tags: [WhatsApp]
 *     responses:
 *       200:
 *         description: Webhook received
 */
router.post("/webhook", handleWebhook);

export default router;