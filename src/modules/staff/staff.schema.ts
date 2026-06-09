import z from "zod";
import { UserRole } from "../../common/types/enums.types.js";

export const createStaffSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters"),
  email: z.email("Enter a valid email address"),
  phone: z.string().min(11, "Enter a valid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum([UserRole.ADMIN, UserRole.STAFF]),
  serviceId: z.uuid({ error: "serviceId is not valid" }),
});

export const updateStaffSchema = createStaffSchema
  .omit({ password: true, role: true })
  .partial();

export const changeRoleSchema = z.object({
  role: z.enum([UserRole.ADMIN, UserRole.STAFF]),
});

export type CreateStaffDto = z.infer<typeof createStaffSchema>;
export type UpdateStaffDto = z.infer<typeof updateStaffSchema>;
export type ChangeRoleDto = z.infer<typeof changeRoleSchema>;
