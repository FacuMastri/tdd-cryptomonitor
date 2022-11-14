import fs from 'fs';
import { Request, Response } from 'express';
import { Context } from '../interpreter/types/context';

let SystemContext: Context;
export function loadContext(filePath: string) {
  const context_str = fs.readFileSync(filePath, 'utf-8');
  const context_obj = JSON.parse(context_str);

  SystemContext = {
    rules: [],
    ...context_obj
  };
}

export function getRulesController(req: Request, res: Response) {
  const rules = SystemContext.rules;
  res.status(200).send(rules);
}

export function addRulesController(req: Request, res: Response) {
  // TODO: esta linea seria responsabilidad de la persistencia, hay que moverlo al UserRepository
  if (!SystemContext.rules) SystemContext.rules = [];
  // TODO: check if rules are valid
  (SystemContext.rules as any[]).push(req.body);

  res.status(200).send('Rules added');
}
