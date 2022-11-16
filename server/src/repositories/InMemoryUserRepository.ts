import { User } from '../users';
import UserRepository from './UserRepository';

export default class InMemoryUserRepository implements UserRepository {
  private readonly users: Record<string, User>;

  constructor(users: Record<string, User>) {
    this.users = users;
  }

  public findUserById(id: number): Promise<User> {
    return Promise.resolve(this.users[id]);
  }

  public findUserByNameAndPassword(
    user: string,
    password: string
  ): Promise<User | undefined> {
    const user_obj = Object.values(this.users).find(
      (usr: User) => usr.user === user && usr.password === password
    );

    return Promise.resolve(user_obj);
  }
}
