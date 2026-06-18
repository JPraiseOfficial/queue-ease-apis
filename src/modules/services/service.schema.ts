import z from "zod";

export const createServiceSchema = z.object({
  name: z.string().min(2, "Service name must be at least 2 characters"),
  description: z.string().min(2, "Description is required"),
  code: z.string().max(3, "Service Code must not exceed 3 characters"),
});

export const updateServiceSchema = createServiceSchema.partial();

export type CreateServiceDto = z.infer<typeof createServiceSchema>;
export type UpdateServiceDto = z.infer<typeof updateServiceSchema>;