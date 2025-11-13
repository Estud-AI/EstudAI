import { z } from "zod";

// Zod schema for User validation
export const UserSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
      invalid_type_error: "Name must be a string",
    })
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100)
    .trim(),
  email: z.string({
    required_error: "Email is required",
    invalid_type_error: "Email must be a string",
  }).email({ message: "Invalid email address" }).toLowerCase(),
  phoneNumber: z
    .string()
    .regex(/^\+?[0-9]{7,15}$/, {
      message:
        "Phone must be a valid international number (digits, optional leading +)",
    })
    .optional(),
});

export type User = z.infer<typeof UserSchema>;

export default UserSchema;
