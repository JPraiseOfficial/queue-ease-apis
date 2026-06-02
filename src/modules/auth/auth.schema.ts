import z from "zod";
import { createOrganizationSchema } from "../organization/organization.schema.js";

// Sign Up
const createUser = z.object({
  name: z.string().min(5),
  email: z.email("Enter a valid email address"),
  phone: z.string().min(11, "Enter a valid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signUpSchema = z.object({
  user: createUser,
  organization: createOrganizationSchema,
});

export type signUpDto = z.infer<typeof signUpSchema>;

// Login
export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type loginDto = z.infer<typeof loginSchema>;

// Change Password
export const changePasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});
export type changePasswordDto = z.infer<typeof changePasswordSchema>;
