import type { NextFunction, Request, Response } from "express";
import * as organizationService from "./organization.service.js";

export const getOrg = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organization = await organizationService.getOrganization(req.user?.orgId!);
    res.status(200).json({
      status: "success",
      data: organization,
    });
  } catch (error) {
    next(error);
  }
};


export const updateOrg = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const organization = await organizationService.updateOrganization(req.user?.orgId!, req.body);
    res.status(200).json({
      status: "success",
      message: "Organization updated successfully",
      data: organization,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOrg = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await organizationService.deleteOrganization(req.user?.orgId!);
    res.status(200).json({
      status: "success",
      message: "Organization deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};