import { evalNumber } from './interpreter';
import { NumberType } from './types/number';
import { Context } from './types/context';

export function evalNegate(args: [NumberType], context?: Context): number {
  if (args.length != 1) {
    throw new Error('NEGATE takes exactly one argument');
  } else {
    return -evalNumber(args[0], context);
  }
}

export function evalAdd(args: NumberType[], context?: Context): number {
  if (args.length == 0) {
    throw new Error('ADD takes at least one argument');
  }
  return args.reduce((sum, arg) => sum + evalNumber(arg, context), 0);
}

export function evalSubtract(
  args: [NumberType, NumberType],
  context?: Context
): number {
  if (args.length != 2) {
    throw new Error('SUBTRACT takes exactly two arguments');
  } else {
    return evalNumber(args[0], context) - evalNumber(args[1], context);
  }
}

export function evalMultiply(args: NumberType[], context?: Context): number {
  if (args.length == 0) {
    throw new Error('MULTIPLY takes at least one argument');
  }
  return args.reduce((product, arg) => product * evalNumber(arg, context), 1);
}

export function evalDivide(
  args: [NumberType, NumberType],
  context?: Context
): number {
  if (args.length != 2) {
    throw new Error('DIVIDE takes exactly two arguments');
  } else {
    const divisor = evalNumber(args[1], context);
    if (divisor == 0) {
      throw new Error('Division by zero');
    }
    return evalNumber(args[0], context) / divisor;
  }
}

export function evalMin(args: NumberType[], context?: Context): number {
  if (args.length == 0) {
    throw new Error('MIN takes at least one argument');
  }
  return Math.min(...args.map((arg) => evalNumber(arg, context)));
}

export function evalMax(args: NumberType[], context?: Context): number {
  if (args.length == 0) {
    throw new Error('MAX takes at least one argument');
  }
  return Math.max(...args.map((arg) => evalNumber(arg, context)));
}

export function evalAverage(args: NumberType[], context?: Context): number {
  if (args.length == 0) {
    throw new Error('AVERAGE takes at least one argument');
  }
  return (
    args.reduce((sum, arg) => sum + evalNumber(arg, context), 0) / args.length
  );
}

export function evalStddev(args: NumberType[], context?: Context): number {
  if (args.length == 0) {
    throw new Error('STDDEV takes at least one argument');
  }
  const mean = evalAverage(args, context);
  return Math.sqrt(
    args.reduce(
      (sum, arg) => sum + Math.pow(evalNumber(arg, context) - mean, 2),
      0
    ) / args.length
  );
}

export function evalFirst(args: NumberType[], context?: Context): number {
  if (args.length == 0) {
    throw new Error('FIRST takes at least one argument');
  }
  return evalNumber(args[0], context);
}
