import type { Request, Response, NextFunction } from "express";
import * as queueService from "./queue.service.js";
  
  export const serviceQueueLiveStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { serviceId } = req.params;
      const serviceQueueStatus = await queueService.serviceQueueLiveStatus(
        req.user?.orgId!,
        serviceId as string,
      );
      res.status(200).json({ success: true, data: serviceQueueStatus });
    } catch (error) {
      next(error);
    }
  }

    export const overallQueueLiveStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const overallQueueStatus = await queueService.overallQueueLiveStatus(
        req.user?.orgId!,
      );
      res.status(200).json({ success: true, data: overallQueueStatus });
    } catch (error) {
      next(error);
    }
  }
