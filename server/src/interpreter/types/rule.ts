import { Action } from './action';
import { BooleanType } from './boolean';

export interface Rule {
  name: string;
  condition: BooleanType;
  actions: Action[];
}

export interface Rules {
  requiredVariables: string[];
  rules: Rule[];
}
