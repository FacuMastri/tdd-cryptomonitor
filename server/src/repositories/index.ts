import InMemoryUserRepository from './InMemoryUserRepository';
import { users_db } from './db';

export const userRepository: InMemoryUserRepository =
  new InMemoryUserRepository(users_db);

/* These are created inside the InterpreterService
export const ruleRepository: InMemoryRuleRepository =
  new InMemoryRuleRepository();

export const variableRepository: InMemoryVariableRepository =
  new InMemoryVariableRepository();
*/
