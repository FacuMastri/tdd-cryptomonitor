import { verify } from 'jsonwebtoken';
import { InvalidTokenError, UserNotFoundError } from './errors';
import { User } from './index';
import UserRepository from './UserRepository';

export default function makeFindUserByJwt(
  userRepository: UserRepository,
  secret: string
) {
  return async (jwt: string): Promise<User> => {
    let userId: number;
    try {
      const payload = verify(jwt, secret) as { id: number };
      userId = payload?.id;
    } catch (err) {
      throw new InvalidTokenError('Invalid token');
    }

    if (!userId) {
      throw new UserNotFoundError('Invalid user');
    }

    return await userRepository.findUserById(userId);
  };
}
