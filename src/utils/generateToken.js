import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRE } from '../config/jwt.js';

/**
 * Generate JWT Token
 * Creates a signed JWT token for user authentication
 * @param {String} userId - User ID to encode in token
 * @returns {String} JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE
  });
};

