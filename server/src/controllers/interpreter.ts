import { Request, Response } from 'express';
import { interpreterService } from '../services';
import { Rule } from '../interpreter/types/rule';

export const getRulesController = async (req: Request, res: Response) => {
  res.status(200).send(await interpreterService.getRules());
};

export const addRulesController = async (req: Request, res: Response) => {
  // TODO: check if rules are valid. Also this should be req.body.rules
  const rule: Rule = await interpreterService.addRule(req.body);
  res.status(200).send(rule);
};
