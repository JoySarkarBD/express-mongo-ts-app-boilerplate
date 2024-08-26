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

/**
 * Service function to create multiple users.
 *
 * @param data - An array of data to create multiple users.
 * @returns {Promise<User[]>} - The created users.
 */
const createManyUser = async (data: object[]) => {
  return await UserModel.insertMany(data);
};

/**
 * Service function to update a single user by ID.
 *
 * @param id - The ID of the user to update.
 * @param data - The updated data for the user.
 * @returns {Promise<User>} - The updated user.
 */
const updateUser = async (id: string, data: object) => {
  return await UserModel.findByIdAndUpdate(id, data, { new: true });
};

/**
 * Service function to update multiple users.
 *
 * @param data - An array of data to update multiple users.
 * @returns {Promise<User[]>} - The updated users.
 */
const updateManyUser = async (data: { id: string, updates: object }[]) => {
  const updatePromises = data.map(({ id, updates }) =>
    UserModel.findByIdAndUpdate(id, updates, { new: true })
  );
  return await Promise.all(updatePromises);
};

/**
 * Service function to delete a single user by ID.
 *
 * @param id - The ID of the user to delete.
 * @returns {Promise<User>} - The deleted user.
 */
const deleteUser = async (id: string) => {
  return await UserModel.findByIdAndDelete(id);
};

/**
 * Service function to delete multiple users.
 *
 * @param ids - An array of IDs of users to delete.
 * @returns {Promise<User[]>} - The deleted users.
 */
const deleteManyUser = async (ids: string[]) => {
  return await UserModel.deleteMany({ _id: { $in: ids } });
};

/**
 * Service function to retrieve a single user by ID.
 *
 * @param id - The ID of the user to retrieve.
 * @returns {Promise<User>} - The retrieved user.
 */
const getUserById = async (id: string) => {
  return await UserModel.findById(id);
};

/**
 * Service function to retrieve multiple users based on query parameters.
 *
 * @param query - The query parameters for filtering users.
 * @returns {Promise<User[]>} - The retrieved users.
 */
const getManyUser = async (query: object) => {
  return await UserModel.find(query);
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