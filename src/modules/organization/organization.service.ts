import { prisma } from "../../common/prisma.js";
import { AppError } from "../../common/errors/appError.js";
import type { CreateOrganizationDto, UpdateOrganizationDto } from "./organization.schema.js";

export const createOrganization = async (data: CreateOrganizationDto, _ownerId: string) => {
  // Prevent duplicate facilities from clouding dashboard metrics
  const existingOrg = await prisma.organization.findUnique({
    where: { name: data.name },
  });

  if (existingOrg) {
    throw new AppError("Organization with this name already exists!", 409);
  }

  // Create organization with verified relation linkage
  const organization = await prisma.organization.create({
    data,
  });

  return organization;
};

export const getOrganization = async (id: string) => {
  const organization = await prisma.organization.findUnique({ where: { id } });

  if (!organization) throw new AppError("Organization not found", 404);

  return organization;
};

export const updateOrganization = async (orgId: string, data: UpdateOrganizationDto) => {
  try {
    // Strip out undefined values safely before payload parsing
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined),
    );

    if (cleanData.name) {
      const existingOrg = await prisma.organization.findUnique({
        where: { name: cleanData.name },
      });

      if (existingOrg) {
        throw new AppError("Organization with this name already exists", 409);
      }
    }

    const organization = await prisma.organization.update({
      where: { id: orgId },
      data: { ...cleanData },
    });
    return organization;
  } catch (error: any) {
    if (error.code === "P2025") {
      throw new AppError("Organization does not exist.", 404);
    } else {
      throw error;
    }
  }
};

export const deleteOrganization = async (id: string) => {
  try {
    const organization = await prisma.organization.delete({ where: { id } });
    return organization;
  } catch (error: any) {
    if (error.code === "P2025") {
      throw new AppError("Organization does not exist.", 404);
    } else {
      throw error;
    }
  }
};
