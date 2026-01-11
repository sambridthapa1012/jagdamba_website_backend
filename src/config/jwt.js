/**
 * JWT Configuration
 * Centralized JWT secret and expiration settings
 */
export const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_change_in_production';
export const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

