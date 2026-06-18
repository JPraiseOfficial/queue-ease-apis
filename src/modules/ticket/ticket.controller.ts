import type { Request, Response, NextFunction } from "express";
import * as ticketService from "./ticket.service.js";

export const getOrgServices = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { orgCode } = req.params;
    const ticket = await ticketService.getOrgServices(orgCode as string);
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
