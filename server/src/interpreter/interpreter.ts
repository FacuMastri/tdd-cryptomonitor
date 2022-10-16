import Dict = NodeJS.Dict;
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

type Context = Dict<ValueOutput>

export let STORAGE: Context = { a: 123 };
function mockGetData(symbol: string, since: number, until: number): number[] {
  return [];
}

export function evalBoolean(boolean: Value): boolean {
  switch (boolean.type) {
    case VALUE_CONST:
      if (typeof boolean.value === 'boolean') return boolean.value;
      break;
    case VALUE_CALL:
      return evalBooleanCall(boolean);
  }
  throw new Error('Unknown boolean type: ' + boolean.type);
}

function evalBooleanCall(call: ValueCall) {
  const callArgs = getArguments(call);
  switch (call.name) {
    case EQUAL:
      return evalEqual(callArgs);
    case DISTINCT:
      return evalDistinct(callArgs);
    case LESS:
      return evalLessThan(callArgs);
    case LESS_EQUAL:
      return evalLessThanEqual(callArgs);
    case GREATER:
      return evalLessThan(callArgs.reverse());
    case GREATER_EQUAL:
      return evalLessThanEqual(callArgs.reverse());
    case AND:
      return callArgs.every(arg => evalBoolean(arg));
    case OR:
      return callArgs.some(arg => evalBoolean(arg));
    case NOT:
      return evalNot(callArgs);
    default:
      throw new Error('Unknown boolean call: ' + call.name);
  }
}

export function evalNumber(number: Value): number {
  switch (number.type) {
    case VALUE_CONST:
      if (typeof number.value == 'number') return number.value;
      break;
    case VALUE_CALL:
      return evalNumberCall(number);
  }
  throw new Error('Unknown number type: ' + number.type);
}

function getData(dataInfo: ValueData): Value[] {
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

function getArguments(call: ValueCall): Value[] {
  if (Array.isArray(call.arguments)) {
    return call.arguments;
  }
  return getData(call.arguments);
}

function evalNumberCallWithNArgs(call: ValueCallMany): number {
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

function evalNumberCallWith2Args(call: ValueCallBinary): number {
  const callArgs = getArguments(call);
  switch (call.name) {
    case MINUS:
      return evalSubtract(callArgs);
    case DIVIDE:
      return evalDivide(callArgs);
    default:
      throw new Error('Unknown number call for 2 arguments: ' + call.name);
  }
}

function evalNumberCall(call: ValueCall): number {
  if (isCallMany(call)) {
    return evalNumberCallWithNArgs(call);
  } else if (isCallBinary(call)) {
    return evalNumberCallWith2Args(call);
  } else if (call.name == 'NEGATE') {
    const callArgs = getArguments(call);
    return evalNegate(callArgs);
  } else {
    throw new Error('Unknown number call: ' + call.name);
  }
}

export function evalValue(value: Value): ValueOutput {
  switch (value.type) {
    case VALUE_CONST:
      return evalBoolean(value);
    case VALUE_VAR:
      return evalVariable(value);
    case VALUE_CALL:
      return evalCall(value);
    case VALUE_WALLET:
      throw new Error("TODO");
    default:
      throw new Error('Unknown value type: ' + value);
    } 
}

function evalVariable(variable: ValueVariable): ValueOutput {
  if (variable.name in STORAGE) {
    return STORAGE[variable.name];
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

export function evalAction(action: Action, context: Context): ValueOutput {
  switch (action.type) {
    case ACTION_SET:
      context[action.name] = evalValue(action.value);
      return context;
    case ACTION_BUY:
      return evalBuyMarket(action, context);
    case ACTION_SELL:
      return evalSellMarket(action, context);
    default:
      throw new Error('Unknown action type: ' + action);
  }
}

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
