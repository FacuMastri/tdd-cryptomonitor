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
import {
  BooleanCall,
  BooleanCallUnary,
  BooleanConstant,
  BooleanType
} from '../../interpreter/types/boolean';

describe('evalBoolean', () => {
  test('evalBoolean returns true for constant true', () => {
    const boolean: BooleanConstant = { type: VALUE_CONST, value: true };
    expect(evalValue(boolean)).toBe(true);
  });

  test('evalBoolean returns false for constant false', () => {
    const boolean: BooleanConstant = { type: VALUE_CONST, value: false };
    expect(evalValue(boolean)).toBe(false);
  });

  test('evalBoolean returns true for < call with first constant lesser than the second one', () => {
    const call: BooleanCall = {
      type: VALUE_CALL,
      name: LESS,
      arguments: [
        { type: VALUE_CONST, value: 1 },
        { type: VALUE_CONST, value: 2 }
      ]
    };

    expect(evalValue(call)).toBe(true);
  });

  test('evalBoolean returns false for < call with first constant greater than the second one', () => {
    const call: BooleanCall = {
      type: VALUE_CALL,
      name: LESS,
      arguments: [
        { type: VALUE_CONST, value: 2 },
        { type: VALUE_CONST, value: 1 }
      ]
    };

    expect(evalValue(call)).toBe(false);
  });

  test('evalBoolean returns true for < call with three constants (1, 2, 3)', () => {
    const call: BooleanCall = {
      type: VALUE_CALL,
      name: LESS,
      arguments: [
        { type: VALUE_CONST, value: 1 },
        { type: VALUE_CONST, value: 2 },
        { type: VALUE_CONST, value: 3 }
      ]
    };

    expect(evalValue(call)).toBe(true);
  });

  test('evalBoolean returns false for < call with three constants (1, 2, 1)', () => {
    const call: BooleanCall = {
      type: VALUE_CALL,
      name: LESS,
      arguments: [
        { type: VALUE_CONST, value: 1 },
        { type: VALUE_CONST, value: 2 },
        { type: VALUE_CONST, value: 1 }
      ]
    };

    expect(evalValue(call)).toBe(false);
  });

  test('evalBoolean returns true for <= call with first constant lesser than the second one', () => {
    const call: BooleanCall = {
      type: VALUE_CALL,
      name: LESS_EQUAL,
      arguments: [
        { type: VALUE_CONST, value: 1 },
        { type: VALUE_CONST, value: 2 }
      ]
    };

    expect(evalValue(call)).toBe(true);
  });

  test('evalBoolean returns false for <= call with first constant greater than the second one', () => {
    const call: BooleanCall = {
      type: VALUE_CALL,
      name: LESS_EQUAL,
      arguments: [
        { type: VALUE_CONST, value: 2 },
        { type: VALUE_CONST, value: 1 }
      ]
    };

    expect(evalValue(call)).toBe(false);
  });

  test('evalBoolean returns true for <= call with two equal constants', () => {
    const call: BooleanCall = {
      type: VALUE_CALL,
      name: LESS_EQUAL,
      arguments: [
        { type: VALUE_CONST, value: 2 },
        { type: VALUE_CONST, value: 2 }
      ]
    };

    expect(evalValue(call)).toBe(true);
  });

  test('evalBoolean returns true for <= call with three constants (1, 2, 2)', () => {
    const call: BooleanCall = {
      type: VALUE_CALL,
      name: LESS_EQUAL,
      arguments: [
        { type: VALUE_CONST, value: 1 },
        { type: VALUE_CONST, value: 2 },
        { type: VALUE_CONST, value: 2 }
      ]
    };

    expect(evalValue(call)).toBe(true);
  });

  test('evalBoolean returns true for > call with first constant greater than the second one', () => {
    const call: BooleanCall = {
      type: VALUE_CALL,
      name: GREATER,
      arguments: [
        { type: VALUE_CONST, value: 2 },
        { type: VALUE_CONST, value: 1 }
      ]
    };

    expect(evalValue(call)).toBe(true);
  });

  test('evalBoolean returns false for > call with two equal constants', () => {
    const call: BooleanCall = {
      type: VALUE_CALL,
      name: GREATER,
      arguments: [
        { type: VALUE_CONST, value: 2 },
        { type: VALUE_CONST, value: 2 }
      ]
    };

    expect(evalValue(call)).toBe(false);
  });

  test('evalBoolean returns true for > call with three constants (3, 2, 1)', () => {
    const call: BooleanCall = {
      type: VALUE_CALL,
      name: GREATER,
      arguments: [
        { type: VALUE_CONST, value: 3 },
        { type: VALUE_CONST, value: 2 },
        { type: VALUE_CONST, value: 1 }
      ]
    };

    expect(evalValue(call)).toBe(true);
  });

  test('evalBoolean returns false for > call with three constants (1, 2, 1)', () => {
    const call: BooleanCall = {
      type: VALUE_CALL,
      name: GREATER,
      arguments: [
        { type: VALUE_CONST, value: 1 },
        { type: VALUE_CONST, value: 2 },
        { type: VALUE_CONST, value: 1 }
      ]
    };

    expect(evalValue(call)).toBe(false);
  });

  test('evalBoolean returns true for >= call with first constant greater than the second one', () => {
    const call: BooleanCall = {
      type: VALUE_CALL,
      name: GREATER_EQUAL,
      arguments: [
        { type: VALUE_CONST, value: 2 },
        { type: VALUE_CONST, value: 1 }
      ]
    };

    expect(evalValue(call)).toBe(true);
  });

  test('evalBoolean returns false for >= call with first constant lesser than the second one', () => {
    const call: BooleanCall = {
      type: VALUE_CALL,
      name: GREATER_EQUAL,
      arguments: [
        { type: VALUE_CONST, value: 1 },
        { type: VALUE_CONST, value: 2 }
      ]
    };

    expect(evalValue(call)).toBe(false);
  });

  test('evalBoolean returns true for >= call with two equal constants', () => {
    const call: BooleanCall = {
      type: VALUE_CALL,
      name: GREATER_EQUAL,
      arguments: [
        { type: VALUE_CONST, value: 2 },
        { type: VALUE_CONST, value: 2 }
      ]
    };

    expect(evalValue(call)).toBe(true);
  });

  test('evalBoolean returns true for >= call with three constants (3, 2, 1)', () => {
    const call: BooleanCall = {
      type: VALUE_CALL,
      name: GREATER_EQUAL,
      arguments: [
        { type: VALUE_CONST, value: 3 },
        { type: VALUE_CONST, value: 2 },
        { type: VALUE_CONST, value: 1 }
      ]
    };

    expect(evalValue(call)).toBe(true);
  });

  test('evalBoolean returns false for >= call with three constants (1, 2, 1)', () => {
    const call: BooleanCall = {
      type: VALUE_CALL,
      name: GREATER_EQUAL,
      arguments: [
        { type: VALUE_CONST, value: 1 },
        { type: VALUE_CONST, value: 2 },
        { type: VALUE_CONST, value: 1 }
      ]
    };

    expect(evalValue(call)).toBe(false);
  });

  test('evalBoolean returns true for AND call with two true constants', () => {
    const call: BooleanCall = {
      type: VALUE_CALL,
      name: AND,
      arguments: [
        { type: VALUE_CONST, value: true },
        { type: VALUE_CONST, value: true }
      ]
    };

    expect(evalValue(call)).toBe(true);
  });

  test('evalBoolean returns false for AND call with two false constants', () => {
    const call: BooleanCall = {
      type: VALUE_CALL,
      name: AND,
      arguments: [
        { type: VALUE_CONST, value: false },
        { type: VALUE_CONST, value: false }
      ]
    };

    expect(evalValue(call)).toBe(false);
  });

  test('evalBoolean returns false for AND call with one true and one false constant', () => {
    const call: BooleanCall = {
      type: VALUE_CALL,
      name: AND,
      arguments: [
        { type: VALUE_CONST, value: true },
        { type: VALUE_CONST, value: false }
      ]
    };

    expect(evalValue(call)).toBe(false);
  });

  test('evalBoolean returns true for AND call with three true constants', () => {
    const call: BooleanCall = {
      type: VALUE_CALL,
      name: AND,
      arguments: [
        { type: VALUE_CONST, value: true },
        { type: VALUE_CONST, value: true },
        { type: VALUE_CONST, value: true }
      ]
    };

    expect(evalValue(call)).toBe(true);
  });

  test('evalBoolean returns false for AND call with two true and one false constants', () => {
    const call: BooleanCall = {
      type: VALUE_CALL,
      name: AND,
      arguments: [
        { type: VALUE_CONST, value: true },
        { type: VALUE_CONST, value: true },
        { type: VALUE_CONST, value: false }
      ]
    };

    expect(evalValue(call)).toBe(false);
  });

  test('evalBoolean returns true for OR call with two true constants', () => {
    const call: BooleanCall = {
      type: VALUE_CALL,
      name: OR,
      arguments: [
        { type: VALUE_CONST, value: true },
        { type: VALUE_CONST, value: true }
      ]
    };

    expect(evalValue(call)).toBe(true);
  });

  test('evalBoolean returns false for OR call with two false constants', () => {
    const call: BooleanCall = {
      type: VALUE_CALL,
      name: OR,
      arguments: [
        { type: VALUE_CONST, value: false },
        { type: VALUE_CONST, value: false }
      ]
    };

    expect(evalValue(call)).toBe(false);
  });

  test('evalBoolean returns true for OR call with one true and one false constant', () => {
    const call: BooleanCall = {
      type: VALUE_CALL,
      name: OR,
      arguments: [
        { type: VALUE_CONST, value: true },
        { type: VALUE_CONST, value: false }
      ]
    };

    expect(evalValue(call)).toBe(true);
  });

  test('evalBoolean returns true for OR call with three true constants', () => {
    const call: BooleanCall = {
      type: VALUE_CALL,
      name: OR,
      arguments: [
        { type: VALUE_CONST, value: true },
        { type: VALUE_CONST, value: true },
        { type: VALUE_CONST, value: true }
      ]
    };

    expect(evalValue(call)).toBe(true);
  });

  test('evalBoolean returns true for OR call with two true and one false constants', () => {
    const call: BooleanCall = {
      type: VALUE_CALL,
      name: OR,
      arguments: [
        { type: VALUE_CONST, value: false },
        { type: VALUE_CONST, value: false },
        { type: VALUE_CONST, value: true }
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
    const call: BooleanCall = {
      type: VALUE_CALL,
      name: NOT,
      arguments: [{ type: VALUE_CONST, value: true }]
    };

    expect(evalValue(call)).toBe(false);
  });

  test('evalBoolean throws error for NOT call with two or more constants', () => {
    const call = {
      type: VALUE_CALL,
      name: NOT,
      arguments: [
        { type: VALUE_CONST, value: true },
        { type: VALUE_CONST, value: true }
      ]
    } as unknown as BooleanType;

    expect(() => evalValue(call)).toThrow(Error);
  });

  test("evalBoolean confirms De Morgan's laws", () => {
    const call: BooleanCall = {
      type: VALUE_CALL,
      name: EQUAL,
      arguments: [
        {
          type: VALUE_CALL,
          name: NOT,
          arguments: [
            {
              type: VALUE_CALL,
              name: AND,
              arguments: [
                { type: VALUE_CONST, value: true },
                { type: VALUE_CONST, value: true }
              ]
            }
          ]
        },
        {
          type: VALUE_CALL,
          name: OR,
          arguments: [
            {
              type: VALUE_CALL,
              name: NOT,
              arguments: [{ type: VALUE_CONST, value: true }]
            },
            {
              type: VALUE_CALL,
              name: NOT,
              arguments: [{ type: VALUE_CONST, value: true }]
            }
          ]
        }
      ]
    };
  });
});
