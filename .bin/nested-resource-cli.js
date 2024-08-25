#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { program } = require('commander');

// Define color codes for console output
const GREEN = '\x1b[32m'; // Green color
const BLUE = '\x1b[34m'; // Blue color
const RESET = '\x1b[0m'; // Reset color

program
  .version('1.0.0')
  .description('Generate nested route, model, controller, and interface files for a new resource')
  .argument('<path>', 'Nested path to resource (e.g., folder1/folder2/resourceName)')
  .action((nestedPath) => {
    const parts = nestedPath.split('/');
    const resourceName = parts.pop().toLowerCase();
    const nestedFolders = parts;
    const capitalizedResourceName = capitalize(resourceName);

    const baseDir = path.join(__dirname, '..', 'src');
    const routeDir = path.join(baseDir, 'routes', ...nestedFolders, resourceName);
    const moduleDir = path.join(baseDir, 'modules', ...nestedFolders, resourceName);

    // Function to format file paths relative to project root
    const formatPath = (filePath) => path.relative(path.join(__dirname, '..'), filePath);

    // Create the nested directories
    [routeDir, moduleDir].forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    // Create route file content (similar to the original, adjusted for nested structure)
    const routeContent = `
// Import Router from express
import { Router } from 'express';

// Import controller from corresponding module
import { 
  create${capitalizedResourceName},
  createMany${capitalizedResourceName},
  update${capitalizedResourceName},
  updateMany${capitalizedResourceName},
  delete${capitalizedResourceName},
  deleteMany${capitalizedResourceName},
  get${capitalizedResourceName}ById,
  getMany${capitalizedResourceName}
} from '${Array(nestedFolders.length + 2)
      .fill('..')
      .join('/')}/modules/${nestedFolders.join('/')}/${resourceName}/${resourceName}.controller';
import { validate${capitalizedResourceName}Id } from '${Array(nestedFolders.length + 2)
      .fill('..')
      .join('/')}/modules/${nestedFolders.join('/')}/${resourceName}/${resourceName}.validation';
      
// Initialize router
const router = Router();

// Define route handlers
/**
 * @route POST /api/v1/${nestedFolders.join('/')}/${resourceName}/create-${resourceName}
 * @description Create a new ${resourceName}
 * @access Public
 * @param {function} controller - ['create${capitalizedResourceName}']
 */
router.post("/create-${resourceName}", create${capitalizedResourceName});

/**
 * @route POST /api/v1/${nestedFolders.join('/')}/${resourceName}/create-${resourceName}/many
 * @description Create multiple ${resourceName}s
 * @access Public
 * @param {function} controller - ['createMany${capitalizedResourceName}']
 */
router.post("/create-${resourceName}/many", createMany${capitalizedResourceName});

/**
 * @route PUT /api/v1/${nestedFolders.join('/')}/${resourceName}/update-${resourceName}/many
 * @description Update multiple ${resourceName}s
 * @access Public
 * @param {function} controller - ['updateMany${capitalizedResourceName}']
 */
router.put("/update-${resourceName}/many", updateMany${capitalizedResourceName});

/**
 * @route PUT /api/v1/${nestedFolders.join('/')}/${resourceName}/update-${resourceName}/:id
 * @description Update ${resourceName} information
 * @param {string} id - The ID of the ${resourceName} to update
 * @access Public
 * @param {function} controller - ['update${capitalizedResourceName}']
 * @param {function} validation - ['validate${capitalizedResourceName}Id']
 */
router.put("/update-${resourceName}/:id", validate${capitalizedResourceName}Id, update${capitalizedResourceName});


/**
 * @route DELETE /api/v1/${nestedFolders.join('/')}/${resourceName}/delete-${resourceName}/many
 * @description Delete multiple ${resourceName}s
 * @access Public
 * @param {function} controller - ['deleteMany${capitalizedResourceName}']
 */
router.delete("/delete-${resourceName}/many", deleteMany${capitalizedResourceName});

/**
 * @route DELETE /api/v1/${nestedFolders.join('/')}/${resourceName}/delete-${resourceName}/:id
 * @description Delete a ${resourceName}
 * @param {string} id - The ID of the ${resourceName} to delete
 * @access Public
 * @param {function} controller - ['delete${capitalizedResourceName}']
 * @param {function} validation - ['validate${capitalizedResourceName}Id']
 */
router.delete("/delete-${resourceName}/:id", validate${capitalizedResourceName}Id, delete${capitalizedResourceName});

/**
 * @route GET /api/v1/${nestedFolders.join('/')}/${resourceName}/get-${resourceName}/many
 * @description Get multiple ${resourceName}s
 * @access Public
 * @param {function} controller - ['getMany${capitalizedResourceName}']
 */
router.get("/get-${resourceName}/many", getMany${capitalizedResourceName});

/**
 * @route GET /api/v1/${nestedFolders.join('/')}/${resourceName}/get-${resourceName}/:id
 * @description Get a ${resourceName} by ID
 * @param {string} id - The ID of the ${resourceName} to retrieve
 * @access Public
 * @param {function} controller - ['get${capitalizedResourceName}ById']
 * @param {function} validation - ['validate${capitalizedResourceName}Id']
 */
router.get("/get-${resourceName}/:id", validate${capitalizedResourceName}Id, get${capitalizedResourceName}ById);

// Export the router
module.exports = router;
    `;

    // Path to the route file
    const routeFilePath = path.join(routeDir, 'index.ts');
    fs.writeFileSync(routeFilePath, routeContent.trim());

    // Create controller file content (similar to the original)
    const controllerContent = `
import { Request, Response } from 'express';
import ServerResponse from '${Array(nestedFolders.length + 2)
      .fill('..')
      .join('/')}/helpers/responses/custom-response';

/**
 * Controller function to handle the create operation for ${capitalizedResourceName}.
 *
 * @param {object} req - The request object containing ${resourceName} data in the body.
 * @param {object} res - The response object used to send the response.
 * @returns {void}
 */
export const create${capitalizedResourceName} = async (req: Request, res: Response) => {
  try {
    // TODO: Add logic to create a new ${resourceName}
    return ServerResponse(res, true, 201, 'Resource created successfully');
  } catch (error) {
    return ServerResponse(res, false, 500, 'Server error');
  }
};

/**
 * Controller function to handle the creation of multiple ${resourceName}s.
 *
 * @param {object} req - The request object containing an array of ${resourceName} data in the body.
 * @param {object} res - The response object used to send the response.
 * @returns {void}
 */
export const createMany${capitalizedResourceName} = async (req: Request, res: Response) => {
  try {
    // TODO: Add logic to create multiple ${resourceName}s
    return ServerResponse(res, true, 201, 'Resources created successfully');
  } catch (error) {
    return ServerResponse(res, false, 500, 'Server error');
  }
};

/**
 * Controller function to handle the update operation for a single ${capitalizedResourceName}.
 *
 * @param {object} req - The request object containing ${resourceName} data in the body and the ID in URL parameters.
 * @param {object} res - The response object used to send the response.
 * @returns {void}
 */
export const update${capitalizedResourceName} = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // TODO: Add logic to update a single ${resourceName} by ID
    return ServerResponse(res, true, 200, 'Resource updated successfully');
  } catch (error) {
    return ServerResponse(res, false, 500, 'Server error');
  }
};

/**
 * Controller function to handle the update operation for multiple ${resourceName}s.
 *
 * @param {object} req - The request object containing an array of ${resourceName} data in the body.
 * @param {object} res - The response object used to send the response.
 * @returns {void}
 */
export const updateMany${capitalizedResourceName} = async (req: Request, res: Response) => {
  try {
    // TODO: Add logic to update multiple ${resourceName}s
    return ServerResponse(res, true, 200, 'Resources updated successfully');
  } catch (error) {
    return ServerResponse(res, false, 500, 'Server error');
  }
};

/**
 * Controller function to handle the deletion of a single ${capitalizedResourceName}.
 *
 * @param {object} req - The request object containing the ID of the ${resourceName} to delete in URL parameters.
 * @param {object} res - The response object used to send the response.
 * @returns {void}
 */
export const delete${capitalizedResourceName} = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // TODO: Add logic to delete a single ${resourceName} by ID
    return ServerResponse(res, true, 200, 'Resource deleted successfully');
  } catch (error) {
    return ServerResponse(res, false, 500, 'Server error');
  }
};

/**
 * Controller function to handle the deletion of multiple ${resourceName}s.
 *
 * @param {object} req - The request object containing an array of IDs of ${resourceName}s to delete in the body.
 * @param {object} res - The response object used to send the response.
 * @returns {void}
 */
export const deleteMany${capitalizedResourceName} = async (req: Request, res: Response) => {
  try {
    // TODO: Add logic to delete multiple ${resourceName}s
    return ServerResponse(res, true, 200, 'Resources deleted successfully');
  } catch (error) {
    return ServerResponse(res, false, 500, 'Server error');
  }
};

/**
 * Controller function to handle the retrieval of a single ${capitalizedResourceName} by ID.
 *
 * @param {object} req - The request object containing the ID of the ${resourceName} to retrieve in URL parameters.
 * @param {object} res - The response object used to send the response.
 * @returns {void}
 */
export const get${capitalizedResourceName}ById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // TODO: Add logic to get a single ${resourceName} by ID
    return ServerResponse(res, true, 200, 'Resource retrieved successfully');
  } catch (error) {
    return ServerResponse(res, false, 500, 'Server error');
  }
};

/**
 * Controller function to handle the retrieval of multiple ${resourceName}s.
 *
 * @param {object} req - The request object containing query parameters for filtering.
 * @param {object} res - The response object used to send the response.
 * @returns {void}
 */
export const getMany${capitalizedResourceName} = async (req: Request, res: Response) => {
  try {
    // TODO: Add logic to get multiple ${resourceName}s
    return ServerResponse(res, true, 200, 'Resources retrieved successfully');
  } catch (error) {
    return ServerResponse(res, false, 500, 'Server error');
  }
};
    `;

    // Path to the controller file
    const controllerFilePath = path.join(moduleDir, `${resourceName}.controller.ts`);
    fs.writeFileSync(controllerFilePath, controllerContent.trim());

    // Create model file (similar to the original)
    const modelContent = `
import mongoose, { Document, Schema } from 'mongoose';

interface I${capitalizedResourceName} extends Document {
  // Define the schema fields with their types
}

const ${capitalizedResourceName}Schema: Schema<I${capitalizedResourceName}> = new Schema({
  // Define schema fields here
});

const ${capitalizedResourceName} = mongoose.model<I${capitalizedResourceName}>('${capitalizedResourceName}', ${capitalizedResourceName}Schema);

export default ${capitalizedResourceName};
    `;

    // Path to the model file
    const modelFilePath = path.join(moduleDir, `${resourceName}.model.ts`);
    fs.writeFileSync(modelFilePath, modelContent.trim());

    // Create interface file content (similar to the original)
    const interfaceContent = `
export interface T${capitalizedResourceName} {
  // Add fields as needed
}
    `;

    // Path to the interface file
    const interfaceFilePath = path.join(moduleDir, `${resourceName}.interface.ts`);
    fs.writeFileSync(interfaceFilePath, interfaceContent.trim());

    // Create Zod validation schema file (similar to the original)
    const validationContent = `
import { NextFunction, Request, Response } from 'express';
import { isMongoId } from 'validator';
import { z } from 'zod';
import zodErrorHandler from '${Array(nestedFolders.length + 2)
      .fill('..')
      .join('/')}/handlers/zod-error-handler';

/**
 * Zod schema for validating ${resourceName} data.
 */
const zod${capitalizedResourceName}Schema = z.object({
  id: z
    .string({
      required_error: "Id is required",
      invalid_type_error: "Please provide a valid id",
    })
    .refine((id: string) => isMongoId(id), {
      message: "Please provide a valid id",
    }),
  ids: z
    .array(z.string().refine((id: string) => isMongoId(id), {
      message: "Each ID must be a valid MongoDB ObjectId",
    }))
    .min(1, {
      message: "At least one ID must be provided",
    }),
}).strict();

/**
 * Middleware function to validate ${resourceName} ID using Zod schema.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {void}
 */
export const validate${capitalizedResourceName}Id = (req: Request, res: Response, next: NextFunction) => {
  // Validate request params
  const { error, success } = zod${capitalizedResourceName}Schema.pick({ id: true }).safeParse({ id: req.params.id });

  // Check if validation was successful
  if (!success) {
    // If validation failed, use the Zod error handler to send an error response
    return zodErrorHandler(req, res, error);
  }

  // If validation passed, proceed to the next middleware function
  return next();
};
    `;

    // Path to the zod validation file
    const validationFilePath = path.join(moduleDir, `${resourceName}.validation.ts`);
    fs.writeFileSync(validationFilePath, validationContent.trim());

    // Log the creation of the files
    console.log(
      `${GREEN}CREATE ${RESET}${formatPath(routeFilePath)} ${BLUE}(${Buffer.byteLength(routeContent, 'utf8')} bytes)`
    );
    console.log(
      `${GREEN}CREATE ${RESET}${formatPath(controllerFilePath)} ${BLUE}(${Buffer.byteLength(controllerContent, 'utf8')} bytes)`
    );
    console.log(
      `${GREEN}CREATE ${RESET}${formatPath(interfaceFilePath)} ${BLUE}(${Buffer.byteLength(interfaceContent, 'utf8')} bytes)`
    );
    console.log(
      `${GREEN}CREATE ${RESET}${formatPath(modelFilePath)} ${BLUE}(${Buffer.byteLength(modelContent, 'utf8')} bytes)`
    );
    console.log(
      `${GREEN}CREATE ${RESET}${formatPath(validationFilePath)} ${BLUE}(${Buffer.byteLength(validationContent, 'utf8')} bytes)`
    );
  });

program.parse(process.argv);

// Helper function to capitalize the first letter of a string
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
