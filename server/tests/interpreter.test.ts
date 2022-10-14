import {evalAction, evalBoolean, evalNumber, evalRule, evalValue} from "../src/interpreter/interpreter";
import exp = require("constants");

test('evalBoolean returns true for constant true', () => {
    let boolean = { type: 'CONSTANT', value: true };
    expect(evalBoolean(boolean)).toBe(true);
});

test('evalBoolean returns false for constant false', () => {
    let boolean = { type: 'CONSTANT', value: false };
    expect(evalBoolean(boolean)).toBe(false);
});

test('evalBoolean returns true for == call with two true constants', () => {
    let call = {
        type: 'CALL',
        name: '==',
        arguments: [
            { type: 'CONSTANT', value: true },
            { type: 'CONSTANT', value: true }
        ]
    };
    expect(evalBoolean(call)).toBe(true);
});

test('evalBoolean returns false for == call with two false constants', () => {
    let call = {
        type: 'CALL',
        name: '==',
        arguments: [
            { type: 'CONSTANT', value: false },
            { type: 'CONSTANT', value: false }
        ]
    };
    expect(evalBoolean(call)).toBe(true);
});

test('evalBoolean returns false for == call with one true and one false constant', () => {
    let call = {
        type: 'CALL',
        name: '==',
        arguments: [
            { type: 'CONSTANT', value: true },
            { type: 'CONSTANT', value: false }
        ]
    };

    expect(evalBoolean(call)).toBe(false);
});

test('evalBoolean returns true for == call with three true constants', () => {
    let call = {
        type: 'CALL',
        name: '==',
        arguments: [
            { type: 'CONSTANT', value: true },
            { type: 'CONSTANT', value: true },
            { type: 'CONSTANT', value: true }
        ]
    };

    expect(evalBoolean(call)).toBe(true);
});

test('evalBoolean returns false for == call with one true and two false constants', () => {
    let call = {
        type: 'CALL',
        name: '==',
        arguments: [
            { type: 'CONSTANT', value: true },
            { type: 'CONSTANT', value: true },
            { type: 'CONSTANT', value: false }
        ]
    };

    expect(evalBoolean(call)).toBe(false);
});

test('evalBoolean returns true for == call with two equal constant numbers', () => {
    let call = {
        type: 'CALL',
        name: '==',
        arguments: [
            { type: 'CONSTANT', value: 1 },
            { type: 'CONSTANT', value: 1 }
        ]
    };

    expect(evalBoolean(call)).toBe(true);
});

test('evalBoolean returns false for == call with two unequal constant numbers', () => {
    let call = {
        type: 'CALL',
        name: '==',
        arguments: [
            { type: 'CONSTANT', value: 1 },
            { type: 'CONSTANT', value: 2 }
        ]
    };

    expect(evalBoolean(call)).toBe(false);
});

test('evalBoolean returns true for == call with three equal constant numbers', () => {
    let call = {
        type: 'CALL',
        name: '==',
        arguments: [
            { type: 'CONSTANT', value: 1 },
            { type: 'CONSTANT', value: 1 },
            { type: 'CONSTANT', value: 1 }
        ]
    };

    expect(evalBoolean(call)).toBe(true);
});

test('evalBoolean returns false for == call with one equal and two unequal constant numbers', () => {
    let call = {
        type: 'CALL',
        name: '==',
        arguments: [
            { type: 'CONSTANT', value: 1 },
            { type: 'CONSTANT', value: 1 },
            { type: 'CONSTANT', value: 2 }
        ]
    };

    expect(evalBoolean(call)).toBe(false);
});

test('evalBoolean throws an error for unknown boolean type', () => {
    let boolean = { type: 'UNKNOWN' };
    expect(() => evalBoolean(boolean)).toThrow();
});

test('evalBoolean returns true for DISTINCT call with two different constants', () => {
    let call = {
        type: 'CALL',
        name: 'DISTINCT',
        arguments: [
            { type: 'CONSTANT', value: true },
            { type: 'CONSTANT', value: false }
        ]
    };

    expect(evalBoolean(call)).toBe(true);
});

test('evalBoolean returns false for DISTINCT call with two same constants', () => {
    let call = {
        type: 'CALL',
        name: 'DISTINCT',
        arguments: [
            { type: 'CONSTANT', value: true },
            { type: 'CONSTANT', value: true }
        ]
    };

    expect(evalBoolean(call)).toBe(false);
});

