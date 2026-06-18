import { Router } from "express";
import * as ticketController from "./ticket.controller.js";
import { auth } from "../../common/middlewares/auth.middleware.js";
import { authorize } from "../../common/middlewares/role.middleware.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { getOrgServicesSchema, createTicketSchema, ticketCompletedSchema } from "./ticket.schema.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Ticket
 *   description: Ticket management endpoints
 */

/**
 * @swagger
 * /ticket/create:
 *   post:
 *     summary: Create a new ticket / Join a queue
 *     tags: [Ticket]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *               - address
 *               - orgId
 *               - serviceId
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               orgId:
 *                 type: string
 *                 format: uuid
 *               serviceId:
 *                 type: string
 *                 format: uuid
 *               source:
 *                 type: string
 *                 enum: [web, whatsApp, sms, ussd]
 *                 default: web
 *     responses:
 *       201:
 *         description: Successfully joined the queue
 */
router.post("/create", validate(createTicketSchema), ticketController.createTicket);

/**
 * @swagger
 * /ticket/serve-next:
 *   post:
 *     summary: Serve the next person in the queue
 *     tags: [Ticket]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched the next ticket
 */
router.post(
  "/serve-next",
  auth,
  authorize(["staff"]),
  ticketController.serveNext,
);

/**
 * @swagger
 * /ticket/completed:
 *   post:
 *     summary: Mark a ticket as completed or no-show
 *     tags: [Ticket]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ticketId
 *               - status
 *             properties:
 *               ticketId:
 *                 type: string
 *                 format: uuid
 *               status:
 *                 type: string
 *                 enum: [COMPLETED, NO_SHOW]
 *     responses:
 *       200:
 *         description: Successfully updated the ticket status
 */
router.post(
  "/completed",
  auth,
  authorize(["staff"]),
  validate(ticketCompletedSchema),
  ticketController.ticketCompleted,
);

/**
 * @swagger
 * /ticket/{orgCode}:
 *   post:
 *     summary: Get organization services by org code
 *     tags: [Ticket]
 *     parameters:
 *       - in: path
 *         name: orgCode
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Successfully fetched organization services
 */
router.post("/:orgCode", validate(getOrgServicesSchema, "params"), ticketController.getOrgServices);


export default router;
