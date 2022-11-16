import InMemoryUserRepository from './InMemoryUserRepository';
import InMemoryRuleRepository from './InMemoryRuleRepository';
import { context_db, users_db } from '../index';

export const userRepository: InMemoryUserRepository =
  new InMemoryUserRepository(users_db);

export const ruleRepository: InMemoryRuleRepository =
  new InMemoryRuleRepository(context_db);
