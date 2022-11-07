import { InvalidUserOrPasswordError } from './errors';
import UserRepository from './UserRepository';
import { sign } from 'jsonwebtoken';

export function makeCreateUserJwt(
  userRepository: UserRepository,
  secret: string,
  expiration: string
) {
  return async (user: string, password: string): Promise<string> => {
    const user_obj = await userRepository.findUserByNameAndPassword(
      user,
      password
    );

    if (!user_obj) {
      throw new InvalidUserOrPasswordError('Invalid user or password');
    }
    return sign({ id: user_obj.id, user: user_obj.user }, secret, {
      expiresIn: expiration
    });
  };
}
