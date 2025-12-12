import z from "zod";

export const authSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(3, "Password must be at least 3 characters"),
})

export type LoginForm = z.infer<typeof authSchema>;