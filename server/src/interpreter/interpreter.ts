import {
  evalDistinct,
  evalEqual,
  evalLessThan,
  evalLessThanEqual,
  evalNot
} from './boolean';
import {
  evalAdd,
  evalAverage,
  evalDivide,
  evalFirst,
  evalMax,
  evalMin,
  evalMultiply,
  evalNegate,
  evalStddev,
  evalSubtract
} from './number';
import {
  Value,
  VALUE_CALL,
  VALUE_CONST,
  VALUE_VAR,
  VALUE_WALLET,
  ValueCall,
  ValueConstant,
  ValueOutput,
  ValueVariable,
  ValueWallet
} from './types/value';
import {
  AND,
  AVERAGE,
  DISTINCT,
  DIVIDE,
  EQUAL,
  FIRST,
  GREATER,
  GREATER_EQUAL,
  isBooleanCall,
  isNumberCall,
  LAST,
  LESS,
  LESS_EQUAL,
  MAX,
  MIN,
  MINUS,
  MULTIPLY,
  NOT,
  OR,
  PLUS,
  STDDEV
} from './types/calls';
import {
  isNumberCallBinary,
  isNumberCallMany,
  NumberCall,
  NumberCallBinary,
  NumberCallMany,
  NumberData,
  NumberType
} from './types/number';
import { BooleanCall, BooleanType } from './types/boolean';
import { Action, ACTION_SET, ACTION_SELL, ACTION_BUY } from './types/action';

type Context = Record<string, ValueOutput>;

export const STORAGE: Context = { zero: 0 };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function mockGetData(symbol: string, since: number, until: number): number[] {
  return [];
}

export function evalBoolean(boolean: BooleanType): boolean {
  switch (boolean.type) {
    case VALUE_CONST:
      return boolean.value;
    case VALUE_CALL:
      return evalBooleanCall(boolean);
  }
}

function evalBooleanCall(call: BooleanCall): boolean {
  switch (call.name) {
    case EQUAL:
      return evalEqual(call.arguments);
    case DISTINCT:
      return evalDistinct(call.arguments);
    case LESS:
      return evalLessThan(call.arguments);
    case LESS_EQUAL:
      return evalLessThanEqual(call.arguments);
    case GREATER:
      return evalLessThan(call.arguments.reverse());
    case GREATER_EQUAL:
      return evalLessThanEqual(call.arguments.reverse());
    case AND:
      return call.arguments.every((arg) => evalBoolean(arg));
    case OR:
      return call.arguments.some((arg) => evalBoolean(arg));
    case NOT:
      return evalNot(call.arguments);
  }
}

export function evalNumber(number: NumberType): number {
  switch (number.type) {
    case VALUE_CONST:
      return number.value;
    case VALUE_CALL:
      return evalNumberCall(number);
  }
}

function getData(dataInfo: NumberData): NumberType[] {
  const data = mockGetData(dataInfo.symbol, dataInfo.since, dataInfo.until);
  if (data.length == 0) {
    if (dataInfo.default) {
      return dataInfo.default;
    } else {
      throw new Error('No data and no default value');
    }
  } else {
    return data.map((value) => ({ type: VALUE_CONST, value }));
  }
}

function getArguments(call: NumberCallMany): NumberType[] {
  if (Array.isArray(call.arguments)) {
    return call.arguments;
  }
  return getData(call.arguments);
}

function evalNumberCallWithNArgs(call: NumberCallMany): number {
  const callArgs = getArguments(call);
  switch (call.name) {
    case PLUS:
      return evalAdd(callArgs);
    case MULTIPLY:
      return evalMultiply(callArgs);
    case MIN:
      return evalMin(callArgs);
    case MAX:
      return evalMax(callArgs);
    case AVERAGE:
      return evalAverage(callArgs);
    case STDDEV:
      return evalStddev(callArgs);
    case FIRST:
      return evalFirst(callArgs);
    case LAST:
      return evalFirst(callArgs.reverse());
    default:
      throw new Error('Unknown number call for N arguments: ' + call.name);
  }
}

function evalNumberCallWith2Args(call: NumberCallBinary): number {
  switch (call.name) {
    case MINUS:
      return evalSubtract(call.arguments);
    case DIVIDE:
      return evalDivide(call.arguments);
    default:
      throw new Error('Unknown number call for 2 arguments: ' + call.name);
  }
}

function evalNumberCall(call: NumberCall): number {
  if (isNumberCallBinary(call)) {
    return evalNumberCallWith2Args(call);
  } else if (isNumberCallMany(call)) {
    return evalNumberCallWithNArgs(call);
  } else if (call.name == 'NEGATE') {
    return evalNegate(call.arguments);
  } else {
    throw new Error('Unknown number call: ' + call.name);
  }
}

export function evalValue(value: Value): ValueOutput {
  switch (value.type) {
    case VALUE_CONST:
      return value.value;
    case VALUE_VAR:
      return evalVariable(value);
    case VALUE_CALL:
      return evalCall(value);
    case VALUE_WALLET:
      throw new Error('TODO');
    default:
      throw new Error('Unknown value type: ' + value);
  }
}

function evalVariable(variable: ValueVariable): ValueOutput {
  if (variable.name in STORAGE) {
    return STORAGE[variable.name] as ValueOutput;
  } else {
    throw new Error('Undefined variable: ' + variable.name);
  }
}

function evalCall(call: ValueCall): ValueOutput {
  if (isBooleanCall(call)) {
    return evalBooleanCall(call);
  } else if (isNumberCall(call)) {
    return evalNumberCall(call);
  }
  throw new Error('Unknown call name: ' + call);
}

export function evalAction(action: Action, context: Context): Context {
  switch (action.type) {
    case ACTION_SET:
      context[action.name] = evalValue(action.value);
      break;
    case ACTION_BUY:
      //return evalBuyMarket(action, context);
      break;
    case ACTION_SELL:
      //return evalSellMarket(action, context);
      break;
    default:
      throw new Error('Unknown action type: ' + action);
  }
  return context;
}

/*
function evalBuyMarket(action: ActionBuyMarket, context: Context): ValueOutput {
  const amount = evalValue(action.amount);
  if (typeof amount !== 'number') throw new Error('Amount must be a number');
  if (amount < 0) throw new Error('Cannot buy negative amount');

  if (!(action.symbol in context.wallets)) {
    context.wallets[action.symbol] = 0;
  }
  context.wallets[action.symbol] += amount;
  return context;
}

function evalSellMarket(action: ActionSellMarket, context: Context): ValueOutput {
  const amount = evalValue(action.amount);
  if (typeof amount !== 'number') throw new Error('Amount must be a number');
  if (!(action.symbol in context.wallets)) throw new Error('Cannot sell symbol that is not in wallet');

  const total_owned = context.wallets[action.symbol];
  if (total_owned < amount) {
    throw new Error('Insufficient funds');
  }
  context.wallets[action.symbol] -= amount;
  return context;
}

export function evalRule(rule: Rule, context: Context): Context {
  if (evalBoolean(rule.condition)) {
    return rule.action.reduce(
      (context: Context, action: Action) => evalAction(action, context),
      context
    );
  } else {
    return context;
  }
}
*/
