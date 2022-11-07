import { Request, Response } from 'express';
import { User } from '../users';
import { getErrorMessage } from './utils';

export function makeGetRulesController(
  findUserByJwt: (jwt: string) => Promise<User>
) {
  return async (req: Request, res: Response) => {
    let user;
    try {
      user = await findUserByJwt(req.headers.jwt as string);
    } catch (err) {
      return res.status(401).send(getErrorMessage(err));
    }
    const rules = user.context.rules;
    res.status(200).send(rules);
  };
}

export function makeAddRulesController(
  findUserByJwt: (jwt: string) => Promise<User>
) {
  return async (req: Request, res: Response) => {
    let user;
    try {
      user = await findUserByJwt(req.headers.jwt as string);
    } catch (err) {
      return res.status(401).send(getErrorMessage(err));
    }
    // TODO: esta linea seria responsabilidad de la persistencia, hay que moverlo al UserRepository
    user.context.rules = req.body;
    res.status(200).send('Rules added');
  };
}
