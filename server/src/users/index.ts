import fs from 'fs';
import crypto from 'crypto';
import { HttpError } from '../routes/routes';

type User = {
  id: number;
  user: string;
  password: string;
  context: any;
};

const users: Record<string, User> = {};
const sessions: Record<string, number> = {};

const loadUsers = (filePath: string) => {
  const users_str = fs.readFileSync(filePath, 'utf-8');
  const users_obj = JSON.parse(users_str);

  users_obj.forEach((user: User) => {
    users[user.id] = user;
  });

  console.log('Users loaded', users);
};

const createUserSession = (user: string, password: string): string => {
  const user_obj = Object.values(users).find(
    (usr: User) => usr.user === user && usr.password === password
  );

  if (!user_obj) {
    throw new HttpError(401, 'Invalid user or password');
  }

  const sessionId = crypto.randomUUID();
  sessions[sessionId] = user_obj.id;

  return sessionId;
};

const getUserFromSession = (sessionId: string): User => {
  const userId = sessions[sessionId];

  if (!userId) {
    throw new HttpError(401, 'Invalid session');
  }

  return users[userId];
};

export { loadUsers, createUserSession, getUserFromSession };
