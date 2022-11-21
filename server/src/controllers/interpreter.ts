import { Request, Response } from 'express';
import { interpreterService } from '../services';
import {Rule, Rules} from '../interpreter/types/rule';

export const getRulesController = async (req: Request, res: Response) => {
  res.status(200).send(await interpreterService.getAllRules());
};

export const addRulesController = async (req: Request, res: Response) => {
  // TODO: check if rules are valid. Also, this should be req.body.rules
  const { validFor, validIn, rulesJson } = req.body;
  // TODO: check that validFor is a valid Symbol, validIn is a valid SymbolStatus
  // TODO: and ruleJson is a valid Rule
  const rules: Rules = await interpreterService.addRules(
    rulesJson,
    validFor,
    validIn
  );
  res.status(200).send(rules);
};
