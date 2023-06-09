import UserService from './UserService';
import {
  BINANCE_API_KEY,
  BINANCE_API_SECRET,
  JWT_EXPIRATION,
  JWT_SECRET
} from '../config';
import { BinanceService } from './BinanceService';
import { userRepository } from '../repositories';
import InterpreterService from './InterpreterService';
import MonitorService from './MonitorService';

const test_mode = process.env.NODE_ENV === 'test';

export const userService: UserService = new UserService(
  userRepository,
  JWT_SECRET,
  JWT_EXPIRATION
);

export const binanceService: BinanceService = new BinanceService(
  BINANCE_API_KEY,
  BINANCE_API_SECRET
);

export const interpreterService: InterpreterService = new InterpreterService();

export const monitorService: MonitorService = new MonitorService(!test_mode);
