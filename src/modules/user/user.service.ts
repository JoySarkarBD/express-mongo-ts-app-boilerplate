// Import the model
import mongoose from 'mongoose';
import UserModel, { IUser } from './user.model';
import { IdOrIdsInput, SearchQueryInput } from '../../handlers/common-zod-validator';
import {
  CreateUserInput,
  CreateManyUserInput,
  UpdateUserInput,
  UpdateManyUserInput,
} from './user.validation';

/**
 * Service function to create a new user.
 *
 * @param {CreateUserInput} data - The data to create a new user.
 * @returns {Promise<Partial<IUser>>} - The created user.
 */
const createUser = async (data: CreateUserInput): Promise<Partial<IUser>> => {
  const newUser = new UserModel(data);
  const savedUser = await newUser.save();
  return savedUser;
};

/**
 * Service function to create multiple users.
 *
 * @param {CreateManyUserInput} data - An array of data to create multiple users.
 * @returns {Promise<Partial<IUser>[]>} - The created users.
 */
const createManyUser = async (data: CreateManyUserInput): Promise<Partial<IUser>[]> => {
  const createdUser = await UserModel.insertMany(data);
  return createdUser;
};

/**
 * Service function to update a single user by ID.
 *
 * @param {IdOrIdsInput['id']} id - The ID of the user to update.
 * @param {UpdateUserInput} data - The updated data for the user.
 * @returns {Promise<Partial<IUser>>} - The updated user.
 */
const updateUser = async (id: IdOrIdsInput['id'], data: UpdateUserInput): Promise<Partial<IUser | null>> => {
  // Check for duplicate (filed) combination
  const existingUser = await UserModel.findOne({
    _id: { $ne: id }, // Exclude the current document
    $or: [{ /* filedName: data.filedName, */ }],
  }).lean();
  // Prevent duplicate updates
  if (existingUser) {
    throw new Error('Duplicate detected: Another user with the same fieldName already exists.');
  }
  // Proceed to update the user
  const updatedUser = await UserModel.findByIdAndUpdate(id, data, { new: true });
  return updatedUser;
};

/**
 * Service function to update multiple users.
 *
 * @param {UpdateManyUserInput} data - An array of data to update multiple users.
 * @returns {Promise<Partial<IUser>[]>} - The updated users.
 */
const updateManyUser = async (data: UpdateManyUserInput): Promise<Partial<IUser>[]> => {
// Early return if no data provided
  if (data.length === 0) {
    return [];
  }
  // Convert string ids to ObjectId (for safety)
  const objectIds = data.map((item) => new mongoose.Types.ObjectId(item.id));
  // Check for duplicates (filedName) excluding the documents being updated
  const existingUser = await UserModel.find({
    _id: { $nin: objectIds }, // Exclude documents being updated
    $or: data.flatMap((item) => [
      // { filedName: item.filedName },
    ]),
  }).lean();
  // If any duplicates found, throw error
  if (existingUser.length > 0) {
    throw new Error(
      'Duplicate detected: One or more user with the same fieldName already exist.'
    );
  }
  // Prepare bulk operations
  const operations = data.map((item) => ({
    updateOne: {
      filter: { _id: new mongoose.Types.ObjectId(item.id) },
      update: { $set: item },
      upsert: false,
    },
  }));
  // Execute bulk update
  const bulkResult = await UserModel.bulkWrite(operations, {
    ordered: true, // keep order of operations
  });
  // check if all succeeded
  if (bulkResult.matchedCount !== data.length) {
    throw new Error('Some documents were not found or updated');
  }
  // Fetch the freshly updated documents
  const updatedDocs = await UserModel.find({ _id: { $in: objectIds } })
    .lean()
    .exec();
  // Map back to original input order
  const resultMap = new Map<string, any>(updatedDocs.map((doc) => [doc._id.toString(), doc]));
  // Ensure the result array matches the input order
  const orderedResults = data.map((item) => {
    const updated = resultMap.get(item.id);
    return updated || { _id: item.id };
  });
  return orderedResults as Partial<IUser>[];
};

/**
 * Service function to delete a single user by ID.
 *
 * @param {IdOrIdsInput['id']} id - The ID of the user to delete.
 * @returns {Promise<Partial<IUser>>} - The deleted user.
 */
const deleteUser = async (id: IdOrIdsInput['id']): Promise<Partial<IUser | null>> => {
  const deletedUser = await UserModel.findByIdAndDelete(id);
  return deletedUser;
};

/**
 * Service function to delete multiple users.
 *
 * @param {IdOrIdsInput['ids']} ids - An array of IDs of users to delete.
 * @returns {Promise<Partial<IUser>[]>} - The deleted users.
 */
const deleteManyUser = async (ids: IdOrIdsInput['ids']): Promise<Partial<IUser>[]> => {
  const userToDelete = await UserModel.find({ _id: { $in: ids } });
  if (!userToDelete.length) throw new Error('No User found to delete');
  await UserModel.deleteMany({ _id: { $in: ids } });
  return userToDelete; 
};

/**
 * Service function to retrieve a single user by ID.
 *
 * @param {IdOrIdsInput['id']} id - The ID of the user to retrieve.
 * @returns {Promise<Partial<IUser>>} - The retrieved user.
 */
const getUserById = async (id: IdOrIdsInput['id']): Promise<Partial<IUser | null>> => {
  const user = await UserModel.findById(id);
  return user;
};

/**
 * Service function to retrieve multiple user based on query parameters.
 *
 * @param {SearchQueryInput} query - The query parameters for filtering user.
 * @returns {Promise<Partial<IUser>[]>} - The retrieved users.
 */
const getManyUser = async (query: SearchQueryInput): Promise<{ users: Partial<IUser>[]; totalData: number; totalPages: number }> => {
  const { searchKey = '', showPerPage = 10, pageNo = 1 } = query;
  // Build the search filter based on the search key
  const searchFilter = {
    $or: [
      // { fieldName: { $regex: searchKey, $options: 'i' } },
      // Add more fields as needed
    ],
  };
  // Calculate the number of items to skip based on the page number
  const skipItems = (pageNo - 1) * showPerPage;
  // Find the total count of matching users
  const totalData = await UserModel.countDocuments(searchFilter);
  // Calculate the total number of pages
  const totalPages = Math.ceil(totalData / showPerPage);
  // Find users based on the search filter with pagination
  const users = await UserModel.find(searchFilter)
    .skip(skipItems)
    .limit(showPerPage)
    .select(''); // Keep/Exclude any field if needed
  return { users, totalData, totalPages };
};

export const userServices = {
  createUser,
  createManyUser,
  updateUser,
  updateManyUser,
  deleteUser,
  deleteManyUser,
  getUserById,
  getManyUser,
};