import bcrypt from 'bcrypt';

/**
 * Hashes the passed password using bcrypt. Applies the number of rounds defined in the PASSWORD_HASH_ROUNDS environment variable, or 15 if it is not defined.
 * @param password
 * @returns
 */
export const hashPassword = async (password: string) => {
  const hashRounds = process.env.PASSWORD_HASH_ROUNDS;
  return await bcrypt.hash(password, hashRounds ? parseInt(hashRounds) : 15);
};
