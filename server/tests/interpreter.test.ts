import {evalBoolean, evalNumber} from "../src/interpreter/interpreter";

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