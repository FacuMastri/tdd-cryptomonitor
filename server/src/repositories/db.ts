import { loadContext } from '../context';
import { loadUsers } from '../users';
import {Context} from "../interpreter/types/context";
import {loadRules} from "../rules";

export const users_db = loadUsers('db/users.json');
export const context_db = loadContext('db/context.json');
export const rules_db = loadRules('db/rules.json');