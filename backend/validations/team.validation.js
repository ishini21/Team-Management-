import { z } from 'zod';

export const addTeamSchema = z.object({
	teamName: z
		.string()
		.min(1, { message: 'Team name is required' })
		.max(255, { message: 'Team name must be at most 255 characters long' }),
	gameName: z.enum(['cricket', 'volleyball'], { message: 'Invalid game name' }),
	teamSize: z
		.number()
		.int()
		.positive({ message: 'Team size must be a positive integer' })
		.min(1, { message: 'Team size is required' }),
	genderGroup: z.enum(['male', 'female'], { message: 'Invalid gender group' }),
	minAge: z
		.number()
		.int()
		.positive({ message: 'Minimum age must be a positive integer' })
		.min(19, { message: 'Minimum age is required (It should be more than 18)' }),
	maxAge: z.number().int().positive(),
	playerIds: z.array(z.string(), { message: 'Player IDs must be an array of strings' }).optional()
});

export const updateTeamSchema = z.object({
	teamName: z
		.string()
		.min(1, { message: 'Team name is required' })
		.max(255, { message: 'Team name must be at most 255 characters long' }),
	gameName: z.enum(['cricket', 'volleyball'], { message: 'Invalid game name' }),
	teamSize: z
		.number()
		.int()
		.positive({ message: 'Team size must be a positive integer' })
		.min(1, { message: 'Team size is required' }),
	genderGroup: z.enum(['male', 'female'], { message: 'Invalid gender group' }),
	minAge: z
		.number()
		.int()
		.positive({ message: 'Minimum age must be a positive integer' })
		.min(19, { message: 'Minimum age is required (It should be more than 18)' }),
	maxAge: z.number().int().positive({ message: 'Maximum age must be a positive integer' })
    .refine((val) => val >= 30, { message: 'Maximum age must be at least 30' }), // ensuring maxAge is not less than 30
	playerIds: z.array(z.string(), { message: 'Player IDs must be an array of strings' }).optional()
});
