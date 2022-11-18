import { loadContext } from '../context';
import { loadUsers } from '../users';

export const users_db = loadUsers('db/users.json');
export const context_db = loadContext('db/context.json');
