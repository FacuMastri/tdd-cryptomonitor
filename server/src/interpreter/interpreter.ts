import Dict = NodeJS.Dict;
import {evalDistinct, evalEqual, evalLessThan, evalLessThanEqual, evalNot} from "./boolean";
import {
    evalAdd,
    evalAverage,
    evalDivide, evalFirst,
    evalMax,
    evalMin,
    evalMultiply,
    evalNegate,
    evalStddev,
    evalSubtract
} from "./number";

export function evalBoolean(boolean: Dict<any>): boolean {
    switch (boolean.type) {
        case 'CONSTANT':
            return boolean.value;
        case 'CALL':
            return evalBooleanCall(boolean);
        default:
            throw new Error('Unknown boolean type: ' + boolean.type);
    }
}

function evalBooleanCall(call: Dict<any>) {
    switch (call.name) {
        case '==':
            return evalEqual(call.arguments);
        case "DISTINCT":
            return evalDistinct(call.arguments);
        case '<':
            return evalLessThan(call.arguments);
        case '<=':
            return evalLessThanEqual(call.arguments);
        case '>':
            return evalLessThan(call.arguments.reverse());
        case '>=':
            return evalLessThanEqual(call.arguments.reverse());
        case 'AND':
            return call.arguments.every((arg: Dict<any>) => evalBoolean(arg));
        case 'OR':
            return call.arguments.some((arg: Dict<any>) => evalBoolean(arg));
        case 'NOT':
            return evalNot(call.arguments);
        default:
            throw new Error('Unknown boolean call: ' + call.name);
    }
}

export function evalNumber(number: Dict<any>): number {
    switch (number.type) {
        case 'CONSTANT':
            return number.value;
        case 'CALL':
            return evalNumberCall(number);
        default:
            throw new Error('Unknown number type: ' + number.type);
    }
}

function evalNumberCall(call: Dict<any>): number {
    switch (call.name) {
        case 'NEGATE':
            return evalNegate(call.arguments);
        case '+':
            return evalAdd(call.arguments);
        case '-':
            return evalSubtract(call.arguments);
        case '*':
            return evalMultiply(call.arguments);
        case '/':
            return evalDivide(call.arguments);
        case 'MIN':
            return evalMin(call.arguments);
        case 'MAX':
            return evalMax(call.arguments);
        case 'AVERAGE':
            return evalAverage(call.arguments);
        case 'STDDEV':
            return evalStddev(call.arguments);
        case 'FIRST':
            return evalFirst(call.arguments);
        case 'LAST':
            return evalFirst(call.arguments.reverse());
        default:
            throw new Error('Unknown number call: ' + call.name);
    }
}

export function evalValue(value: any): any {
    switch (value.type) {
        case 'CONSTANT':
            return evalBoolean(value);
        default:
            throw new Error('Unknown value type: ' + value.type);
    }
}