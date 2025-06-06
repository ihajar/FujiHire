import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email({ message: "Email is required" }),
    password: z.string().min(1,{ message: "Password is required" }),
});

export const RegisterSchema = z.object({
    email: z.string().email({ message: "Email is required" }),
    password: z.string().min(6, { message: "Minimum 6 characters required" }),
})

export const EmailValidationSchema = z.object({
    code: z.string().min(5, "Code must be at least 5 characters long"),
});