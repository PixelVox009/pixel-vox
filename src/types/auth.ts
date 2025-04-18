import { z } from "zod";

// Schema validation
export const registerFormSchema = z.object({
    name: z.string().min(2, {
        message: "Name must contain at least 2 characters.",
    }),
    email: z.string().email({
        message: "Invalid email.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
    terms: z.boolean().refine((val) => val === true, {
        message: "You must agree to the terms to continue.",
    }),
});

export type RegisterFormData = z.infer<typeof registerFormSchema>;