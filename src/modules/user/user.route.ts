// Import Router from express
import { Router } from 'express';

// Import controller from corresponding module
import { 
  createUser,
  createManyUser,
  updateUser,
  updateManyUser,
  deleteUser,
  deleteManyUser,
  getUserById,
  getManyUser
} from './user.controller';

//Import validation from corresponding module
import { validateCreateUser, validateCreateManyUser, validateUpdateUser, validateUpdateManyUser} from './user.validation';
import { validateId, validateIds, validateSearchQueries } from '../../handlers/common-zod-validator';

// Initialize router
const router = Router();

// Define route handlers
/**
 * @route POST /api/v1/user/create-user
 * @description Create a new user
 * @access Public
 * @param {function} validation - ['validateCreateUser']
 * @param {function} controller - ['createUser']
 */
router.post("/create-user", validateCreateUser, createUser);

/**
 * @route POST /api/v1/user/create-user/many
 * @description Create multiple users
 * @access Public
 * @param {function} validation - ['validateCreateManyUser']
 * @param {function} controller - ['createManyUser']
 */
router.post("/create-user/many", validateCreateManyUser, createManyUser);

/**
 * @route PATCH /api/v1/user/update-user/many
 * @description Update multiple users information
 * @access Public
 * @param {function} validation - ['validateIds', 'validateUpdateManyUser']
 * @param {function} controller - ['updateManyUser']
 */
router.patch("/update-user/many", validateIds, validateUpdateManyUser, updateManyUser);

/**
 * @route PATCH /api/v1/user/update-user/:id
 * @description Update user information
 * @access Public
 * @param {IdOrIdsInput['id']} id - The ID of the user to update
 * @param {function} validation - ['validateId', 'validateUpdateUser']
 * @param {function} controller - ['updateUser']
 */
router.patch("/update-user/:id", validateId, validateUpdateUser, updateUser);

/**
 * @route DELETE /api/v1/user/delete-user/many
 * @description Delete multiple users
 * @access Public
 * @param {function} validation - ['validateIds']
 * @param {function} controller - ['deleteManyUser']
 */
router.delete("/delete-user/many", validateIds, deleteManyUser);

/**
 * @route DELETE /api/v1/user/delete-user/:id
 * @description Delete a user
 * @access Public
 * @param {IdOrIdsInput['id']} id - The ID of the user to delete
 * @param {function} validation - ['validateId']
 * @param {function} controller - ['deleteUser']
 */
router.delete("/delete-user/:id", validateId, deleteUser);

/**
 * @route GET /api/v1/user/get-user/many
 * @description Get multiple users
 * @access Public
 * @param {function} validation - ['validateSearchQueries']
 * @param {function} controller - ['getManyUser']
 */
router.get("/get-user/many", validateSearchQueries, getManyUser);

/**
 * @route GET /api/v1/user/get-user/:id
 * @description Get a user by ID
 * @access Public
 * @param {IdOrIdsInput['id']} id - The ID of the user to retrieve
 * @param {function} validation - ['validateId']
 * @param {function} controller - ['getUserById']
 */
router.get("/get-user/:id", validateId, getUserById);

// Export the router
module.exports = router;