import { NumberCall, NumberType } from './number';
import { BooleanCall, BooleanType } from './boolean';

export const VALUE_CONST = 'CONSTANT';

export interface ValueConstant {
  type: typeof VALUE_CONST;
  value: string;
}

export const VALUE_VAR = 'VARIABLE';

export interface ValueVariable {
  type: typeof VALUE_VAR;
  name: string;
}

export const VALUE_WALLET = 'WALLET';

export interface ValueWallet {
  type: typeof VALUE_WALLET;
  symbol: number;
}

export const VALUE_CALL = 'CALL';

export type ValueCall = NumberCall | BooleanCall;

export type Value =
  | ValueConstant
  | NumberType
  | BooleanType
  | ValueVariable
  | ValueWallet;

export type ValueOutput = number | string | boolean;