test('evalBoolean returns false for DISTINCT call with two same constants and one different', () => {
    let call = {
        type: 'CALL',
        name: 'DISTINCT',
        arguments: [
            { type: 'CONSTANT', value: true },
            { type: 'CONSTANT', value: false },
            { type: 'CONSTANT', value: true }
        ]
    };

    expect(evalBoolean(call)).toBe(false);
});

test('evalBoolean returns true for < call with two constants', () => {
    let call = {
        type: 'CALL',
        name: '<',
        arguments: [
            { type: 'CONSTANT', value: 1 },
            { type: 'CONSTANT', value: 2 }
        ]
    };

    expect(evalBoolean(call)).toBe(true);
});

test('evalBoolean returns false for < call with two constants', () => {
    let call = {
        type: 'CALL',
        name: '<',
        arguments: [
            { type: 'CONSTANT', value: 2 },
            { type: 'CONSTANT', value: 1 }
        ]
    };

    expect(evalBoolean(call)).toBe(false);
});

test('evalBoolean returns true for < call with three constants', () => {
    let call = {
        type: 'CALL',
        name: '<',
        arguments: [
            { type: 'CONSTANT', value: 1 },
            { type: 'CONSTANT', value: 2 },
            { type: 'CONSTANT', value: 3 }
        ]
    };

    expect(evalBoolean(call)).toBe(true);
});

test('evalBoolean returns false for < call with three constants', () => {
    let call = {
        type: 'CALL',
        name: '<',
        arguments: [
            { type: 'CONSTANT', value: 1 },
            { type: 'CONSTANT', value: 2 },
            { type: 'CONSTANT', value: 1 }
        ]
    };

    expect(evalBoolean(call)).toBe(false);
});

test('evalBoolean returns true for <= call with two constants', () => {
    let call = {
        type: 'CALL',
        name: '<=',
        arguments: [
            { type: 'CONSTANT', value: 1 },
            { type: 'CONSTANT', value: 2 }
        ]
    };

    expect(evalBoolean(call)).toBe(true);
});

test('evalBoolean returns false for <= call with two constants', () => {
    let call = {
        type: 'CALL',
        name: '<=',
        arguments: [
            { type: 'CONSTANT', value: 2 },
            { type: 'CONSTANT', value: 1 }
        ]
    };

    expect(evalBoolean(call)).toBe(false);
});

test('evalBoolean returns true for <= call with two equal constants', () => {
    let call = {
        type: 'CALL',
        name: '<=',
        arguments: [
            { type: 'CONSTANT', value: 2 },
            { type: 'CONSTANT', value: 2 }
        ]
    };

    expect(evalBoolean(call)).toBe(true);
});

test('evalBoolean returns true for <= call with three constants', () => {
    let call = {
        type: 'CALL',
        name: '<=',
        arguments: [
            { type: 'CONSTANT', value: 1 },
            { type: 'CONSTANT', value: 2 },
            { type: 'CONSTANT', value: 2 }
        ]
    };

    expect(evalBoolean(call)).toBe(true);
});

test('evalBoolean returns true for > call with two constants', () => {
    let call = {
        type: 'CALL',
        name: '>',
        arguments: [
            { type: 'CONSTANT', value: 2 },
            { type: 'CONSTANT', value: 1 }
        ]
    };

    expect(evalBoolean(call)).toBe(true);
});

test('evalBoolean returns false for > call with two constants', () => {
    let call = {
        type: 'CALL',
        name: '>',
        arguments: [
            { type: 'CONSTANT', value: 2 },
            { type: 'CONSTANT', value: 2 }
        ]
    };

    expect(evalBoolean(call)).toBe(false);
});

test('evalBoolean returns true for > call with three constants', () => {
    let call = {
        type: 'CALL',
        name: '>',
        arguments: [
            { type: 'CONSTANT', value: 3 },
            { type: 'CONSTANT', value: 2 },
            { type: 'CONSTANT', value: 1 }
        ]
    };

    expect(evalBoolean(call)).toBe(true);
});

test('evalBoolean returns false for > call with three constants', () => {
    let call = {
        type: 'CALL',
        name: '>',
        arguments: [
            { type: 'CONSTANT', value: 1 },
            { type: 'CONSTANT', value: 2 },
            { type: 'CONSTANT', value: 1 }
        ]
    };

    expect(evalBoolean(call)).toBe(false);
});

