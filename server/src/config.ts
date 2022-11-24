import dotenv from 'dotenv';

dotenv.config();

export const BINANCE_API_KEY = process.env.BINANCE_API_KEY ?? '';
export const BINANCE_API_SECRET = process.env.BINANCE_API_SECRET ?? '';
export const JWT_SECRET = process.env.JWT_SECRET || 'mysecret';
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '30d';
export const PORT = process.env.PORT || 8080;
export const CLIENT_ID =
  '283435392885-4q2ph3d1v2nuf98str251pvd1vg5elmq.apps.googleusercontent.com';

// Parameters for default politics
export const DEFAULT_VARIATION_PERC = 0.01;
export const DEFAULT_INTERVAL_IN_HOURS = 1;
export const MIN_SYMBOL_VARIATION_PERC = 0.0005;
