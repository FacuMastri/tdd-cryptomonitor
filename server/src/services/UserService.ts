import UserRepository from '../repositories/UserRepository';
import {
  InvalidTokenError,
  InvalidUserOrPasswordError,
  UserNotFoundError
} from '../users/errors';
import { sign, verify } from 'jsonwebtoken';
import { User } from '../users';

export default class UserService {
  private userRepository: UserRepository;
  private readonly expiration: string;
  private readonly secret: string;

  constructor(
    userRepository: UserRepository,
    secret: string,
    expiration: string
  ) {
    this.userRepository = userRepository;
    this.secret = secret;
    this.expiration = expiration;
  }

  public async createUserJwt(user: string, password: string): Promise<string> {
    const user_obj = await this.userRepository.findUserByNameAndPassword(
      user,
      password
    );

    if (!user_obj) {
      throw new InvalidUserOrPasswordError('Invalid user or password');
    }
    return sign(
      { id: user_obj.id, user: user_obj.user, admin: user_obj.admin },
      this.secret,
      {
        expiresIn: this.expiration
      }
    );
  }

  public async createFederatedJwt(user: string, other = {}): Promise<string> {
    const user_obj = await this.userRepository.findUserByName(user);

    if (!user_obj) {
      throw new InvalidUserOrPasswordError('Invalid user or password');
    }
    return sign(
      { id: user_obj.id, user: user_obj.user, admin: user_obj.admin, ...other },
      this.secret,
      {
        expiresIn: this.expiration
      }
    );
  }

  public async findUserByJwt(jwt: string): Promise<User> {
    let userId: number;
    try {
      const payload = verify(jwt, this.secret) as { id: number };
      userId = payload?.id;
    } catch (err) {
      throw new InvalidTokenError('Invalid token');
    }

    if (!userId) {
      throw new UserNotFoundError('Invalid user');
    }
    return await this.userRepository.findUserById(userId);
  }
}