test('evalBoolean returns true for >= call with two constants', () => {
    let call = {
        type: 'CALL',
        name: '>=',
        arguments: [
            { type: 'CONSTANT', value: 2 },
            { type: 'CONSTANT', value: 1 }
        ]
    };

    expect(evalBoolean(call)).toBe(true);
});

test('evalBoolean returns false for >= call with two constants', () => {
    let call = {
        type: 'CALL',
        name: '>=',
        arguments: [
            { type: 'CONSTANT', value: 1 },
            { type: 'CONSTANT', value: 2 }
        ]
    };

    expect(evalBoolean(call)).toBe(false);
});

test('evalBoolean returns true for >= call with two equal constants', () => {
    let call = {
        type: 'CALL',
        name: '>=',
        arguments: [
            { type: 'CONSTANT', value: 2 },
            { type: 'CONSTANT', value: 2 }
        ]
    };

    expect(evalBoolean(call)).toBe(true);
});

test('evalBoolean returns true for >= call with three constants', () => {
    let call = {
        type: 'CALL',
        name: '>=',
        arguments: [
            { type: 'CONSTANT', value: 3 },
            { type: 'CONSTANT', value: 2 },
            { type: 'CONSTANT', value: 1 }
        ]
    };

    expect(evalBoolean(call)).toBe(true);
});

test('evalBoolean returns false for >= call with three constants', () => {
    let call = {
        type: 'CALL',
        name: '>=',
        arguments: [
            { type: 'CONSTANT', value: 1 },
            { type: 'CONSTANT', value: 2 },
            { type: 'CONSTANT', value: 1 }
        ]
    };

    expect(evalBoolean(call)).toBe(false);
});

test('evalBoolean returns true for AND call with two true constants', () => {
    let call = {
        type: 'CALL',
        name: 'AND',
        arguments: [
            { type: 'CONSTANT', value: true },
            { type: 'CONSTANT', value: true }
        ]
    };

    expect(evalBoolean(call)).toBe(true);
});

test('evalBoolean returns false for AND call with two false constants', () => {
    let call = {
        type: 'CALL',
        name: 'AND',
        arguments: [
            { type: 'CONSTANT', value: false },
            { type: 'CONSTANT', value: false }
        ]
    };

    expect(evalBoolean(call)).toBe(false);
});

test('evalBoolean returns false for AND call with one true and one false constant', () => {
    let call = {
        type: 'CALL',
        name: 'AND',
        arguments: [
            { type: 'CONSTANT', value: true },
            { type: 'CONSTANT', value: false }
        ]
    };

    expect(evalBoolean(call)).toBe(false);
});

test('evalBoolean returns true for AND call with three true constants', () => {
    let call = {
        type: 'CALL',
        name: 'AND',
        arguments: [
            { type: 'CONSTANT', value: true },
            { type: 'CONSTANT', value: true },
            { type: 'CONSTANT', value: true }
        ]
    };

    expect(evalBoolean(call)).toBe(true);
});

test('evalBoolean returns false for AND call with two true and one false constants', () => {
    let call = {
        type: 'CALL',
        name: 'AND',
        arguments: [
            { type: 'CONSTANT', value: true },
            { type: 'CONSTANT', value: true },
            { type: 'CONSTANT', value: false }
        ]
    };

    expect(evalBoolean(call)).toBe(false);
});

test('evalBoolean returns true for OR call with two true constants', () => {
    let call = {
        type: 'CALL',
        name: 'OR',
        arguments: [
            { type: 'CONSTANT', value: true },
            { type: 'CONSTANT', value: true }
        ]
    };

    expect(evalBoolean(call)).toBe(true);
});

test('evalBoolean returns false for OR call with two false constants', () => {
    let call = {
        type: 'CALL',
        name: 'OR',
        arguments: [
            { type: 'CONSTANT', value: false },
            { type: 'CONSTANT', value: false }
        ]
    };

    expect(evalBoolean(call)).toBe(false);
});

test('evalBoolean returns true for OR call with one true and one false constant', () => {
    let call = {
        type: 'CALL',
        name: 'OR',
        arguments: [
            { type: 'CONSTANT', value: true },
            { type: 'CONSTANT', value: false }
        ]
    };

    expect(evalBoolean(call)).toBe(true);
});

