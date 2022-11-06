import { NextFunction, Request, Response } from 'express';

export function verifyJwtHeader(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.headers.jwt) {
    return res.status(401).send('No token was provided');
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
