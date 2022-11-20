import { Request, Response } from 'express';
import { interpreterService } from '../services';
import { Rules } from '../interpreter/types/rule';

export const getRulesController = async (req: Request, res: Response) => {
  res.status(200).send(await interpreterService.getAllRules());
};

export const addRulesController = async (req: Request, res: Response) => {
  const { validFor, validIn, rules } = req.body;

  const ruleResult: Rules = await interpreterService.addRules(
    rules,
    validFor,
    validIn
  );
  res.status(200).send(ruleResult);
};
