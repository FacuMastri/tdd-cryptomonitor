import {evalValue} from "./interpreter";

export function evalEqual(args: any[]): boolean {
    return args.every((arg) => evalValue(arg) == evalValue(args[0]));
}