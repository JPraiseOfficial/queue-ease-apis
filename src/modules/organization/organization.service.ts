import { prisma } from "../../common/prisma.js";
import { AppError } from "../../common/errors/appError.js";
import type {
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from "./organization.schema.js";
import { removeUndefined } from "../../common/utils/utils.js";

export const createOrganization = async (data: CreateOrganizationDto) => {
  // Implement name, email and phone being unique.
  const existingOrg = await prisma.organization.findUnique({
    where: { name: data.name },
  });

  if (existingOrg) {
    throw new AppError("Organization with this name already exists!", 409);
  }

  const organization = await prisma.organization.create({
    data: { ...data },
  });

  return organization;
};

export const getOrganization = async (id: string) => {
  const organization = await prisma.organization.findUnique({ where: { id } });

  if (!organization) throw new AppError("Organization not found", 404);

  return organization;
};

export const updateOrganization = async (
  orgId: string,
  data: UpdateOrganizationDto,
) => {
  try {
    // To remove undefined values
    const cleanData = removeUndefined(data);

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
