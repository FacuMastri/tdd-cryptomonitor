import { Request, Response } from 'express';
import { interpreterService } from '../services';
import { Rules } from '../interpreter/types/rule';
import { sendResponse } from './utils';

export const getRulesController = async (req: Request, res: Response) => {
  sendResponse(res, 200, await interpreterService.getAllRules());
};

export const addRulesController = async (req: Request, res: Response) => {
  const { validFor, validIn, rules } = req.body;

  const ruleResult: Rules = await interpreterService.setRules(
    rules,
    validFor,
    validIn
  );
  sendResponse(res, 200, ruleResult);
};

export const getVarsController = async (req: Request, res: Response) => {
  sendResponse(res, 200, await interpreterService.getAllVars());
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
  sendResponse(res, 200, { [name]: result });
};
