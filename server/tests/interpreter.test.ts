import {evalBoolean} from "../src/interpreter/interpreter";

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