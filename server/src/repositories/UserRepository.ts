import { User } from '../users';

export default interface UserRepository {
  findUserByNameAndPassword(
    user: string,
    password: string
  ): Promise<User | undefined>;
  findUserById(id: number): Promise<User>;
}
