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

export const getVarsController = async (req: Request, res: Response) => {
  res.status(200).send(await interpreterService.getAllVars());
};

export const setVarController = async (req: Request, res: Response) => {
  const { name, value } = req.body;

  if (!name || !value) {
    res
      .status(400)
      .send(`Missing ${!name ? 'name,' : ''} ${!value ? 'value' : ''}`);
    return;
  }

  const result = await interpreterService.setVar(name, value);
  res.status(200).send(result);
};
