import { Value } from './value';
import { Action } from './action';

export interface Rule {
  name: string;
  condition: Value;
  action: Action[];
}
