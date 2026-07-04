import type { Request, Response, NextFunction } from "express";
import * as ticketService from "./ticket.service.js";
import { AppError } from "../../common/errors/appError.js";

export const getOrgServices = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { orgCode } = req.params;
    const ticket = await ticketService.getOrgServices(orgCode as string);

    if (ticket === null) {
      throw new AppError("Organization doesn't exist", 404);
    }
    if (ticket.services.length === 0) {
      throw new AppError("Organization doesn't have any service", 404);
    }

    res.status(201).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

export const createTicket = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ticket = await ticketService.createTicket(req.body);
    res.status(201).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

export const serveNext = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ticket = await ticketService.serveNext(req.user!);
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

export const ticketCompleted = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ticket = await ticketService.ticketCompleted(req.user!, req.body);
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};
