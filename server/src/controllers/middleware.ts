import { NextFunction, Request, Response } from 'express';
import { findUserByJwt, User } from '../users';

export async function verifyJwtHeader(
  req: Request & { user?: User },
  res: Response,
  next: NextFunction
) {
  try {
    const jwt = String(req.headers.jwt);
    const user = await findUserByJwt(jwt);
    req.user = user;
  } catch {
    return res.status(401).send('Token error');
  }
  next();
}

export function verifyCredentialsBody(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.body.user) {
    return res.status(401).send('No user provided');
  }
  if (!req.body.password) {
    return res.status(401).send('No password provided');
  }
  next();
}

export function verifyRulesBody(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.body.rules || !req.body.requiredVariables) {
    return res.status(406).send('Invalid rules, verify the format required');
  }
  next();
}
