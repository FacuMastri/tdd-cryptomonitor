import { Request, Response } from 'express';
import { findUserByJwt } from '../users';
import { getErrorMessage } from './utils';

export function getRulesHandler() {
  return async (req: Request, res: Response) => {
    let user;
    try {
      user = findUserByJwt(req.headers.jwt as string);
    } catch (err) {
      return res.status(401).send(getErrorMessage(err));
    }
    const rules = user.context.rules;
    res.status(200).send(rules);
  };
}

export function addRulesHandler() {
  return async (req: Request, res: Response) => {
    let user;
    try {
      user = findUserByJwt(req.headers.jwt as string);
    } catch (err) {
      return res.status(401).send(getErrorMessage(err));
    }
    user.context.rules = req.body;
    res.status(200).send('Rules added');
  };
}
