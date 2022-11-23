import { encrypt } from '../services/encryption';
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

  public findUserByName(user: string): Promise<User | undefined> {
    const user_obj = Object.values(this.users).find(
      (user_obj) => user_obj.user === user
    );

    return Promise.resolve(user_obj);
  }

  public findUserByNameAndPassword(
    user: string,
    password: string
  ): Promise<User | undefined> {
    const cypher = encrypt(password);
    const user_obj = Object.values(this.users).find(
      (usr: User) =>
        usr.user === user &&
        usr.cypher.iv === cypher.iv &&
        usr.cypher.encryptedData === cypher.encryptedData
    );

    return Promise.resolve(user_obj);
  }
}
