import { Value, VALUE_CALL, VALUE_CONST } from './value';
import {
  OpCompManyBooleans,
  OpCompManyNumbers,
  OpCompManyValues,
  OpUnaryBoolean
} from './calls';
import { NumberType } from './number';

export interface BooleanCallCompNumbers {
  type: typeof VALUE_CALL;
  name: OpCompManyNumbers;
  arguments: NumberType[];
}

export interface BooleanCallCompBooleans {
  type: typeof VALUE_CALL;
  name: OpCompManyBooleans;
  arguments: BooleanType[];
}

export interface BooleanCallUnary {
  type: typeof VALUE_CALL;
  name: OpUnaryBoolean;
  arguments: [BooleanType];
}

export interface BooleanCallCompValues {
  type: typeof VALUE_CALL;
  name: OpCompManyValues;
  arguments: Value[];
}

interface BooleanConstant {
  type: typeof VALUE_CONST;
  value: boolean;
}

export type BooleanCall =
  | BooleanCallCompNumbers
  | BooleanCallCompValues
  | BooleanCallUnary
  | BooleanCallCompBooleans;
export type BooleanType = BooleanCall | BooleanConstant;