test('evalBoolean returns true for OR call with three true constants', () => {
    let call = {
        type: 'CALL',
        name: 'OR',
        arguments: [
            { type: 'CONSTANT', value: true },
            { type: 'CONSTANT', value: true },
            { type: 'CONSTANT', value: true }
        ]
    };

    expect(evalBoolean(call)).toBe(true);
});

test('evalBoolean returns true for OR call with two true and one false constants', () => {
    let call = {
        type: 'CALL',
        name: 'OR',
        arguments: [
            { type: 'CONSTANT', value: false },
            { type: 'CONSTANT', value: false },
            { type: 'CONSTANT', value: true }
        ]
    };

    expect(evalBoolean(call)).toBe(true);
});

test('evalBoolean returns true for NOT call with false constant', () => {
    let call = {
        type: 'CALL',
        name: 'NOT',
        arguments: [{ type: 'CONSTANT', value: false }]
    };

    expect(evalBoolean(call)).toBe(true);
});

test('evalBoolean returns false for NOT call with true constant', () => {
    let call = {
        type: 'CALL',
        name: 'NOT',
        arguments: [{ type: 'CONSTANT', value: true }]
    };

    expect(evalBoolean(call)).toBe(false);
});

test('evalBoolean throws error for NOT call with two or more constants', () => {
    let call = {
        type: 'CALL',
        name: 'NOT',
        arguments: [
            { type: 'CONSTANT', value: true },
            { type: 'CONSTANT', value: true }
        ]
    };

    expect(() => evalBoolean(call)).toThrow();
});

test('evalNumber return 1 for constant 1', () => {
    let number = { type: 'CONSTANT', value: 1 };

    expect(evalNumber(number)).toBe(1);
});

test('evalNumber return 2 for constant 2', () => {
    let number = { type: 'CONSTANT', value: 2 };

    expect(evalNumber(number)).toBe(2);
});

test('evalNumber return -1 for NEGATE call with constant 1', () => {
    let call = {
        type: 'CALL',
        name: 'NEGATE',
        arguments: [{ type: 'CONSTANT', value: 1 }]
    };

    expect(evalNumber(call)).toBe(-1);
});

test('evalNumber return -2 for NEGATE call with constant 2', () => {
    let call = {
        type: 'CALL',
        name: 'NEGATE',
        arguments: [{ type: 'CONSTANT', value: 2 }]
    };

    expect(evalNumber(call)).toBe(-2);
});

test('evalNumber return 1 for NEGATE call with constant -1', () => {
    let call = {
        type: 'CALL',
        name: 'NEGATE',
        arguments: [
            {
                type: 'CONSTANT',
                value: -1
            }
        ]
    };

    expect(evalNumber(call)).toBe(1);
});

test('evalNumber throws error for NEGATE call with two or more constants', () => {
    let call = {
        type: 'CALL',
        name: 'NEGATE',
        arguments: [
            { type: 'CONSTANT', value: 1 },
            { type: 'CONSTANT', value: 1 }
        ]
    };

    expect(() => evalNumber(call)).toThrow();
});

test('evalNumber return 2 for + call with constant 1 and constant 1', () => {
    let call = {
        type: 'CALL',
        name: '+',
        arguments: [
            { type: 'CONSTANT', value: 1 },
            { type: 'CONSTANT', value: 1 }
        ]
    };

    expect(evalNumber(call)).toBe(2);
});

test('evalNumber return 3 for + call with constant 1 and constant 2', () => {
    let call = {
        type: 'CALL',
        name: '+',
        arguments: [
            { type: 'CONSTANT', value: 1 },
            { type: 'CONSTANT', value: 2 }
        ]
    };

    expect(evalNumber(call)).toBe(3);
});

test('evalNumber return 6 for + call with constant 1, constant 2 and constant 3', () => {
    let call = {
        type: 'CALL',
        name: '+',
        arguments: [
            { type: 'CONSTANT', value: 1 },
            { type: 'CONSTANT', value: 2 },
            { type: 'CONSTANT', value: 3 }
        ]
    };

    expect(evalNumber(call)).toBe(6);
});

test('evalNumber throws error for + call with zero arguments', () => {
    let call = {
        type: 'CALL',
        name: '+',
        arguments: []
    };

    expect(() => evalNumber(call)).toThrow();
});

