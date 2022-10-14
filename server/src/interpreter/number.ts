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

export function evalSubtract(args: any[]): number {
    if (args.length != 2) {
        throw new Error('SUBTRACT takes exactly two arguments');
    } else {
        return evalNumber(args[0]) - evalNumber(args[1]);
    }
}

export function evalMultiply(args: any[]): number {
    if (args.length == 0) {
        throw new Error('MULTIPLY takes at least one argument');
    }
    return args.reduce((product, arg) => product * evalNumber(arg), 1);
}

export function evalDivide(args: any[]): number {
    if (args.length != 2) {
        throw new Error('DIVIDE takes exactly two arguments');
    } else {
        let divisor = evalNumber(args[1]);
        if (divisor == 0) {
            throw new Error('Division by zero');
        }
        return evalNumber(args[0]) / divisor;
    }
}

export function evalMin(args: any[]): number {
    if (args.length == 0) {
        throw new Error('MIN takes at least one argument');
    }
    return Math.min(...args.map((arg) => evalNumber(arg)));
}

export function evalMax(args: any[]): number {
    if (args.length == 0) {
        throw new Error('MAX takes at least one argument');
    }
    return Math.max(...args.map((arg) => evalNumber(arg)));
}