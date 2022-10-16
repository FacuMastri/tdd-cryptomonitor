import { evalBoolean, evalValue } from './interpreter';
import { Value } from './types/value';
import { BooleanType } from './types/boolean';

export function evalEqual(args: Value[]): boolean {
  return args.every((arg) => evalValue(arg) == evalValue(args[0]));
}

export function evalDistinct(args: Value[]): boolean {
  let set = new Set(args.map((arg) => evalValue(arg)));
  return set.size == args.length;
}

export function evalLessThan(args: Value[]): boolean {
  return args.every((arg, index) => {
    if (index == 0) {
      return true;
    } else {
      return evalValue(args[index - 1]) < evalValue(arg);
    }
  });
}

export function evalLessThanEqual(args: Value[]): boolean {
  return args.every((arg, index) => {
    if (index == 0) {
      return true;
    } else {
      return evalValue(args[index - 1]) <= evalValue(arg);
    }
  });
}

export function evalNot(args: BooleanType[]): boolean {
  if (args.length != 1) {
    throw new Error('NOT takes exactly one argument');
  } else {
    return !evalBoolean(args[0]);
  }
}
