import UserService from './UserService';
import InMemoryUserRepository from '../users/InMemoryUserRepository';
import { users } from '../users';

export const userService: UserService = new UserService(
  new InMemoryUserRepository(users),
  'mysecret',
  '30d'
);