test('evalNumber return 0 for - call with constant 1 and constant 1', () => {
    let call = {
        type: 'CALL',
        name: '-',
        arguments: [
            { type: 'CONSTANT', value: 1 },
            { type: 'CONSTANT', value: 1 }
        ]
    };

    expect(evalNumber(call)).toBe(0);
});

test('evalNumber return 1 for - call with constant 2 and constant 1', () => {
    let call = {
        type: 'CALL',
        name: '-',
        arguments: [
            { type: 'CONSTANT', value: 2 },
            { type: 'CONSTANT', value: 1 }
        ]
    };

    expect(evalNumber(call)).toBe(1);
});

test('evalNumber throws error for - call with other than two arguments', () => {
    let call = {
        type: 'CALL',
        name: '-',
        arguments: [
            { type: 'CONSTANT', value: 1 },
            { type: 'CONSTANT', value: 1 },
            { type: 'CONSTANT', value: 1 }
        ]
    };

    expect(() => evalNumber(call)).toThrow();
});

test('evalNumber return 2 for * call with constant 1 and constant 2', () => {
    let call = {
        type: 'CALL',
        name: '*',
        arguments: [
            { type: 'CONSTANT', value: 1 },
            { type: 'CONSTANT', value: 2 }
        ]
    };

    expect(evalNumber(call)).toBe(2);
});

test('evalNumber return 6 for * call with constant 2 and constant 3', () => {
    let call = {
        type: 'CALL',
        name: '*',
        arguments: [
            { type: 'CONSTANT', value: 2 },
            { type: 'CONSTANT', value: 3 }
        ]
    };

    expect(evalNumber(call)).toBe(6);
});

test('evalNumber return 6 for * call with constant 1, constant 2 and constant 3', () => {
    let call = {
        type: 'CALL',
        name: '*',
        arguments: [
            { type: 'CONSTANT', value: 1 },
            { type: 'CONSTANT', value: 2 },
            { type: 'CONSTANT', value: 3 }
        ]
    };

    expect(evalNumber(call)).toBe(6);
});

test('evalNumber throws error for * call with no arguments', () => {
    let call = {
        type: 'CALL',
        name: '*',
        arguments: []
    };

    expect(() => evalNumber(call)).toThrow();
});

test('evalNumber return 2 for / call with constant 4 and constant 2', () => {
    let call = {
        type: 'CALL',
        name: '/',
        arguments: [
            { type: 'CONSTANT', value: 4 },
            { type: 'CONSTANT', value: 2 }
        ]
    };

    expect(evalNumber(call)).toBe(2);
});

test('evalNumber return 2 for / call with constant 6 and constant 3', () => {
    let call = {
        type: 'CALL',
        name: '/',
        arguments: [
            { type: 'CONSTANT', value: 6 },
            { type: 'CONSTANT', value: 3 }
        ]
    };

    expect(evalNumber(call)).toBe(2);
});

test('evalNumber throws error for / call with zero arguments', () => {
    let call = {
        type: 'CALL',
        name: '/',
        arguments: []
    };

    expect(() => evalNumber(call)).toThrow();
});

test('evalNumber throws error for / call with one argument', () => {
    let call = {
        type: 'CALL',
        name: '/',
        arguments: [{ type: 'CONSTANT', value: 1 }]
    };

    expect(() => evalNumber(call)).toThrow();
});

test('evalNumber throws error for / call with more than two arguments', () => {
    let call = {
        type: 'CALL',
        name: '/',
        arguments: [
            { type: 'CONSTANT', value: 1 },
            { type: 'CONSTANT', value: 1 },
            { type: 'CONSTANT', value: 1 }
        ]
    };

    expect(() => evalNumber(call)).toThrow();
});

test('evalNumber throws error for / call that divides by zero', () => {
    let call = {
        type: 'CALL',
        name: '/',
        arguments: [
            { type: 'CONSTANT', value: 1 },
            { type: 'CONSTANT', value: 0 }
        ]
    };

    expect(() => evalNumber(call)).toThrow();
});

test('evalNumber return 1 for MIN call with constant 1 and constant 2', () => {
    let call = {
        type: 'CALL',
        name: 'MIN',
        arguments: [
            { type: 'CONSTANT', value: 1 },
            { type: 'CONSTANT', value: 2 }
        ]
    };

    expect(evalNumber(call)).toBe(1);
});

