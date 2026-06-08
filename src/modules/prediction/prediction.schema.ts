import z from "zod";

// I am defining the exact shape of data the frontend must send us to get a prediction
export const getPredictionSchema = z.object({
  timestamp: z.string().datetime("Must be a valid ISO datetime string"),
  facilityModel: z.enum(["Standard_9to5", "Continuous_24_7"]),
  facilityName: z.string(),
  bookingSource: z.string().optional().default("Web"),
  phoneNumber: z.string().optional()
});

// I am creating a public validation schema for citizens where the orgId is explicitly required in the payload
export const citizenJoinQueueSchema = z.object({
  orgId: z.string().uuid("A valid Organization UUID is required to join a queue"),
  timestamp: z.string().datetime("Must be a valid ISO datetime string"),
  facilityModel: z.enum(["Standard_9to5", "Continuous_24_7"]),
  facilityName: z.string(),
  bookingSource: z.enum(["Web", "WhatsApp", "SMS", "USSD"]).default("Web"),
  phoneNumber: z.string().optional()
});

export type GetPredictionDto = z.infer<typeof getPredictionSchema>;
// I am exporting the data type contract for our new citizen route
export type CitizenJoinQueueDto = z.infer<typeof citizenJoinQueueSchema>;