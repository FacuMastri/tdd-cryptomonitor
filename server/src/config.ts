import dotenv from 'dotenv';

dotenv.config();

export const BINANCE_API_KEY = process.env.BINANCE_API_KEY ?? '';
export const BINANCE_API_SECRET = process.env.BINANCE_API_SECRET ?? '';
export const JWT_SECRET = process.env.JWT_SECRET || 'mysecret';
export const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '30d';
export const PORT = process.env.PORT || 8080;
export const MIN_SYMBOL_VARIATION_PERC = 0.0005;
