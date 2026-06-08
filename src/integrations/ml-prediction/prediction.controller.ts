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

// I am handling public requests from citizens who want to register themselves into an organization's live queue
export const citizenJoinQueue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // I am stripping out the target organization ID directly from the unauthenticated request payload
    const { orgId, ...bookingData } = req.body;

    // I am routing the public booking request through our primary machine learning and database pipeline
    const registrationResult = await predictionService.processQueuePrediction(orgId, bookingData);

    res.status(201).json({
      status: "success",
      message: "Citizen successfully joined the queue",
      data: registrationResult,
    });
  } catch (error) {
    next(error);
  }
};