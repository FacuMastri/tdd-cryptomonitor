import {
  VALUE_CALL,
  VALUE_CONST,
  VALUE_VAR,
  ValueCall
} from '../../interpreter/types/value';
import { DISTINCT, EQUAL, PLUS } from '../../interpreter/types/calls';
import { evalValue, STORAGE } from '../../interpreter/interpreter';
import { BooleanType } from '../../interpreter/types/boolean';

//describe('text', () => {});
describe('evalValue', () => {
  test('evalValue returns true for == call with two true constants', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: EQUAL as typeof EQUAL,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: true },
        { type: VALUE_CONST as typeof VALUE_CONST, value: true }
      ]
    };
    expect(evalValue(call)).toBe(true);
  });

  test('evalValue returns false for == call with two false constants', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: EQUAL as typeof EQUAL,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: false },
        { type: VALUE_CONST as typeof VALUE_CONST, value: false }
      ]
    };
    expect(evalValue(call)).toBe(true);
  });

  test('evalValue returns false for == call with one true and one false constant', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: EQUAL as typeof EQUAL,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: true },
        { type: VALUE_CONST as typeof VALUE_CONST, value: false }
      ]
    };

    expect(evalValue(call)).toBe(false);
  });

  test('evalValue returns true for == call with three true constants', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: EQUAL as typeof EQUAL,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: true },
        { type: VALUE_CONST as typeof VALUE_CONST, value: true },
        { type: VALUE_CONST as typeof VALUE_CONST, value: true }
      ]
    };

    expect(evalValue(call)).toBe(true);
  });

  test('evalValue returns false for == call with one true and two false constants', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: EQUAL as typeof EQUAL,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: true },
        { type: VALUE_CONST as typeof VALUE_CONST, value: true },
        { type: VALUE_CONST as typeof VALUE_CONST, value: false }
      ]
    };

    expect(evalValue(call)).toBe(false);
  });

  test('evalValue returns true for == call with two equal constant numbers', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: EQUAL as typeof EQUAL,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 }
      ]
    };

    expect(evalValue(call)).toBe(true);
  });

  test('evalValue returns false for == call with two unequal constant numbers', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: EQUAL as typeof EQUAL,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 }
      ]
    };

    expect(evalValue(call)).toBe(false);
  });

  test('evalValue returns true for == call with three equal constant numbers', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: EQUAL as typeof EQUAL,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 }
      ]
    };

    expect(evalValue(call)).toBe(true);
  });

  test('evalValue returns false for == call with one equal and two unequal constant numbers', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: EQUAL as typeof EQUAL,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 }
      ]
    };

    expect(evalValue(call)).toBe(false);
  });

  test('evalValue throws an error for unknown boolean type', () => {
    const boolean = { type: 'UNKNOWN' } as unknown as BooleanType;
    expect(() => evalValue(boolean)).toThrow();
  });

  test('evalValue returns true for DISTINCT call with two different constants', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: DISTINCT as typeof DISTINCT,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: true },
        { type: VALUE_CONST as typeof VALUE_CONST, value: false }
      ]
    };

    expect(evalValue(call)).toBe(true);
  });

  test('evalValue returns false for DISTINCT call with two same constants', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: DISTINCT as typeof DISTINCT,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: true },
        { type: VALUE_CONST as typeof VALUE_CONST, value: true }
      ]
    };

    expect(evalValue(call)).toBe(false);
  });

  test('evalValue returns false for DISTINCT call with two same constants and one different', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: DISTINCT as typeof DISTINCT,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: true },
        { type: VALUE_CONST as typeof VALUE_CONST, value: false },
        { type: VALUE_CONST as typeof VALUE_CONST, value: true }
      ]
    };

    expect(evalValue(call)).toBe(false);
  });

  test('evalValue return variable value for VARIABLE value', () => {
    const variable = {
      type: VALUE_VAR as typeof VALUE_VAR,
      name: 'zero'
    };

    const context = STORAGE;

    expect(evalValue(variable, context)).toBe(0);
  });

  test('evalValue throws error for VARIABLE value with undefined variable', () => {
    const variable = {
      type: VALUE_VAR as typeof VALUE_VAR,
      name: 'b'
    };

    expect(() => evalValue(variable)).toThrow();
  });

  test('evalValue return constant value for CONSTANT value', () => {
    const constant = {
      type: VALUE_CONST as typeof VALUE_CONST,
      value: 123
    };

    expect(evalValue(constant)).toBe(123);
  });

  test('evalValue return value for CALL value', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: PLUS as typeof PLUS,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 }
      ]
    };

    expect(evalValue(call)).toBe(3);
  });

  test('evalValue throws error for unknown CALL', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: 'MEZCLAR HASTA INTEGRAR',
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 }
      ]
    } as unknown as ValueCall;

    expect(() => evalValue(call)).toThrow();
  });
});
