import { z } from 'zod';

// Zod schema for User validation
export const UserSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }).max(100).trim(),
  email: z.string().email({ message: 'Invalid email address' }).toLowerCase(),
  phoneNumber: z
    .string()
    .regex(/^\+?[0-9]{7,15}$/, { message: 'Phone must be a valid international number (digits, optional leading +)' })
    .optional(),
  photoURL: z.string().url({ message: 'Photo must be a valid URL' }).optional(),
});

export type User = z.infer<typeof UserSchema>;

export default UserSchema;
