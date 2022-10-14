import Dict = NodeJS.Dict;
import {evalDistinct, evalEqual} from "./boolean";

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