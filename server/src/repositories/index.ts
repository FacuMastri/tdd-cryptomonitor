import InMemoryUserRepository from './InMemoryUserRepository';
import InMemoryRuleRepository from './InMemoryRuleRepository';
import { users_db } from './db';

export const userRepository: InMemoryUserRepository =
  new InMemoryUserRepository(users_db);

export const ruleRepository: InMemoryRuleRepository =
  new InMemoryRuleRepository();
