import { evalBoolean, evalValue } from './interpreter';
import { Value } from './types/value';
import { BooleanType } from './types/boolean';
import { Context } from './types/context';

export function evalEqual(args: Value[], context?: Context): boolean {
  return args.every(
    (arg) => evalValue(arg, context) == evalValue(args[0], context)
  );
}

export function evalDistinct(args: Value[], context?: Context): boolean {
  const set = new Set(args.map((arg) => evalValue(arg, context)));
  return set.size == args.length;
}

export function evalLessThan(args: Value[], context?: Context): boolean {
  return args.every((arg, index) => {
    if (index == 0) {
      return true;
    } else {
      return evalValue(args[index - 1], context) < evalValue(arg, context);
    }
  });
}

export function evalLessThanEqual(args: Value[], context?: Context): boolean {
  return args.every((arg, index) => {
    if (index == 0) {
      return true;
    } else {
      return evalValue(args[index - 1], context) <= evalValue(arg, context);
    }
  });
}

export function evalNot(args: BooleanType[], context?: Context): boolean {
  if (args.length != 1) {
    throw new Error('NOT takes exactly one argument');
  } else {
    return !evalBoolean(args[0], context);
  }
}
