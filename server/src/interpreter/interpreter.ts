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
function mockGetData(symbol: string, since: number, until: number): number[] {
    return [];
}

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

function getData(dataInfo: Dict<any>): Dict<any>[] {
    const data = mockGetData(dataInfo.symbol, dataInfo.since, dataInfo.until);
    if (data.length == 0) {
        if ('default' in dataInfo) {
            return dataInfo.default;
        } else {
            throw new Error('No data and no default value');
        }
    } else {
        return data.map((value) => ({ type: 'CONSTANT', value }));
    }
}

function getArguments(call: Dict<any>): Dict<any>[] {
    try {
        call.arguments.length;
    } catch (e) {
        return getData(call.argument);
    }
    return call.arguments;
}

function evalNumberCallWithNArgs(call: Dict<any>): number {
    const callArgs = getArguments(call);
    switch (call.name) {
        case '+':
            return evalAdd(callArgs);
        case '*':
            return evalMultiply(callArgs);
        case 'MIN':
            return evalMin(callArgs);
        case 'MAX':
            return evalMax(callArgs);
        case 'AVERAGE':
            return evalAverage(callArgs);
        case 'STDDEV':
            return evalStddev(callArgs);
        case 'FIRST':
            return evalFirst(callArgs);
        case 'LAST':
            return evalFirst(callArgs.reverse());
        default:
            throw new Error('Unknown number call for N arguments: ' + call.name);
    }
}

function evalNumberCallWith2Args(call: Dict<any>): number {
    switch (call.name) {
        case '-':
            return evalSubtract(call.arguments);
        case '/':
            return evalDivide(call.arguments);
        default:
            throw new Error('Unknown number call for 2 arguments: ' + call.name);
    }
}

function evalNumberCall(call: Dict<any>): number {
    if (['+', '*', 'MIN', 'MAX', 'AVERAGE', 'STDDEV', 'FIRST', 'LAST'].includes(call.name)) {
        return evalNumberCallWithNArgs(call);
    } else if (['-', '/'].includes(call.name)) {
        return evalNumberCallWith2Args(call);
    } else if (call.name == 'NEGATE') {
        return evalNegate(call.arguments);
    } else {
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

