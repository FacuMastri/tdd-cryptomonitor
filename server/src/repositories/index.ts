import InMemoryUserRepository from './InMemoryUserRepository';
import { users } from '../users';

export const userRepository: InMemoryUserRepository =
  new InMemoryUserRepository(users);
