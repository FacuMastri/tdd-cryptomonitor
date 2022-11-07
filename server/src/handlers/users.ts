import { Request, Response } from 'express';
import { getErrorMessage } from './utils';
import { User } from '../users';

export function makeLoginController(
  createUserJwt: (user: string, password: string) => Promise<string>
) {
  return async (req: Request, res: Response) => {
    const { user, password } = req.body;

    try {
      const jwt = await createUserJwt(user, password);
      res.status(200).send(jwt);
    } catch (err) {
      res.status(401).send(getErrorMessage(err));
    }
  };
}

export function makeVerifyJwtController(
  findUserByJwt: (jwt: string) => Promise<User>
) {
  return async (req: Request, res: Response) => {
    try {
      const { id } = await findUserByJwt(req.headers.jwt as string);
      res.status(200).send(String(id));
    } catch (err) {
      res.status(401).send(getErrorMessage(err));
    }
  };
}
