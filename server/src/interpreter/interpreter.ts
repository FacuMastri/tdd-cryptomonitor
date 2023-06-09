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
  NUMBER_DATA,
  NumberCall,
  NumberCallBinary,
  NumberCallMany,
  NumberData,
  NumberType,
  WalletDef
} from './types/number';
import { BooleanCall, BooleanType } from './types/boolean';
import {
  Action,
  ACTION_BUY,
  ACTION_SELL,
  ACTION_SET,
  ActionBuyMarket,
  ActionSellMarket,
  ActionSetVariable
} from './types/action';
import { Rule, Rules } from './types/rule';
import { Context } from './types/context';
import { binanceService } from '../services';

const CONTEXT_RESERVED = ['wallets', 'data'];

export function evalBoolean(boolean: BooleanType, context?: Context): boolean {
  switch (boolean.type) {
    case VALUE_CONST:
      return boolean.value;
    case VALUE_CALL:
      return evalBooleanCall(boolean, context);
  }
}

function evalBooleanCall(call: BooleanCall, context?: Context): boolean {
  switch (call.name) {
    case EQUAL:
      return evalEqual(call.arguments, context);
    case DISTINCT:
      return evalDistinct(call.arguments, context);
    case LESS:
      return evalLessThan(call.arguments, context);
    case LESS_EQUAL:
      return evalLessThanEqual(call.arguments, context);
    case GREATER:
      return evalLessThan([...call.arguments].reverse(), context);
    case GREATER_EQUAL:
      return evalLessThanEqual([...call.arguments].reverse(), context);
    case AND:
      return call.arguments.every((arg) => evalBoolean(arg, context));
    case OR:
      return call.arguments.some((arg) => evalBoolean(arg, context));
    case NOT:
      return evalNot(call.arguments);
  }
}

export function evalNumberVar(
  number: ValueVariable,
  context?: Context
): number {
  const value = context && context.variables && context.variables[number.name];
  if (value === undefined)
    throw new Error(
      'Variable not found: ' + number.name + ' in context ' + context
    );

  if (typeof value === 'number') return value;

  throw new Error('Variable is not a number: ' + number.name);
}

export function evalNumber(number: NumberType, context?: Context): number {
  switch (number.type) {
    case VALUE_CONST:
      return number.value;
    case VALUE_CALL:
      return evalNumberCall(number, context);
    case VALUE_VAR:
      return evalNumberVar(number, context);
    case VALUE_WALLET:
      return evalWallet(number, context);
  }
}

// For testing purposes only
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

  const { symbol, since, until } = dataInfo;

  const data = context.data as ContextData;
  if (!data || !data[symbol]) return [];

  const symbolData = data[symbol]
    .filter((datum) => {
      const seconds = secondsAgo(datum.timestamp);
      return seconds <= since && seconds >= until;
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
      return evalAdd(callArgs, context);
    case MULTIPLY:
      return evalMultiply(callArgs, context);
    case MIN:
      return evalMin(callArgs, context);
    case MAX:
      return evalMax(callArgs, context);
    case AVERAGE:
      return evalAverage(callArgs, context);
    case STDDEV:
      return evalStddev(callArgs, context);
    case FIRST:
      return evalFirst(callArgs, context);
    case LAST:
      return evalFirst([...callArgs].reverse(), context);
    default:
      throw new Error('Unknown number call for N arguments: ' + call.name);
  }
}

function evalNumberCallWith2Args(
  call: NumberCallBinary,
  context?: Context
): number {
  switch (call.name) {
    case MINUS:
      return evalSubtract(call.arguments, context);
    case DIVIDE:
      return evalDivide(call.arguments, context);
    default:
      throw new Error('Unknown number call for 2 arguments: ' + call.name);
  }
}

function evalNumberCall(call: NumberCall, context?: Context): number {
  if (isNumberCallBinary(call)) {
    return evalNumberCallWith2Args(call, context);
  } else if (isNumberCallMany(call)) {
    return evalNumberCallWithNArgs(call, context);
  } else if (call.name == 'NEGATE') {
    return evalNegate(call.arguments, context);
  } else {
    throw new Error('Unknown number call: ' + call.name);
  }
}

function evalWallet(
  wallet: WalletDef | ValueWallet,
  context?: Context
): number {
  const valueWallet = wallet as ValueWallet;
  if (valueWallet.amount !== undefined) return valueWallet.amount;

  const _wallet = wallet as WalletDef;
  if (!context || !context.wallets) throw new Error('No wallets in context');
  const wallets = context.wallets as ValueWallet[];

  const resWallet = wallets.find((w) => w.symbol == _wallet.symbol);
  if (!resWallet) throw new Error('Wallet not found: ' + _wallet.symbol);

  return resWallet.amount;
}

export function evalValue(value: Value, context?: Context): ValueOutput {
  switch (value.type) {
    case VALUE_CONST:
      return value.value;
    case VALUE_VAR:
      return evalVariable(value, context);
    case VALUE_CALL:
      return evalCall(value, context);
    case VALUE_WALLET:
      return evalWallet(value, context);
    default:
      throw new Error('Unknown value type: ' + value);
  }
}

function evalVariable(
  variable: ValueVariable,
  context: Context = {}
): ValueOutput {
  if (context.variables && variable.name in context.variables) {
    return context.variables[variable.name] as ValueOutput;
  } else {
    throw new Error('Undefined variable: ' + variable.name);
  }
}

function evalCall(call: ValueCall, context?: Context): ValueOutput {
  if (isBooleanCall(call)) {
    return evalBooleanCall(call, context);
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
}

function evalSetVariable(action: ActionSetVariable, context: Context): Context {
  if (CONTEXT_RESERVED.includes(action.name))
    throw new Error('Reserved variable name: ' + action.name);

  console.log("Setting variable '" + action.name + "' to " + action.value);
  context.variables = context.variables || {};
  context.variables[action.name] = evalValue(action.value, context);
  return context;
}

export const evalBuyMarket = (
  action: ActionBuyMarket,
  context: Context
): Context => {
  const amount = evalValue(action.amount, context);
  if (typeof amount !== 'number') throw new Error('Amount must be a number');
  if (amount < 0) throw new Error('Cannot buy negative amount');

  binanceService.buy(action.symbol, amount);
  return context;
};

export const evalSellMarket = (
  action: ActionSellMarket,
  context: Context
): Context => {
  const amount = evalValue(action.amount, context);
  if (typeof amount !== 'number') throw new Error('Amount must be a number');
  if (amount < 0) throw new Error('Cannot sell negative amount');

  binanceService.sell(action.symbol, amount);
  return context;
};

export function evalRule(rule: Rule, context: Context): Context {
  if (evalBoolean(rule.condition, context))
    rule.actions.forEach((action) => evalAction(action, context));

  return context;
}

export function evalRules(rules: Rules, context: Context): Context {
  for (const name of rules.requiredVariables)
    if (!context.variables || !(name in context.variables))
      throw new Error('Required variable not set: ' + name);

  rules.rules.forEach((rule) => {
    console.log('Evaluating rule: ' + rule.name);
    evalRule(rule, context);
  });
  return context;
}
