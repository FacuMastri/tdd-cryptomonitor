import UserService from './UserService';
import {
  BINANCE_API_KEY,
  BINANCE_API_SECRET,
  JWT_EXPIRATION,
  JWT_SECRET
} from '../config';
import { BinanceService } from './BinanceService';
import { ruleRepository, userRepository } from '../repositories';
import InterpreterService from './InterpreterService';

export const userService: UserService = new UserService(
  userRepository,
  JWT_SECRET,
  JWT_EXPIRATION
);

export const binanceService: BinanceService = new BinanceService(
  BINANCE_API_KEY,
  BINANCE_API_SECRET
);

export const interpreterService: InterpreterService = new InterpreterService(
  ruleRepository
);
