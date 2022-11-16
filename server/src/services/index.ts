import UserService from './UserService';
import InMemoryUserRepository from '../repositories/InMemoryUserRepository';
import { users } from '../users';
import { JWT_EXPIRATION, JWT_SECRET } from '../config';

export const userService: UserService = new UserService(
  new InMemoryUserRepository(users),
  JWT_SECRET,
  JWT_EXPIRATION
);
