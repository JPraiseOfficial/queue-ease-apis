import type { NextFunction, Request, Response } from "express";
import * as predictionService from "./prediction.service.js";

// I am catching the request from the web, passing it to the service, and sending the response back
export const getPrediction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // I am pulling the organization ID securely from the authenticated user token
    const orgId = req.user?.orgId!;
    
    const predictionResult = await predictionService.processQueuePrediction(orgId, req.body);

    res.status(200).json({
      status: "success",
      message: "Queue prediction generated successfully",
      data: predictionResult,
    });
  } catch (error) {
    next(error);
  }
};