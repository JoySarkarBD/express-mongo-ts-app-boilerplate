import bcryptjs from 'bcryptjs';

/**
 * Hashes the given data using bcryptjs.
 *
 * @param {string} data - The data to be hashed.
 * @returns {Promise<string>} - A promise that resolves to the hashed data.
 */
const HashInfo = async (data: string) => {
  // Hash the data using bcryptjs with a salt rounds value of 10
  return await bcryptjs.hash(data, 10);
};

export default HashInfo;