test('evalNumber return 1 for MIN call with constant 2 and constant 1', () => {
    let call = {
        type: 'CALL',
        name: 'MIN',
        arguments: [
            { type: 'CONSTANT', value: 2 },
            { type: 'CONSTANT', value: 1 }
        ]
    };

    expect(evalNumber(call)).toBe(1);
});

test('evalNumber return 5 for MIN call with constant 5', () => {
    let call = {
        type: 'CALL',
        name: 'MIN',
        arguments: [{ type: 'CONSTANT', value: 5 }]
    };

    expect(evalNumber(call)).toBe(5);
});

test('evalNumber return min value for MIN call with more than two arguments', () => {
    let call = {
        type: 'CALL',
        name: 'MIN',
        arguments: [
            { type: 'CONSTANT', value: 5 },
            { type: 'CONSTANT', value: 2 },
            { type: 'CONSTANT', value: 3 }
        ]
    };

    expect(evalNumber(call)).toBe(2);
});

test('evalNumber throws error for MIN call with no arguments', () => {
    let call = {
        type: 'CALL',
        name: 'MIN',
        arguments: []
    };

    expect(() => evalNumber(call)).toThrow();
});

test('evalNumber return 2 for MAX call with constant 1 and constant 2', () => {
    let call = {
        type: 'CALL',
        name: 'MAX',
        arguments: [
            { type: 'CONSTANT', value: 1 },
            { type: 'CONSTANT', value: 2 }
        ]
    };

    expect(evalNumber(call)).toBe(2);
});

test('evalNumber return 2 for MAX call with constant 2 and constant 1', () => {
    let call = {
        type: 'CALL',
        name: 'MAX',
        arguments: [
            { type: 'CONSTANT', value: 2 },
            { type: 'CONSTANT', value: 1 }
        ]
    };

    expect(evalNumber(call)).toBe(2);
});

test('evalNumber return 5 for MAX call with constant 5', () => {
    let call = {
        type: 'CALL',
        name: 'MAX',
        arguments: [{ type: 'CONSTANT', value: 5 }]
    };

    expect(evalNumber(call)).toBe(5);
});

test('evalNumber return max value for MAX call with more than two arguments', () => {
    let call = {
        type: 'CALL',
        name: 'MAX',
        arguments: [
            { type: 'CONSTANT', value: 5 },
            { type: 'CONSTANT', value: 2 },
            { type: 'CONSTANT', value: 3 }
        ]
    };

    expect(evalNumber(call)).toBe(5);
});

test('evalNumber throws error for MAX call with no arguments', () => {
    let call = {
        type: 'CALL',
        name: 'MAX',
        arguments: []
    };

    expect(() => evalNumber(call)).toThrow();
});

test('evalNumber return 1.5 for AVERAGE call with constant 1 and constant 2', () => {
    let call = {
        type: 'CALL',
        name: 'AVERAGE',
        arguments: [
            { type: 'CONSTANT', value: 1 },
            { type: 'CONSTANT', value: 2 }
        ]
    };

    expect(evalNumber(call)).toBeCloseTo(1.5);
});

test('evalNumber return 5 for AVERAGE call with constant 5', () => {
    let call = {
        type: 'CALL',
        name: 'AVERAGE',
        arguments: [{ type: 'CONSTANT', value: 5 }]
    };

    expect(evalNumber(call)).toBe(5);
});

test('evalNumber throws error for AVERAGE call with no arguments', () => {
    let call = {
        type: 'CALL',
        name: 'AVERAGE',
        arguments: []
    };

    expect(() => evalNumber(call)).toThrow();
});

test('evalNumber return average value for AVERAGE call with more than two arguments', () => {
    let call = {
        type: 'CALL',
        name: 'AVERAGE',
        arguments: [
            { type: 'CONSTANT', value: 5 },
            { type: 'CONSTANT', value: 2 },
            { type: 'CONSTANT', value: 3 }
        ]
    };

    expect(evalNumber(call)).toBeCloseTo(3.3333333333333335);
});

test('evalNumber return 0.5 for STDDEV call with constant 1 and constant 2', () => {
    let call = {
        type: 'CALL',
        name: 'STDDEV',
        arguments: [
            { type: 'CONSTANT', value: 1 },
            { type: 'CONSTANT', value: 2 }
        ]
    };

    expect(evalNumber(call)).toBeCloseTo(0.5);
});

