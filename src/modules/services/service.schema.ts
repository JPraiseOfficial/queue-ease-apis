import z from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const createServiceSchema = z.object({
  name: z.string().min(2, "Service name must be at least 2 characters"),
  description: z.string().min(2, "Description is required"),
  code: z.string(),
  department: z.string(),
  queuePrefix: z.string().max(3, "Queue Prefix must not exceed 3 characters"),
  avgTime: z.number("Input a valid number (in minutes)"),
  dailyCapacity: z.string(),
  maxQueueSize: z.string(),
  openingTime: z.string().regex(timeRegex, "Invalid time format. Use HH:MM"),
  closingTime: z.string().regex(timeRegex, "Invalid time format. Use HH:MM"),
  openingDays: z.array(z.enum(daysOfWeek)),
});

export const updateServiceSchema = createServiceSchema.partial();

export type CreateServiceDto = z.infer<typeof createServiceSchema>;
export type UpdateServiceDto = z.infer<typeof updateServiceSchema>;