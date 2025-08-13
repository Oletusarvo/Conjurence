import jwt from 'jsonwebtoken';

/**Creates a new JWT by calling the jsonwebtoken jwt.sign-method, signing with the JWT_SECRET env-variable, returning the created token.
 * Throws an error if the env-variable is not found.*/
export function createJWT<T extends Record<string, unknown>>(
  payload: T,
  options?: jwt.SignOptions
) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('Failed to create JWT! Reason: JWT_SECRET env-variable missing.');
  }
  return jwt.sign(payload, process.env.JWT_SECRET, options);
}

/**Verifies the given JWT, by calling the jsonwebtoken jwt.verify-method, returning its result. */
export function verifyJWT(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
