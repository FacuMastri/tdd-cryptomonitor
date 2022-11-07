import { User } from './index';

export default interface UserRepository {
  findUserByNameAndPassword(
    user: string,
    password: string
  ): Promise<User | undefined>;
  findUserById(id: number): Promise<User>;
}
