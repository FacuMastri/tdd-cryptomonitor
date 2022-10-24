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
  ContextData,
  ContextDatum,
  isNumberCallBinary,
  isNumberCallMany,
  NumberCall,
  NumberCallBinary,
  NumberCallMany,
  NumberData,
  NumberType,
  NUMBER_DATA
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

type ContextValue = ValueOutput | ValueOutput[] | ContextData;
type Context = Record<string, ContextValue>;

const CONTEXT_RESERVED = ['wallets', 'data'];

export const STORAGE: Context = { zero: 0, wallets: [], data: {} };

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

export function evalNumber(number: NumberType, context?: Context): number {
  switch (number.type) {
    case VALUE_CONST:
      return number.value;
    case VALUE_CALL:
      return evalNumberCall(number, context);
  }
}

export function loadDatum(
  symbol: string,
  datum: ContextDatum,
  context: Context
): Context {
  if (!context.data) context.data = {};
  const data = context.data as ContextData;

  if (!data[symbol]) data[symbol] = [];
  data[symbol].push(datum);
  data[symbol].sort((a, b) => a.timestamp - b.timestamp);

  return context;
}

function secondsAgo(timestamp: number): number {
  return (Date.now() - timestamp) / 1000;
}

function getContextData(dataInfo: NumberData, context?: Context): number[] {
  if (!context) return [];

  const { symbol, from, until } = dataInfo;

  const data = context.data as ContextData;
  if (!data || !data[symbol]) return [];

  const symbolData = data[symbol]
    .filter((datum) => {
      const seconds = secondsAgo(datum.timestamp);
      return seconds <= from && seconds >= until;
    })
    .map((datum) => datum.value);

  return symbolData;
}

function getData(dataInfo: NumberData, context?: Context): NumberType[] {
  if (dataInfo.type !== NUMBER_DATA) throw new Error('Invalid data info');

  const data = getContextData(dataInfo, context);

  if (data.length > 0) {
    return data.map((value) => ({ type: VALUE_CONST, value }));
  }

  if (!dataInfo.default) throw new Error('No data and no default value');

  if (Array.isArray(dataInfo.default)) return dataInfo.default;
  return [dataInfo.default];
}

function getArguments(call: NumberCallMany, context?: Context): NumberType[] {
  if (Array.isArray(call.arguments)) {
    return call.arguments;
  }
  return getData(call.arguments, context);
}

function evalNumberCallWithNArgs(
  call: NumberCallMany,
  context?: Context
): number {
  const callArgs = getArguments(call, context);
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

function evalNumberCall(call: NumberCall, context?: Context): number {
  if (isNumberCallBinary(call)) {
    return evalNumberCallWith2Args(call);
  } else if (isNumberCallMany(call)) {
    return evalNumberCallWithNArgs(call, context);
  } else if (call.name == 'NEGATE') {
    return evalNegate(call.arguments);
  } else {
    throw new Error('Unknown number call: ' + call.name);
  }
}

export function evalValue(value: Value, context?: Context): ValueOutput {
  switch (value.type) {
    case VALUE_CONST:
      return value.value;
    case VALUE_VAR:
      return evalVariable(value);
    case VALUE_CALL:
      return evalCall(value, context);
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

function evalCall(call: ValueCall, context?: Context): ValueOutput {
  if (isBooleanCall(call)) {
    return evalBooleanCall(call);
  } else if (isNumberCall(call)) {
    return evalNumberCall(call, context);
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

  context[action.name] = evalValue(action.value, context);
  return context;
}

function evalBuyMarket(action: ActionBuyMarket, context: Context): Context {
  const amount = evalValue(action.amount, context);
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
  const amount = evalValue(action.amount, context);
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
