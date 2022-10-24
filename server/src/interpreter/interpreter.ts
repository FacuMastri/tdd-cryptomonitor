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
import {
  Action,
  ACTION_SET,
  ACTION_BUY,
  ActionBuyMarket,
  ACTION_SELL,
  ActionSellMarket,
  ActionSetVariable
} from './types/action';
import { Rule } from './types/rule';

type Context = Record<string, ValueOutput | ValueOutput[]>;

const CONTEXT_RESERVED = ['wallets'];

export const STORAGE: Context = { zero: 0, wallets: [] };

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
  // TODO
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
      return value.amount;
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
      return evalSetVariable(action, context);
    case ACTION_BUY:
      return evalBuyMarket(action, context);
    case ACTION_SELL:
      return evalSellMarket(action, context);
    default:
      throw new Error('Unknown action type: ' + action);
  }
  return context;
}

function evalSetVariable(action: ActionSetVariable, context: Context): Context {
  if (CONTEXT_RESERVED.includes(action.name))
    throw new Error('Reserved variable name: ' + action.name);

  context[action.name] = evalValue(action.value);
  return context;
}

function evalBuyMarket(action: ActionBuyMarket, context: Context): Context {
  const amount = evalValue(action.amount);
  if (typeof amount !== 'number') throw new Error('Amount must be a number');
  if (amount < 0) throw new Error('Cannot buy negative amount');

  if (!context.wallets) context.wallets = [];
  const wallets = context.wallets as unknown as ValueWallet[];

  const wallet = wallets.find((wallet) => wallet.symbol === action.symbol);
  if (!wallet) {
    wallets.push({
      type: VALUE_WALLET,
      symbol: action.symbol,
      amount: amount
    });
  } else {
    wallet.amount += amount;
  }
  return context;
}

function evalSellMarket(action: ActionSellMarket, context: Context): Context {
  const amount = evalValue(action.amount);
  if (typeof amount !== 'number') throw new Error('Amount must be a number');
  if (amount < 0) throw new Error('Cannot sell negative amount');

  const wallets = context.wallets as unknown as ValueWallet[];

  const wallet = wallets.find((wallet) => wallet.symbol === action.symbol);
  if (!wallet) throw new Error('No wallet for symbol: ' + action.symbol);

  if (wallet.amount < amount) throw new Error('Not enough funds in wallet');

  wallet.amount -= amount;

  return context;
}

export function evalRule(rule: Rule, context: Context): Context {
  if (evalBoolean(rule.condition))
    rule.actions.forEach((action) => evalAction(action, context));

  return context;
}
