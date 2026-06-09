import z from "zod";

export const idParamSchema = z.object({
  id: z.uuid("Resource not found")
});