import {evalNumber} from "./interpreter";

export function evalNegate(args: any[]): number {
    if (args.length != 1) {
        throw new Error('NEGATE takes exactly one argument');
    } else {
        return -evalNumber(args[0]);
    }
}

export function evalAdd(args: any[]): number {
    if (args.length == 0) {
        throw new Error('ADD takes at least one argument');
    }
    return args.reduce((sum, arg) => sum + evalNumber(arg), 0);
}