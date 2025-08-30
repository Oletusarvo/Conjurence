import bcrypt from 'bcrypt';

/**Verifies a password by comparing it to its encrypted version, using the bcrypt.compare-method. */
export const verifyPassword = async (password: string, encryptedPassword: string) => {
  return await bcrypt.compare(password, encryptedPassword);
};
