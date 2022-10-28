import { VALUE_CALL, VALUE_CONST, ValueCall } from './value';
import {
  OpBinaryNumber,
  OpManyNumbers,
  OpNumber,
  OPS_2_NUMBERS,
  OPS_N_NUMBERS
} from './calls';

export interface NumberConstant {
  type: typeof VALUE_CONST;
  value: number;
}

export interface NumberCallBinary {
  type: typeof VALUE_CALL;
  name: OpBinaryNumber;
  arguments: [NumberType, NumberType];
}

export interface NumberCallMany {
  type: typeof VALUE_CALL;
  name: OpManyNumbers;
  arguments: NumberType[] | NumberData;
}

export interface NumberCallUnary {
  type: typeof VALUE_CALL;
  name: OpNumber;
  arguments: [NumberType];
}

export const NUMBER_DATA = 'DATA';

export interface NumberData {
  type: typeof NUMBER_DATA;
  symbol: string;
  since: number; // seconds ago
  until: number; // seconds ago
  default?: NumberType | NumberType[];
}

export interface WalletDef {
  type: 'WALLET';
  symbol: string;
}

export interface NumberVariable {
  type: 'VARIABLE';
  name: string;
}

export interface ContextDatum {
  value: number;
  timestamp: number;
}

export type ContextData = Record<string, ContextDatum[]>;

export function isNumberCallBinary(call: NumberCall): call is NumberCallBinary {
  return OPS_2_NUMBERS.includes(call.name as any);
}

export function isNumberCallMany(call: ValueCall): call is NumberCallMany {
  return OPS_N_NUMBERS.includes(call.name as any);
}

export type NumberCall = NumberCallBinary | NumberCallMany | NumberCallUnary;
export type NumberType =
  | NumberConstant
  | NumberCall
  | WalletDef
  | NumberVariable;
