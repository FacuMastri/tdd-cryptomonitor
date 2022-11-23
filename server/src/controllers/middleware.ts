import { NextFunction, Request, Response } from 'express';
import { User } from '../users';
import { userService } from '../services';
import Ajv from 'ajv';
import RulesSchema from '../schemas/Rules.json';
import { isMarketStatus, symbolMarketStatuses } from '../services/types';
import { Rules } from '../interpreter/types/rule';
import { monitorService } from '../services';

const ajv = new Ajv();
const validateRules = ajv.compile<Rules>(RulesSchema);

export async function verifyJwtHeader(
  req: Request & { user?: User },
  res: Response,
  next: NextFunction
) {
  try {
    const jwt = String(req.headers.jwt);
    req.user = await userService.findUserByJwt(jwt);
  } catch {
    return res.status(401).send('Token error');
  }
  next();
}
export async function verifyJwtHeaderAdmin(
  req: Request & { user?: User },
  res: Response,
  next: NextFunction
) {
  try {
    const jwt = String(req.headers.jwt);
    const user = await userService.findUserByJwt(jwt);
    if (!user.admin) return res.status(403).send('Not an admin');
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
  if (req.body.google) return next();
  if (!req.body.user) return res.status(401).send('No user provided');
  if (!req.body.password) return res.status(401).send('No password provided');

  next();
}

export async function verifyRulesBody(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { validFor, validIn, rules } = req.body;
  const symbols = await monitorService.getValidSymbols();

  if (!symbols.includes(validFor)) {
    return res
      .status(406)
      .send('validFor must be one of ' + symbols.join(', '));
  }

  if (!isMarketStatus(validIn)) {
    res
      .status(406)
      .send('validIn must be one of ' + symbolMarketStatuses.join(', '));
    return;
  }

  const validRules = validateRules(rules);
  if (!validRules) {
    const errors = validateRules.errors?.map(
      (e) => `${e.instancePath}: ${e.message}`
    );
    const errorMsg = errors
      ?.filter((item, index) => errors.indexOf(item) === index) // remove duplicates
      .join(', ');
    res.status(406).send(`Invalid rules: ${errorMsg}`);
    return;
  }

  next();
}
