# Resource Generator CLI

## Overview

The Resource Generator CLI is a command-line tool designed to streamline the creation of resource-related files in a Node.js project. It automatically generates route, model, controller, interface, and validation files based on a specified resource name. This tool helps maintain consistency and speed up development by creating boilerplate code for new resources.

## Features

- **Generate Controller Files**: Create controller files with basic CRUD operations and response handling.
- **Generate Interface Files**: Create TypeScript interface files defining the structure of the resource.
- **Generate Model Files**: Create Mongoose model files with a defined schema.
- **Generate Route Files**: Create route files with standard RESTful endpoints for the specified resource.
- **Generate Service Files**: Create service files include standard RESTful endpoints for managing resources.
- **Generate Validation Files**: Create Zod validation schemas and middleware for request validation.

## Installation

**To use the CLI tool, clone the repository and install the dependencies.**

```bash
git clone <repository-url>
cd <repository-directory>
```

**To install dependencies using npm**:

```bash
npm install
```

**To install dependencies using Yarn**:

```bash
yarn install
```

**To install dependencies using pnpm**:

```bash
pnpm install
```

## Usage

**The CLI tool can be executed using the following command(direct resource)**:

**By using npm**:

```bash
npm run generate <resource-name>
```

**By using yarn**:

```bash
yarn run generate <resource-name>
```

**By using pnpm**:

```bash
pnpm run generate <resource-name>
```

### Command Arguments

- `<resource-name>`: The name of the resource for which you want to generate files. This will be converted to lowercase and used to create file names and paths.

### Example

To generate files for a resource named `user`, run:

```bash
npm run generate user
```

This will create the following files:

- **Controller File**: `src/modules/user/user.controller.ts`
- **Interface File**: `src/modules/user/user.interface.ts`
- **Model File**: `src/modules/user/user.model.ts`
- **Route File**: `src/modules/user/user.route.ts`
- **Service File**: `src/modules/user/user.service.ts`
- **Validation File**: `src/modules/user/user.validation.ts`

## File Structure

### Controller File (`user.controller.ts`)

Contains controller functions for handling HTTP requests, including:

- `createUser`
- `createManyUsers`
- `updateUser`
- `updateManyUsers`
- `deleteUser`
- `deleteManyUsers`
- `getUserById`
- `getManyUsers`

### Interface File (`user.interface.ts`)

Provides TypeScript interfaces for the resource, defining the structure of a resource object.

### Model File (`user.model.ts`)

Defines a Mongoose schema and model for the resource. Includes:

- Interface for document structure
- Schema definition

### Route File (`user.route.ts`)

Defines RESTful routes for the resource, including endpoints for creating, updating, deleting, and retrieving resources.

### Service File (`user.service.ts`)

The `user.service.ts` file contains service functions for managing user resources in the application. These functions interact with the `UserModel` to perform CRUD (Create, Read, Update, Delete) operations on user data.

### Validation File (`user.validation.ts`)

Includes Zod validation schemas and middleware functions for validating requests. The validation file ensures that IDs and other required fields are valid.

## Example Files

### Controller File Example

```typescript
import { Request, Response } from 'express';
import { userServices } from './user.service';
import ServerResponse from '../../helpers/responses/custom-response';
import catchAsync from '../../utils/catch-async/catch-async';

export const createUser = catchAsync(async (req: Request, res: Response) => {
  // Call the service method to create a new user and get the result
  const result = await userServices.createUser(req.body);
  // Send a success response with the created resource data
  ServerResponse(res, true, 201, 'User created successfully', result);
});

// ... Other controller functions
```

### Interface File Example

```typescript
export interface TUser {
  // Add fields as needed
}
```

### Model File Example

```typescript
import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  // Define schema fields here
}

const UserSchema: Schema<IUser> = new Schema({
  // Define schema fields here
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
```

### Route File Example

```typescript
// Import Router from express
import { Router } from 'express';

// Import controller from corresponding module
import {
  createUser,
  createManyUsers,
  updateUser,
  updateManyUsers,
  deleteUser,
  deleteManyUsers,
  getUserById,
  getManyUsers,
} from './user.controller';
import { validateUserId } from './user.validation';

// Initialize router
const router = Router();

// Define route handlers
router.post('/create-user', createUser);
router.post('/create-user/many', createManyUsers);
router.put('/update-user/many', updateManyUsers);
router.put('/update-user/:id', validateUserId, updateUser);
router.delete('/delete-user/many', deleteManyUsers);
router.delete('/delete-user/:id', validateUserId, deleteUser);
router.get('/get-user/many', getManyUsers);
router.get('/get-user/:id', validateUserId, getUserById);

// Export the router
export default router;
```

### Service File Example

```typescript
// Import the model
import UserModel from './user.model';

/**
 * Service function to create a new user.
 *
 * @param data - The data to create a new user.
 * @returns {Promise<User>} - The created user.
 */
const createUser = async (data: object) => {
  const newUser = new UserModel(data);
  return await newUser.save();
};
```

### Validation File Example

```typescript
import { NextFunction, Request, Response } from 'express';
import { isMongoId } from 'validator';
import { z } from 'zod';
import zodErrorHandler from '../../handlers/zod-error-handler';

/**
 * Zod schema for validating user data.
 */
const zodUserSchema = z
  .object({
    id: z
      .string({
        required_error: 'Id is required',
        invalid_type_error: 'Please provide a valid id',
      })
      .refine((id: string) => isMongoId(id), {
        message: 'Please provide a valid id',
      }),
    ids: z
      .array(
        z.string().refine((id: string) => isMongoId(id), {
          message: 'Each ID must be a valid MongoDB ObjectId',
        })
      )
      .min(1, {
        message: 'At least one ID must be provided',
      }),
  })
  .strict();

/**
 * Middleware function to validate user ID using Zod schema.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {void}
 */
export const validateUserId = (req: Request, res: Response, next: NextFunction) => {
  // Validate request params
  const { error, success } = zodUserSchema.pick({ id: true }).safeParse({ id: req.params.id });

  // Check if validation was successful
  if (!success) {
    // If validation failed, use the Zod error handler to send an error response
    return zodErrorHandler(req, res, error);
  }

  // If validation passed, proceed to the next middleware function
  return next();
};
```

---

### Nested CLI Commands

The CLI tool can be executed using the following command(nested resource):

**By using npm**:

```bash
npm run generate folder1/folder2/<resource-name>
```

**By using yarn**:

```bash
yarn run generate folder1/folder2/<resource-name>
```

**By using pnpm**:

```bash
pnpm run generate folder1/folder2/<resource-name>
```

**It will act same like the previous command but it will generate the resources as nested you want.**

## Contact

For any questions or feedback, please contact [JoySarkar] at [developer.joysarkar@gmail.com].

---

Feel free to adjust any sections to better fit your project's specifics or personal preferences!
