import {evalBoolean} from "../src/interpreter/interpreter";

test('evalBoolean returns true for constant true', () => {
    let boolean = { type: 'CONSTANT', value: true };
    expect(evalBoolean(boolean)).toBe(true);
});

test('evalBoolean returns false for constant false', () => {
    let boolean = { type: 'CONSTANT', value: false };
    expect(evalBoolean(boolean)).toBe(false);
});

