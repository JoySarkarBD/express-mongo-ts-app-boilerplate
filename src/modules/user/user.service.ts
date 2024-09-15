// Import the model
import UserModel, { IUser } from './user.model';

/**
 * Service function to create a new user.
 *
 * @param {Partial<IUser>} data - The data to create a new user.
 * @returns {Promise<Partial<IUser>>} - The created user.
 * @throws {Error} - Throws an error if the user creation fails.
 */
const createUser = async (data: Partial<IUser>): Promise<Partial<IUser>> => {
  const newUser = new UserModel(data);
  const savedUser = await newUser.save();
  if (!savedUser) throw new Error('Failed to create user');
  return savedUser;
};

/**
 * Service function to create multiple user.
 *
 * @param {Partial<IUser>[]} data - An array of data to create multiple user.
 * @returns {Promise<Partial<IUser>[]>} - The created user.
 * @throws {Error} - Throws an error if the user creation fails.
 */
const createManyUser = async (data: Partial<IUser>[]): Promise<Partial<IUser>[]> => {
  const createdUser = await UserModel.insertMany(data);
  if (!createdUser) throw new Error('Failed to create multiple user');
  return createdUser;
};

/**
 * Service function to update a single user by ID.
 *
 * @param {string} id - The ID of the user to update.
 * @param {Partial<IUser>} data - The updated data for the user.
 * @returns {Promise<Partial<IUser>>} - The updated user.
 * @throws {Error} - Throws an error if the user update fails.
 */
const updateUser = async (id: string, data: Partial<IUser>): Promise<Partial<IUser>> => {
  const updatedUser = await UserModel.findByIdAndUpdate(id, data, { new: true });
  if (!updatedUser) throw new Error('Failed to update user');
  return updatedUser;
};

/**
 * Service function to update multiple user.
 *
 * @param {Array<{ id: string, updates: Partial<IUser> }>} data - An array of data to update multiple user.
 * @returns {Promise<Partial<IUser>[]>} - The updated user.
 * @throws {Error} - Throws an error if the user update fails.
 */
const updateManyUser = async (data: Array<{ id: string, updates: Partial<IUser> }>): Promise<Partial<IUser>[]> => {
  const updatePromises = data.map(({ id, updates }) =>
    UserModel.findByIdAndUpdate(id, updates, { new: true })
  );
  const updatedUser = await Promise.all(updatePromises);
  
  // Filter out null values
  const validUpdatedUser = updatedUser.filter(item => item !== null) as IUser[];

  if (!validUpdatedUser.length) throw new Error('Failed to update multiple user');
  return validUpdatedUser;
};

/**
 * Service function to delete a single user by ID.
 *
 * @param {string} id - The ID of the user to delete.
 * @returns {Promise<Partial<IUser>>} - The deleted user.
 * @throws {Error} - Throws an error if the user deletion fails.
 */
const deleteUser = async (id: string): Promise<Partial<IUser>> => {
  const deletedUser = await UserModel.findByIdAndDelete(id);
  if (!deletedUser) throw new Error('Failed to delete user');
  return deletedUser;
};

/**
 * Service function to delete multiple user.
 *
 * @param {string[]} ids - An array of IDs of user to delete.
 * @returns {Promise<Partial<IUser>[]>} - The deleted user.
 * @throws {Error} - Throws an error if the user deletion fails.
 */
const deleteManyUser = async (ids: string[]): Promise<Partial<IUser>[]> => {
  const userToDelete = await UserModel.find({ _id: { $in: ids } });
  if (!userToDelete.length) throw new Error('No user found to delete');

  const deleteResult = await UserModel.deleteMany({ _id: { $in: ids } });
  if (deleteResult.deletedCount === 0) throw new Error('Failed to delete multiple user');
  
  return userToDelete;  // Return the documents that were deleted
};

/**
 * Service function to retrieve a single user by ID.
 *
 * @param {string} id - The ID of the user to retrieve.
 * @returns {Promise<Partial<IUser>>} - The retrieved user.
 * @throws {Error} - Throws an error if the user retrieval fails.
 */
const getUserById = async (id: string): Promise<Partial<IUser>> => {
  const user = await UserModel.findById(id);
  if (!user) throw new Error('user not found');
  return user;
};

/**
 * Service function to retrieve multiple user based on query parameters.
 *
 * @param {object} query - The query parameters for filtering user.
 * @returns {Promise<Partial<IUser>[]>} - The retrieved user.
 * @throws {Error} - Throws an error if the user retrieval fails.
 */
const getManyUser = async (query: object): Promise<Partial<IUser>[]> => {
  const user = await UserModel.find(query);
  if (!user) throw new Error('Failed to retrieve user');
  return user;
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