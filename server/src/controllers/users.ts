import { Request, Response } from 'express';
import { getErrorMessage } from './utils';
import { userService } from '../services';

export const loginController = async (req: Request, res: Response) => {
  const { user, password } = req.body;

  try {
    const jwt = await userService.createUserJwt(user, password);
    res.status(200).send(jwt);
  } catch (err) {
    res.status(401).send(getErrorMessage(err));
  }
};

export const verifyJwtController = async (req: Request, res: Response) => {
  try {
    const { id } = await userService.findUserByJwt(req.headers.jwt as string);
    res.status(200).send(String(id));
  } catch (err) {
    res.status(401).send(getErrorMessage(err));
  }
};
