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

export let STORAGE: Dict<any> = { a: 123 };

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
        case 'VARIABLE':
            return evalVariable(value);
        case 'CALL':
            return evalCall(value);
        default:
            throw new Error('Unknown value type: ' + value.type);
    }
}

function evalVariable(variable: Dict<any>): any {
    if (variable.name in STORAGE) {
        return STORAGE[variable.name];
    } else {
        throw new Error('Undefined variable: ' + variable.name);
    }
}

function evalCall(call: Dict<any>): any {
    if (
        ['==', 'DISTINCT', '<', '<=', '>', '>=', 'AND', 'OR', 'NOT'].includes(
            call.name
        )
    ) {
        return evalBooleanCall(call);
    } else if (
        [
            'NEGATE',
            '+',
            '-',
            '*',
            '/',
            'MIN',
            'MAX',
            'AVERAGE',
            'STDDEV',
            'FIRST',
            'LAST'
        ].includes(call.name)
    ) {
        return evalNumberCall(call);
    } else {
        throw new Error('Unknown call name: ' + call.name);
    }
}

export function evalAction(action: Dict<any>, context: Dict<any>): Dict<any> {
    switch (action.type) {
        case 'SET_VARIABLE':
            context[action.name] = evalValue(action.value);
            return context;
        case 'BUY_MARKET':
            return evalBuyMarket(action, context);
        case 'SELL_MARKET':
            return evalSellMarket(action, context);
        default:
            throw new Error('Unknown action type: ' + action.type);
    }
}

function evalBuyMarket(action: Dict<any>, context: Dict<any>): Dict<any> {
    const amount = evalValue(action.amount);
    if (amount < 0) {
        throw new Error('Cannot buy negative amount');
    }
    if (!(action.symbol in context.wallets)) {
        context.wallets[action.symbol] = 0;
    }
    context.wallets[action.symbol] += amount;
    return context;
}

function evalSellMarket(action: Dict<any>, context: Dict<any>): Dict<any> {
    const amount = evalValue(action.amount);
    if (amount < 0) {
        throw new Error('Cannot sell negative amount');
    }
    if (!(action.symbol in context.wallets)) {
        throw new Error('Cannot sell symbol that is not in wallet');
    }
    const total_owned = context.wallets[action.symbol];
    if (total_owned < amount) {
        throw new Error('Insufficient funds');
    }
    context.wallets[action.symbol] -= amount;
    return context;
}

export function evalRule(rule: Dict<any>, context: Dict<any>): Dict<any> {
    if (evalBoolean(rule.condition)) {
        return rule.action.reduce(
            (context: Dict<any>, action: Dict<any>) => evalAction(action, context),
            context
        );
    } else {
        return context;
    }
}

