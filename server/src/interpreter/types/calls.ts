import { ValueCall } from './value';
import { NumberCall } from './number';
import { BooleanCall } from './boolean';

export const EQUAL = '==';
export const DISTINCT = 'DISTINCT';
export const LESS = '<';
export const LESS_EQUAL = '<=';
export const GREATER = '>';
export const GREATER_EQUAL = '>=';
export const AND = 'AND';
export const OR = 'OR';
export const NOT = 'NOT';
export const NEGATE = 'NEGATE';
export const PLUS = '+';
export const MINUS = '-';
export const MULTIPLY = '*';
export const DIVIDE = '/';
export const MIN = 'MIN';
export const MAX = 'MAX';
export const AVERAGE = 'AVERAGE';
export const STDDEV = 'STDDEV';
export const FIRST = 'FIRST';
export const LAST = 'LAST';

export const OPS_N_NUMBERS = [
  PLUS,
  MULTIPLY,
  MIN,
  MAX,
  AVERAGE,
  STDDEV,
  FIRST,
  LAST
] as const;
export const OPS_2_NUMBERS = [MINUS, DIVIDE] as const;
export const OPS_1_NUMBER = [NEGATE] as const;

export type OpManyNumbers = typeof OPS_N_NUMBERS[number];
export type OpBinaryNumber = typeof OPS_2_NUMBERS[number];
export type OpUnaryNumber = typeof OPS_1_NUMBER[number];

export type OpNumber = OpManyNumbers | OpBinaryNumber | OpUnaryNumber;

export const OPS_COMP_N_NUMBERS = [
  LESS,
  LESS_EQUAL,
  GREATER,
  GREATER_EQUAL
] as const;
export const OPS_COMP_N_VALUES = [EQUAL, DISTINCT] as const;
export const OPS_1_BOOLEAN = [NOT] as const;

export const OPS_COMP_N_BOOLEANS = [AND, OR] as const;

export type OpCompManyBooleans = typeof OPS_COMP_N_BOOLEANS[number];
export type OpCompManyNumbers = typeof OPS_COMP_N_NUMBERS[number];
export type OpUnaryBoolean = typeof OPS_1_BOOLEAN[number];

export type OpCompManyValues = typeof OPS_COMP_N_VALUES[number];

export function isBooleanCall(call: ValueCall): call is BooleanCall {
  return (
    OPS_COMP_N_BOOLEANS.includes(call.name as never) ||
    OPS_COMP_N_NUMBERS.includes(call.name as never) ||
    OPS_COMP_N_VALUES.includes(call.name as never) ||
    call.name == NOT
  );
}

export function isNumberCall(call: ValueCall): call is NumberCall {
  return (
    OPS_N_NUMBERS.includes(call.name as never) ||
    OPS_2_NUMBERS.includes(call.name as never) ||
    OPS_1_NUMBER.includes(call.name as never)
  );
}
