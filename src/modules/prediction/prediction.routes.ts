import { Router } from "express";
import * as predictionController from "./prediction.controller.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { auth } from "../../common/middlewares/auth.middleware.js";
import { getPredictionSchema } from "./prediction.schema.js";

const router = Router();

/**
 * @openapi
 * /api/prediction:
 * post:
 * summary: Predicts queue wait time
 * tags: [Predictions]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * timestamp:
 * type: string
 * facilityModel:
 * type: string
 * responses:
 * 200:
 * description: Prediction successfully generated
 * 502:
 * description: Prediction service failed
 */
router.post(
  "/",
  auth,
  validate(getPredictionSchema),
  predictionController.getPrediction
);

export default router;