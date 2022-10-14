import {evalValue} from "./interpreter";

export function evalEqual(args: any[]): boolean {
    return args.every((arg) => evalValue(arg) == evalValue(args[0]));
}

export function evalDistinct(args: any[]): boolean {
    let set = new Set(args.map((arg) => evalValue(arg)));
    return set.size == args.length;
}