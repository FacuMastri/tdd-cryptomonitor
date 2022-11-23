import fs from 'fs';
import { cypher, decrypt } from '../services/encryption';

export type User = {
  id: number;
  user: string;
  password: string;
  cypher: cypher;
  admin?: boolean;
};

const loadUsers = (filePath: string): Record<string, User> => {
  const users_str = fs.readFileSync(filePath, 'utf-8');
  const users_obj = JSON.parse(users_str);
  const users: Record<string, User> = {};

  users_obj.forEach((user: User) => {
    users[user.id] = user;
    // TODO: Remove this
    user.password = decrypt(user.cypher);
    console.log(user);
  });
  console.log('Users loaded', users);
  return users;
};

export { loadUsers };
