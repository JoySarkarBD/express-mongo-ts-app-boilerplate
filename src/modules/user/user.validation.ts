import { z } from 'zod';
import { validate } from '../../handlers/zod-error-handler';

/**
 * User Validation Schemas and Types
 *
 * This module defines Zod schemas for validating user-related
 * requests such as creation (single + bulk) and updates (single + bulk).
 * It also exports corresponding TypeScript types inferred from these schemas.
 * Each schema includes detailed validation rules and custom error messages
 * to ensure data integrity and provide clear feedback to API consumers.
 *
 * Named validator middleware functions are exported for direct use in Express routes.
 */

/**
 * Zod schema for validating data when **creating** a single user.
 * 
 * → Add all **required** fields here
 */
const zodCreateUserSchema = z
  .object({
    // Example fields — replace / expand as needed:
    // name: z.string({ message: 'User name is required' }).min(2, 'Name must be at least 2 characters').max(100),
    // email: z.string().email({ message: 'Invalid email format' }),
    // age: z.number().int().positive().optional(),
    // status: z.enum(['active', 'inactive', 'pending']).default('pending'),
  })
  .strict();

export type CreateUserInput = z.infer<typeof zodCreateUserSchema>;

/**
 * Zod schema for validating **bulk creation** (array of user objects).
 */
const zodCreateManyUserSchema = z
  .array(zodCreateUserSchema)
  .min(1, { message: 'At least one user must be provided for bulk creation' });

export type CreateManyUserInput = z.infer<typeof zodCreateManyUserSchema>;

/**
 * Zod schema for validating data when **updating** an existing user.
 * 
 * → All fields should usually be .optional()
 */
const zodUpdateUserSchema = z
  .object({
    // Example fields — replace / expand as needed:
    // name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
    // email: z.string().email({ message: 'Invalid email format' }).optional(),
    // age: z.number().int().positive().optional(),
    // status: z.enum(['active', 'inactive', 'pending']).optional(),
  })
  .strict();

export type UpdateUserInput = z.infer<typeof zodUpdateUserSchema>;

/**
 * Zod schema for validating **bulk updates** (array of partial user objects).
 */
const zodUpdateManyUserSchema = z
  .array(zodUpdateUserSchema)
  .min(1, { message: 'At least one user update object must be provided' });

export type UpdateManyUserInput = z.infer<typeof zodUpdateManyUserSchema>;

/**
 * Named validators — use these directly in your Express routes
 */
export const validateCreateUser = validate(zodCreateUserSchema);
export const validateCreateManyUser = validate(zodCreateManyUserSchema);

export const validateUpdateUser = validate(zodUpdateUserSchema);
export const validateUpdateManyUser = validate(zodUpdateManyUserSchema);