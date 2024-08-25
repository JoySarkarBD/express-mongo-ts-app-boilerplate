# Resource Generator CLI

## Overview

The Resource Generator CLI is a command-line tool designed to streamline the creation of resource-related files in a Node.js project. It automatically generates route, model, controller, interface, and validation files based on a specified resource name. This tool helps maintain consistency and speed up development by creating boilerplate code for new resources.

## Features

- **Generate Route Files**: Create route files with standard RESTful endpoints for the specified resource.
- **Generate Controller Files**: Create controller files with basic CRUD operations and response handling.
- **Generate Model Files**: Create Mongoose model files with a defined schema.
- **Generate Interface Files**: Create TypeScript interface files defining the structure of the resource.
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

- **Route File**: `src/routes/user/index.ts`
- **Controller File**: `src/modules/user/user.controller.ts`
- **Model File**: `src/modules/user/user.model.ts`
- **Interface File**: `src/modules/user/user.interface.ts`
- **Validation File**: `src/modules/user/user.validation.ts`

## File Structure

### Route File (`index.ts`)

Defines RESTful routes for the resource, including endpoints for creating, updating, deleting, and retrieving resources.

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

### Model File (`user.model.ts`)

Defines a Mongoose schema and model for the resource. Includes:

- Interface for document structure
- Schema definition

### Interface File (`user.interface.ts`)

Provides TypeScript interfaces for the resource, defining the structure of a resource object.

### Validation File (`user.validation.ts`)

Includes Zod validation schemas and middleware functions for validating requests. The validation file ensures that IDs and other required fields are valid.

## Example Files

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
} from '../../modules/user/user.controller';
import { validateUserId } from '../../modules/user/user.validation';

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

### Controller File Example

```typescript
import { Request, Response } from 'express';
import ServerResponse from '../../helpers/responses/custom-response';

export const createUser = async (req: Request, res: Response) => {
  try {
    return ServerResponse(res, true, 201, 'Resource created successfully');
  } catch (error) {
    return ServerResponse(res, false, 500, 'Server error');
  }
};

// ... Other controller functions
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

### Interface File Example

```typescript
export interface TUser {
  // Add fields as needed
}
```

### Validation File Example

```typescript
import { NextFunction, Request, Response } from 'express';
import { isMongoId } from 'validator';
import { z } from 'zod';
import zodErrorHandler from '../../handlers/zod-error-handler';

const zodUserSchema = z
  .object({
    id: z.string().refine((id: string) => isMongoId(id), {
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

export const validateUserId = (req: Request, res: Response, next: NextFunction) => {
  const { error, success } = zodUserSchema.pick({ id: true }).safeParse({ id: req.params.id });

  if (!success) {
    return zodErrorHandler(req, res, error);
  }

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
