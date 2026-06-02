import z from "zod";

export const createOrganizationSchema = z.object({
  name: z.string().min(2, "Company Name must be at least 2 characters"),
  email: z.email("Enter a valid email address"),
  phone: z.string().min(10, "Enter a valid phone number"),
  location: z.string().min(2, "Location is required"),
  availability: z.enum(['weekdays', 'always_open']),
  openingTime: z.string().nullable(),
  closingTime: z.string().nullable()
});

export const updateOrganizationSchema = createOrganizationSchema.partial()

export type CreateOrganizationDto = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationDto = z.infer<typeof updateOrganizationSchema>;