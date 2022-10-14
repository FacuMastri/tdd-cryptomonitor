import Dict = NodeJS.Dict;
import {evalDistinct, evalEqual, evalLessThan, evalLessThanEqual} from "./boolean";

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
        default:
            throw new Error('Unknown boolean call: ' + call.name);
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