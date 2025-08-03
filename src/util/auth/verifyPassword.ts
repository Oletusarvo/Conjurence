import bcrypt from 'bcrypt';
export const verifyPassword = async (password: string, encryptedPassword: string) => {
  return await bcrypt.compare(password, encryptedPassword);
};
