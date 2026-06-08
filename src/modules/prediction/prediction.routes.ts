import { Router } from "express";
import * as predictionController from "./prediction.controller.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { auth } from "../../common/middlewares/auth.middleware.js";
import { getPredictionSchema, citizenJoinSchema } from "./prediction.schema.js";

// I am setting up our express routing engine to handle queue traffic
const router = Router();

/**
 * @openapi
 * /prediction/join:
 *   post:
 *     summary: Public endpoint for citizens to join an organization's queue
 *     tags:
 *       - Predictions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orgId
 *               - timestamp
 *               - facilityModel
 *               - facilityName
 *             properties:
 *               orgId:
 *                 type: string
 *                 format: uuid
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *               facilityModel:
 *                 type: string
 *                 enum: [Standard_9to5, Continuous_24_7]
 *               facilityName:
 *                 type: string
 *               bookingSource:
 *                 type: string
 *                 enum: [Web, WhatsApp, SMS, USSD]
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Citizen successfully added to the live database queue
 *       400:
 *         description: Invalid registration payload provided
 *       502:
 *         description: Downstream ML engine connection failure
 */
router.post(
  "/join",
  validate(citizenJoinSchema),
  predictionController.citizenJoinQueue
);

/**
 * @openapi
 * /prediction:
 *   post:
 *     summary: Predicts queue wait time (Internal Dashboard)
 *     tags:
 *       - Predictions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - timestamp
 *               - facilityModel
 *               - facilityName
 *             properties:
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *               facilityModel:
 *                 type: string
 *                 enum: [Standard_9to5, Continuous_24_7]
 *               facilityName:
 *                 type: string
 *               bookingSource:
 *                 type: string
 *                 enum: [Web, WhatsApp, SMS, USSD]
 *               phoneNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Prediction successfully generated
 *       401:
 *         description: Unauthorized access
 *       502:
 *         description: Prediction service failed
 */
router.post(
  "/",
  auth,
  validate(getPredictionSchema),
  predictionController.getPrediction
);

// I am exporting the router configuration to tie it directly into our main server instance
export default router;
