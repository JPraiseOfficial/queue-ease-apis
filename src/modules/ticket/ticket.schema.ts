import { z } from "zod";
import { TicketStatus } from "../../common/types/enums.types.js";

export const getOrgServicesSchema = z.object({
  orgCode: z.string().max(8, "Invalid Org Code"),
});

export const createTicketSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  orgId: z.uuid("Invalid orgId"),
  serviceId: z.uuid("Invalid serviceId"),
  source: z.enum(["web", "whatsApp", "sms", "ussd"]).default("web"),
});

export const ticketCompletedSchema = z.object({
  ticketId: z.uuid("Invalid ticketId"),
  status: z.enum([TicketStatus.COMPLETED, TicketStatus.NO_SHOW])
});

export type createTicketDto = z.infer<typeof createTicketSchema>;
export type ticketCompletedDto = z.infer<typeof ticketCompletedSchema>;
