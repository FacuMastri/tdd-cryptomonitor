import {evalNumber} from "./interpreter";

export function evalNegate(args: any[]): number {
    if (args.length != 1) {
        throw new Error('NEGATE takes exactly one argument');
    } else {
        return -evalNumber(args[0]);
    }
}