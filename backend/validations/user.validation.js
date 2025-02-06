import { z } from 'zod';

export const userRegistrationSchema = z.object({
	firstName: z
	.string().min(3, { message: 'First name must be at least 3 characters long' })
	.regex(/^[a-zA-Z]+$/, { message: 'First name must contain only letters' }), // Regex validation for only letters
	lastName: z
	.string().min(3, { message: 'Last name must be at least 3 characters long' })
	.regex(/^[a-zA-Z]+$/, { message: 'Last name must contain only letters' }),
	email: z.string().email({ message: 'Invalid email format' }),
	gender: z.enum(['male', 'female'], { message: 'Gender is required' }),
	birthDay: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	password: z.string().min(8, { message: 'Password must be at least 8 characters long' })
});

export const userLoginSchema = z.object({
	email: z.string().email({ message: 'Invalid email format' }),
	password: z.string().min(8, { message: 'Please Check Your Password' })
});
