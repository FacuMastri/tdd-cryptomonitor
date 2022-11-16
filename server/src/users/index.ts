import fs from 'fs';

export type User = {
  id: number;
  user: string;
  password: string;
  admin?: boolean;
};

export const users: Record<string, User> = {};

const loadUsers = (filePath: string) => {
  const users_str = fs.readFileSync(filePath, 'utf-8');
  const users_obj = JSON.parse(users_str);

  users_obj.forEach((user: User) => {
    users[user.id] = user;
  });

  console.log('Users loaded', users);
};

export { loadUsers };
