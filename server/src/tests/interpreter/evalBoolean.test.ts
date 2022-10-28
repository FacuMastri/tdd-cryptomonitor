import { VALUE_CALL, VALUE_CONST } from '../../interpreter/types/value';
import { evalValue } from '../../interpreter/interpreter';
import {
  AND,
  EQUAL,
  GREATER,
  GREATER_EQUAL,
  LESS,
  LESS_EQUAL,
  NOT,
  OR
} from '../../interpreter/types/calls';
import { BooleanCallUnary, BooleanType } from '../../interpreter/types/boolean';

describe('evalBoolean', () => {
  test('evalBoolean returns true for constant true', () => {
    const boolean = { type: VALUE_CONST as typeof VALUE_CONST, value: true };
    expect(evalValue(boolean)).toBe(true);
  });

  test('evalBoolean returns false for constant false', () => {
    const boolean = { type: VALUE_CONST as typeof VALUE_CONST, value: false };
    expect(evalValue(boolean)).toBe(false);
  });

  test('evalBoolean returns true for < call with first constant lesser than the second one', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: LESS as typeof LESS,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 }
      ]
    };

    expect(evalValue(call)).toBe(true);
  });

  test('evalBoolean returns false for < call with first constant greater than the second one', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: LESS as typeof LESS,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 }
      ]
    };

    expect(evalValue(call)).toBe(false);
  });

  test('evalBoolean returns true for < call with three constants', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: LESS as typeof LESS,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 3 }
      ]
    };

    expect(evalValue(call)).toBe(true);
  });

  test('evalBoolean returns false for < call with three constants', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: LESS as typeof LESS,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 }
      ]
    };

    expect(evalValue(call)).toBe(false);
  });

  test('evalBoolean returns true for <= call with two constants', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: LESS_EQUAL as typeof LESS_EQUAL,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 }
      ]
    };

    expect(evalValue(call)).toBe(true);
  });

  test('evalBoolean returns false for <= call with two constants', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: LESS_EQUAL as typeof LESS_EQUAL,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 }
      ]
    };

    expect(evalValue(call)).toBe(false);
  });

  test('evalBoolean returns true for <= call with two equal constants', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: LESS_EQUAL as typeof LESS_EQUAL,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 }
      ]
    };

    expect(evalValue(call)).toBe(true);
  });

  test('evalBoolean returns true for <= call with three constants', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: LESS_EQUAL as typeof LESS_EQUAL,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 }
      ]
    };

    expect(evalValue(call)).toBe(true);
  });

  test('evalBoolean returns true for > call with two constants', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: GREATER as typeof GREATER,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 }
      ]
    };

    expect(evalValue(call)).toBe(true);
  });

  test('evalBoolean returns false for > call with two constants', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: GREATER as typeof GREATER,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 }
      ]
    };

    expect(evalValue(call)).toBe(false);
  });

  test('evalBoolean returns true for > call with three constants', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: GREATER as typeof GREATER,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 3 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 }
      ]
    };

    expect(evalValue(call)).toBe(true);
  });

  test('evalBoolean returns false for > call with three constants', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: GREATER as typeof GREATER,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 }
      ]
    };

    expect(evalValue(call)).toBe(false);
  });

  test('evalBoolean returns true for >= call with two constants', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: GREATER_EQUAL as typeof GREATER_EQUAL,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 }
      ]
    };

    expect(evalValue(call)).toBe(true);
  });

  test('evalBoolean returns false for >= call with two constants', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: GREATER_EQUAL as typeof GREATER_EQUAL,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 }
      ]
    };

    expect(evalValue(call)).toBe(false);
  });

  test('evalBoolean returns true for >= call with two equal constants', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: GREATER_EQUAL as typeof GREATER_EQUAL,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 }
      ]
    };

    expect(evalValue(call)).toBe(true);
  });

  test('evalBoolean returns true for >= call with three constants', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: GREATER_EQUAL as typeof GREATER_EQUAL,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 3 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 }
      ]
    };

    expect(evalValue(call)).toBe(true);
  });

  test('evalBoolean returns false for >= call with three constants', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: GREATER_EQUAL as typeof GREATER_EQUAL,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 }
      ]
    };

    expect(evalValue(call)).toBe(false);
  });

  test('evalBoolean returns true for AND call with two true constants', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: AND as typeof AND,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: true },
        { type: VALUE_CONST as typeof VALUE_CONST, value: true }
      ]
    };

    expect(evalValue(call)).toBe(true);
  });

  test('evalBoolean returns false for AND call with two false constants', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: AND as typeof AND,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: false },
        { type: VALUE_CONST as typeof VALUE_CONST, value: false }
      ]
    };

    expect(evalValue(call)).toBe(false);
  });

  test('evalBoolean returns false for AND call with one true and one false constant', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: AND as typeof AND,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: true },
        { type: VALUE_CONST as typeof VALUE_CONST, value: false }
      ]
    };

    expect(evalValue(call)).toBe(false);
  });

  test('evalBoolean returns true for AND call with three true constants', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: AND as typeof AND,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: true },
        { type: VALUE_CONST as typeof VALUE_CONST, value: true },
        { type: VALUE_CONST as typeof VALUE_CONST, value: true }
      ]
    };

    expect(evalValue(call)).toBe(true);
  });

  test('evalBoolean returns false for AND call with two true and one false constants', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: AND as typeof AND,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: true },
        { type: VALUE_CONST as typeof VALUE_CONST, value: true },
        { type: VALUE_CONST as typeof VALUE_CONST, value: false }
      ]
    };

    expect(evalValue(call)).toBe(false);
  });

  test('evalBoolean returns true for OR call with two true constants', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: OR as typeof OR,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: true },
        { type: VALUE_CONST as typeof VALUE_CONST, value: true }
      ]
    };

    expect(evalValue(call)).toBe(true);
  });

  test('evalBoolean returns false for OR call with two false constants', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: OR as typeof OR,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: false },
        { type: VALUE_CONST as typeof VALUE_CONST, value: false }
      ]
    };

    expect(evalValue(call)).toBe(false);
  });

  test('evalBoolean returns true for OR call with one true and one false constant', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: OR as typeof OR,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: true },
        { type: VALUE_CONST as typeof VALUE_CONST, value: false }
      ]
    };

    expect(evalValue(call)).toBe(true);
  });

  test('evalBoolean returns true for OR call with three true constants', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: OR as typeof OR,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: true },
        { type: VALUE_CONST as typeof VALUE_CONST, value: true },
        { type: VALUE_CONST as typeof VALUE_CONST, value: true }
      ]
    };

    expect(evalValue(call)).toBe(true);
  });

  test('evalBoolean returns true for OR call with two true and one false constants', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: OR as typeof OR,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: false },
        { type: VALUE_CONST as typeof VALUE_CONST, value: false },
        { type: VALUE_CONST as typeof VALUE_CONST, value: true }
      ]
    };

    expect(evalValue(call)).toBe(true);
  });

  test('evalBoolean returns true for NOT call with false constant', () => {
    const value: BooleanType = {
      type: VALUE_CONST,
      value: false
    };
    const call: BooleanCallUnary = {
      type: VALUE_CALL,
      name: NOT,
      arguments: [value]
    };

    expect(evalValue(call)).toBe(true);
  });

  test('evalBoolean returns false for NOT call with true constant', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: NOT as typeof NOT,
      arguments: [{ type: VALUE_CONST as typeof VALUE_CONST, value: true }] as [
        BooleanType
      ]
    } as unknown as BooleanType;

    expect(evalValue(call)).toBe(false);
  });

  test('evalBoolean throws error for NOT call with two or more constants', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: NOT as typeof NOT,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: true },
        { type: VALUE_CONST as typeof VALUE_CONST, value: true }
      ]
    } as unknown as BooleanType;

    expect(() => evalValue(call)).toThrow();
  });

  test("evalBoolean confirms De Morgan's laws", () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: EQUAL as typeof EQUAL,
      arguments: [
        {
          type: VALUE_CALL as typeof VALUE_CALL,
          name: NOT as typeof NOT,
          arguments: [
            {
              type: VALUE_CALL as typeof VALUE_CALL,
              name: AND as typeof AND,
              arguments: [
                { type: VALUE_CONST as typeof VALUE_CONST, value: true },
                { type: VALUE_CONST as typeof VALUE_CONST, value: true }
              ]
            }
          ]
        },
        {
          type: VALUE_CALL as typeof VALUE_CALL,
          name: OR as typeof OR,
          arguments: [
            {
              type: VALUE_CALL as typeof VALUE_CALL,
              name: NOT as typeof NOT,
              arguments: [
                { type: VALUE_CONST as typeof VALUE_CONST, value: true }
              ]
            },
            {
              type: VALUE_CALL as typeof VALUE_CALL,
              name: NOT as typeof NOT,
              arguments: [
                { type: VALUE_CONST as typeof VALUE_CONST, value: true }
              ]
            }
          ]
        }
      ]
    };
  });
});
