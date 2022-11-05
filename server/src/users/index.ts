import fs from 'fs';
import { sign, verify } from 'jsonwebtoken';
import {
  InvalidTokenError,
  InvalidUserOrPasswordError,
  UserNotFoundError
} from './errors';

type User = {
  id: number;
  user: string;
  password: string;
  context: any;
};

const users: Record<string, User> = {};

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

const createUserJwt = (user: string, password: string): string => {
  const user_obj = Object.values(users).find(
    (usr: User) => usr.user === user && usr.password === password
  );

  if (!user_obj) {
    throw new InvalidUserOrPasswordError('Invalid user or password');
  }

  const jwt = sign({ id: user_obj.id, user: user_obj.user }, SECRET, {
    expiresIn: EXPIRATION
  });

  return jwt;
};

const findUserByJwt = (jwt: string): User => {
  let userId: number;
  try {
    const payload = verify(jwt, SECRET) as { id: number };
    userId = payload?.id;
  } catch (err) {
    throw new InvalidTokenError('Invalid token');
  }

  if (!userId) {
    throw new UserNotFoundError('Invalid user');
  }

  return users[userId];
};

export { loadUsers, createUserJwt, findUserByJwt };