test('evalNumber return 0 for STDDEV call with constant 5', () => {
    let call = {
        type: 'CALL',
        name: 'STDDEV',
        arguments: [{ type: 'CONSTANT', value: 5 }]
    };

    expect(evalNumber(call)).toBe(0);
});

test('evalNumber throws error for STDDEV call with no arguments', () => {
    let call = {
        type: 'CALL',
        name: 'STDDEV',
        arguments: []
    };

    expect(() => evalNumber(call)).toThrow();
});

test('evalNumber return standard deviation value for STDDEV call with more than two arguments', () => {
    let call = {
        type: 'CALL',
        name: 'STDDEV',
        arguments: [
            { type: 'CONSTANT', value: 5 },
            { type: 'CONSTANT', value: 2 },
            { type: 'CONSTANT', value: 3 }
        ]
    };

    expect(evalNumber(call)).toBeCloseTo(1.247219128924647);
});

test('evalNumber return 1 for FIRST call with constant 1', () => {
    let call = {
        type: 'CALL',
        name: 'FIRST',
        arguments: [{ type: 'CONSTANT', value: 1 }]
    };

    expect(evalNumber(call)).toBe(1);
});

test('evalNumber return 1 for FIRST call with constant 1 and constant 2', () => {
    let call = {
        type: 'CALL',
        name: 'FIRST',
        arguments: [
            { type: 'CONSTANT', value: 1 },
            { type: 'CONSTANT', value: 2 }
        ]
    };

    expect(evalNumber(call)).toBe(1);
});

test('evalNumber return first value for FIRST call with more than two arguments', () => {
    let call = {
        type: 'CALL',
        name: 'FIRST',
        arguments: [
            { type: 'CONSTANT', value: 5 },
            { type: 'CONSTANT', value: 2 },
            { type: 'CONSTANT', value: 3 }
        ]
    };

    expect(evalNumber(call)).toBe(5);
});

test('evalNumber throws error for FIRST call with no arguments', () => {
    let call = {
        type: 'CALL',
        name: 'FIRST',
        arguments: []
    };

    expect(() => evalNumber(call)).toThrow();
});

test('evalNumber return 2 for LAST call with constant 1 and constant 2', () => {
    let call = {
        type: 'CALL',
        name: 'LAST',
        arguments: [
            { type: 'CONSTANT', value: 1 },
            { type: 'CONSTANT', value: 2 }
        ]
    };

    expect(evalNumber(call)).toBe(2);
});

test('evalNumber return 5 for LAST call with constant 5', () => {
    let call = {
        type: 'CALL',
        name: 'LAST',
        arguments: [{ type: 'CONSTANT', value: 5 }]
    };

    expect(evalNumber(call)).toBe(5);
});

test('evalNumber return last value for LAST call with more than two arguments', () => {
    let call = {
        type: 'CALL',
        name: 'LAST',
        arguments: [
            { type: 'CONSTANT', value: 5 },
            { type: 'CONSTANT', value: 2 },
            { type: 'CONSTANT', value: 3 }
        ]
    };

    expect(evalNumber(call)).toBe(3);
});

test('evalNumber throws error for LAST call with no arguments', () => {
    let call = {
        type: 'CALL',
        name: 'LAST',
        arguments: []
    };

    expect(() => evalNumber(call)).toThrow();
});

test('evalValue return variable value for VARIABLE value', () => {
    let variable = {
        type: 'VARIABLE',
        name: 'a'
    };

    expect(evalValue(variable)).toBe(123);
});

test('evalValue throws error for VARIABLE value with undefined variable', () => {
    let variable = {
        type: 'VARIABLE',
        name: 'b'
    };

    expect(() => evalValue(variable)).toThrow();
});

test('evalValue return constant value for CONSTANT value', () => {
    let constant = {
        type: 'CONSTANT',
        value: 123
    };

    expect(evalValue(constant)).toBe(123);
});

test('evalValue return value for CALL value', () => {
    let call = {
        type: 'CALL',
        name: '+',
        arguments: [
            { type: 'CONSTANT', value: 1 },
            { type: 'CONSTANT', value: 2 }
        ]
    };

    expect(evalValue(call)).toBe(3);
});

test('evalAction sets variable value for SET_VARIABLE action', () => {
    let action = {
        type: 'SET_VARIABLE',
        name: 'a',
        value: { type: 'CONSTANT', value: 456 }
    };

    let context = evalAction(action, { a: 123 });

    expect(context.a).toBe(456);
});

