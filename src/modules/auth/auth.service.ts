import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../../common/errors/appError.js";
import { prisma } from "../../common/prisma.js";
import type { changePasswordDto, loginDto, signUpDto } from "./auth.schema.js";
import { ENV } from "../../config/env.js";
import { UserRole } from "../../common/types/enums.types.js";

export const signupUser = async (data: signUpDto) => {
  // I am checking if a primary user account already claims this email or phone
  const existingUser = await prisma.staff.findFirst({
    where: { OR: [{ email: data.user.email }, { phone: data.user.phone }] },
  });

  if (existingUser) {
    throw new AppError("User Email or Phone already exists!", 409);
  }

  // I am parsing the salt rounds to prevent type errors if it is imported as a string
  const saltRounds = typeof ENV.BCRYPT_SALT === "string" ? parseInt(ENV.BCRYPT_SALT, 10) : ENV.BCRYPT_SALT;

  // I am wrapping operations in a transaction so if one fails, everything rolls back safely
  const result = await prisma.$transaction(async (tx) => {
    const hashedPassword = await bcrypt.hash(data.user.password, saltRounds || 10);

    // I am spawning the organization first so the owner staff account can link to it
    const organization = await tx.organization.create({
      data: {
        name: data.organization.name,
        email: data.organization.email,
        phone: data.organization.phone,
        location: data.organization.location,
        availability: data.organization.availability,
        openingTime: data.organization.openingTime,
        closingTime: data.organization.closingTime,
      },
    });

    // I am explicitly mapping out the user fields to prevent strict DTO type issues
    const user = await tx.staff.create({
      data: {
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        password: hashedPassword,
        role: UserRole.OWNER,
        orgId: organization.id,
      },
    });

    return { user, organization };
  });

  // I am generating the authorization token with all the newly assigned IDs
  const token = generateJwtToken(result.user.id, result.user.role, result.organization.id);
  
  return { token, user: result.user, organization: result.organization };
};

// I am keeping this synchronous because jwt.sign does not return a promise unless given a callback
const generateJwtToken = (id: string, role: string, orgId: string): string => {
  const token = jwt.sign(
    { id, role, orgId },
    ENV.JWT_SECRET,
    { expiresIn: "24h" },
  );
  return token;
};

export const login = async (data: loginDto) => {
  // I am fetching the user profile and explicitly attaching the organization details
  const user = await prisma.staff.findUnique({
    where: { email: data.email },
    include: { organization: true },
  });

  if (!user || !(await bcrypt.compare(data.password, user.password))) {
    throw new AppError("Invalid credentials", 401);
  }

  // I am fallback-checking the organization ID safely in case it returns null or undefined
  const token = generateJwtToken(user.id, user.role, user.organization?.id || "");

  return { token, user };
};

export const changePassword = async (userId: string, data: changePasswordDto) => {
  // I am looking up the user profile before attempting any updates
  const user = await prisma.staff.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError("User account not found", 404);
  }

  const isPasswordValid = await bcrypt.compare(data.oldPassword, user.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid old password", 401);
  }

  const saltRounds = typeof ENV.BCRYPT_SALT === "string" ? parseInt(ENV.BCRYPT_SALT, 10) : ENV.BCRYPT_SALT;
  const hashedPassword = await bcrypt.hash(data.newPassword, saltRounds || 10);

  // I am committing the new hashed password to the user record
  await prisma.staff.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { message: "Password updated successfully" };
};
