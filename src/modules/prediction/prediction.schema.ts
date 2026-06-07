import z from "zod";

// I am defining the exact shape of data the frontend must send us to get a prediction
export const getPredictionSchema = z.object({
  timestamp: z.string().datetime("Must be a valid ISO datetime string"),
  facilityModel: z.enum(["Standard_9to5", "Continuous_24_7"]),
  facilityName: z.string(),
  bookingSource: z.string().optional().default("Web"),
  phoneNumber: z.string().optional()
});

export type GetPredictionDto = z.infer<typeof getPredictionSchema>;