test('evalAction sets variable value even if variable is not defined', () => {
    let action = {
        type: 'SET_VARIABLE',
        name: 'b',
        value: { type: 'CONSTANT', value: 1000 }
    };

    let context = evalAction(action, { a: 123 });

    expect(context.b).toBe(1000);
});

test('evalAction buys stock for BUY_MARKET action', () => {
    let action = {
        type: 'BUY_MARKET',
        symbol: 'BTC',
        amount: { type: 'CONSTANT', value: 10 }
    };

    let context = evalAction(action, { wallets: {} });

    expect(context.wallets['BTC']).toBe(10);
});

test('evalAction throws error for BUY_MARKET action with negative amount', () => {
    let action = {
        type: 'BUY_MARKET',
        symbol: 'BTC',
        amount: { type: 'CONSTANT', value: -10 }
    };

    expect(() => evalAction(action, {})).toThrow();
});

test('evalAction sells stock for SELL_MARKET action', () => {
    let action = {
        type: 'SELL_MARKET',
        symbol: 'BTC',
        amount: { type: 'CONSTANT', value: 5 }
    };

    let context = evalAction(action, { wallets: { BTC: 10 } });

    expect(context.wallets['BTC']).toBe(5);
});

test('evalAction throws error for SELL_MARKET action with negative amount', () => {
    let action = {
        type: 'SELL_MARKET',
        symbol: 'BTC',
        amount: { type: 'CONSTANT', value: -5 }
    };

    expect(() => evalAction(action, { wallets: { BTC: 10 } })).toThrow();
});

test('evalAction throws error for SELL_MARKET action with amount greater than owned', () => {
    let action = {
        type: 'SELL_MARKET',
        symbol: 'BTC',
        amount: { type: 'CONSTANT', value: 15 }
    };

    expect(() => evalAction(action, { wallets: { BTC: 10 } })).toThrow();
});

test('evalAction throws error for SELL_MARKET action with no stock owned', () => {
    let action = {
        type: 'SELL_MARKET',
        symbol: 'BTC',
        amount: { type: 'CONSTANT', value: 5 }
    };

    expect(() => evalAction(action, { wallets: { BTC: 0 } })).toThrow();
});

test('evalAction throws error for SELL_MARKET action with unknown coin', () => {
    let action = {
        type: 'SELL_MARKET',
        symbol: 'BTC',
        amount: { type: 'CONSTANT', value: 5 }
    };

    expect(() => evalAction(action, { wallets: {} })).toThrow();
});

test('evalRule executes action if condition is true', () => {
    let rule = {
        condition: { type: 'CONSTANT', value: true },
        action: [{
            type: 'SET_VARIABLE',
            name: 'a',
            value: { type: 'CONSTANT', value: 456 }
        }]
    };

    let context = evalRule(rule, { a: 123 });

    expect(context.a).toBe(456);
});

test('evalRule does not execute action if condition is false', () => {
    let rule = {
        condition: { type: 'CONSTANT', value: false },
        action: [{
            type: 'SET_VARIABLE',
            name: 'a',
            value: { type: 'CONSTANT', value: 456 }
        }]
    };

    let context = evalRule(rule, { a: 123 });

    expect(context.a).toBe(123);
});

test('evalRule executes all rules', () => {
    let rule = {
        name: 'test_rule',
        condition: {
            type: 'CONSTANT',
            value: true
        },
        action: [
            {
                type: 'SET_VARIABLE',
                name: 'a',
                value: { type: 'CONSTANT', value: 888 }
            },
            {
                type: 'SET_VARIABLE',
                name: 'b',
                value: { type: 'CONSTANT', value: 555 }
            }
        ]
    };

    let context = evalRule(rule, { a: 123, b: 0 });

    expect(context.a).toBe(888);
    expect(context.b).toBe(555);
});

test('evalNumber with CALL of N arguments works with default DATA', () => {
   let call = {
         type: 'CALL',
            name: '+',
            argument: {
                "type": "DATA",
                "symbol": "BTC/USDT",
                "since": 3600,
                "until": 0,
                "default": [{
                    "type": "CONSTANT",
                    "value": 1500
                },
                {
                    "type": "CONSTANT",
                    "value": 3000
                }]
            }
   };

   expect(evalNumber(call)).toBe(4500);
});