import fs from 'fs';
import { makeCreateUserJwt } from './createUserJwt';
import InMemoryUserRepository from './InMemoryUserRepository';
import makeFindUserByJwt from './verifyUserJwt';

export type User = {
  id: number;
  user: string;
  password: string;
  admin?: boolean;
};

export const users: Record<string, User> = {};

// TODO: This is not a good way to store jwt config
const SECRET = 'mysecret';
const EXPIRATION = '30d';

const loadUsers = (filePath: string) => {
  const users_str = fs.readFileSync(filePath, 'utf-8');
  const users_obj = JSON.parse(users_str);

  users_obj.forEach((user: User) => {
    users[user.id] = user;
  });

  console.log('Users loaded', users);
};

// TODO: mover esto a un UserService asi no repetimos la logica por todos lados
export const createUserJwt = makeCreateUserJwt(
  new InMemoryUserRepository(users),
  SECRET,
  EXPIRATION
);

export const findUserByJwt = makeFindUserByJwt(
  new InMemoryUserRepository(users),
  SECRET
);

export { loadUsers };
