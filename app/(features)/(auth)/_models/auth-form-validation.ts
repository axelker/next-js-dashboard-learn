import { z } from 'zod';

export const FormSchema = z.object({
    name: z.string().optional(),
    email: z.string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .email("Invalid email address"),
    password: z.string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .min(8, "Password must be at least 6 characters"),
});