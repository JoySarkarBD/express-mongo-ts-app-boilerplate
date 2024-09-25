// Import the model
import UserModel, { IUser } from './user.model';

/**
 * Service function to create a new user.
 *
 * @param {Partial<IUser>} data - The data to create a new user.
 * @returns {Promise<Partial<IUser>>} - The created user.
 */
const createUser = async (data: Partial<IUser>): Promise<Partial<IUser>> => {
  const newUser = new UserModel(data);
  const savedUser = await newUser.save();
  return savedUser;
};

/**
 * Service function to create multiple user.
 *
 * @param {Partial<IUser>[]} data - An array of data to create multiple user.
 * @returns {Promise<Partial<IUser>[]>} - The created user.
 */
const createManyUser = async (data: Partial<IUser>[]): Promise<Partial<IUser>[]> => {
  const createdUser = await UserModel.insertMany(data);
  return createdUser;
};

/**
 * Service function to update a single user by ID.
 *
 * @param {string} id - The ID of the user to update.
 * @param {Partial<IUser>} data - The updated data for the user.
 * @returns {Promise<Partial<IUser>>} - The updated user.
 */
const updateUser = async (id: string, data: Partial<IUser>): Promise<Partial<IUser | null>> => {
  const updatedUser = await UserModel.findByIdAndUpdate(id, data, { new: true });
  return updatedUser;
};

/**
 * Service function to update multiple user.
 *
 * @param {Array<{ id: string, updates: Partial<IUser> }>} data - An array of data to update multiple user.
 * @returns {Promise<Partial<IUser>[]>} - The updated user.
 */
const updateManyUser = async (data: Array<{ id: string, updates: Partial<IUser> }>): Promise<Partial<IUser>[]> => {
  const updatePromises = data.map(({ id, updates }) =>
    UserModel.findByIdAndUpdate(id, updates, { new: true })
  );
  const updatedUser = await Promise.all(updatePromises);
  // Filter out null values
  const validUpdatedUser = updatedUser.filter(item => item !== null) as IUser[];
  return validUpdatedUser;
};

/**
 * Service function to delete a single user by ID.
 *
 * @param {string} id - The ID of the user to delete.
 * @returns {Promise<Partial<IUser>>} - The deleted user.
 */
const deleteUser = async (id: string): Promise<Partial<IUser | null>> => {
  const deletedUser = await UserModel.findByIdAndDelete(id);
  return deletedUser;
};

/**
 * Service function to delete multiple user.
 *
 * @param {string[]} ids - An array of IDs of user to delete.
 * @returns {Promise<Partial<IUser>[]>} - The deleted user.
 */
const deleteManyUser = async (ids: string[]): Promise<Partial<IUser>[]> => {
  const userToDelete = await UserModel.find({ _id: { $in: ids } });
  if (!userToDelete.length) throw new Error('No user found to delete');
  await UserModel.deleteMany({ _id: { $in: ids } });
  return userToDelete; 
};

/**
 * Service function to retrieve a single user by ID.
 *
 * @param {string} id - The ID of the user to retrieve.
 * @returns {Promise<Partial<IUser>>} - The retrieved user.
 */
const getUserById = async (id: string): Promise<Partial<IUser | null>> => {
  const user = await UserModel.findById(id);
  return user;
};

/**
 * Service function to retrieve multiple user based on query parameters.
 *
 * @param {object} query - The query parameters for filtering user.
 * @returns {Promise<Partial<IUser>[]>} - The retrieved user.
 */
const getManyUser = async (query: object): Promise<Partial<IUser>[]> => {
  const user = await UserModel.find(query);
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