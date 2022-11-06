import { Request, Response } from 'express';
import { createUserJwt, findUserByJwt } from '../users';
import { getErrorMessage } from './utils';

export function loginHandler() {
  return async (req: Request, res: Response) => {
    const { user, password } = req.body;

    try {
      const jwt = createUserJwt(user, password);
      res.status(200).send(jwt);
    } catch (err) {
      res.status(401).send(getErrorMessage(err));
    }
  };
}

export function verifyJwtHandler() {
  return async (req: Request, res: Response) => {
    try {
      const { id } = findUserByJwt(req.headers.jwt as string);
      res.status(200).send(String(id));
    } catch (err) {
      res.status(401).send(getErrorMessage(err));
    }
  };
}
