import UserService from './UserService';
import InMemoryUserRepository from '../repositories/InMemoryUserRepository';
import { users } from '../users';
import {
  BINANCE_API_KEY,
  BINANCE_API_SECRET,
  JWT_EXPIRATION,
  JWT_SECRET
} from '../config';
import { BinanceService } from './BinanceService';

export const userService: UserService = new UserService(
  new InMemoryUserRepository(users),
  JWT_SECRET,
  JWT_EXPIRATION
);

export const binanceService: BinanceService = new BinanceService(
  BINANCE_API_KEY,
  BINANCE_API_SECRET
);
