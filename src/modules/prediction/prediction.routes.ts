import { Router } from "express";
import * as predictionController from "./prediction.controller.js";
import { validate } from "../../common/middlewares/validate.middleware.js";
import { auth } from "../../common/middlewares/auth.middleware.js";
import { getPredictionSchema } from "./prediction.schema.js";

const router = Router();

// I am creating a secure POST route that requires the user to be logged in before asking for a prediction
router.post(
  "/",
  auth,
  validate(getPredictionSchema),
  predictionController.getPrediction
);

export default router;