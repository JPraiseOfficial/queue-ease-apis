import z from "zod";

export const idParamSchema = z.object({
  id: z.uuid("Resource not found")
});

export const serviceIdParamSchema = z.object({
  serviceId: z.uuid("serviceId is invalid"),
});

