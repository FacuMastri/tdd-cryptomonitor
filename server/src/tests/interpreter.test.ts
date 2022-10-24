import {
  evalBoolean,
  evalNumber,
  evalValue,
  evalAction,
  evalRule,
  loadDatum,
  STORAGE,
  evalRules
} from '../interpreter/interpreter';
import {
  ValueCall,
  ValueWallet,
  VALUE_CALL,
  VALUE_CONST,
  VALUE_VAR
} from '../interpreter/types/value';
import {
  ContextDatum,
  NumberCallMany,
  NumberData,
  NumberType,
  NUMBER_DATA
} from '../interpreter/types/number';
import {
  AND,
  AVERAGE,
  DISTINCT,
  DIVIDE,
  EQUAL,
  FIRST,
  GREATER,
  GREATER_EQUAL,
  LAST,
  LESS,
  LESS_EQUAL,
  MAX,
  MIN,
  MINUS,
  MULTIPLY,
  NEGATE,
  NOT,
  OR,
  PLUS,
  STDDEV
} from '../interpreter/types/calls';
import { BooleanCallUnary, BooleanType } from '../interpreter/types/boolean';
import {
  Action,
  ACTION_SET,
  ACTION_BUY,
  ActionBuyMarket,
  ACTION_SELL,
  ActionSellMarket
} from '../interpreter/types/action';
import { Context } from 'vm';
import { Rule, Rules } from '../interpreter/types/rule';

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

describe('evalBoolean', () => {
  test('evalBoolean returns true for constant true', () => {
    const boolean = { type: VALUE_CONST as typeof VALUE_CONST, value: true };
    expect(evalValue(boolean)).toBe(true);
  });

  test('evalBoolean returns false for constant false', () => {
    const boolean = { type: VALUE_CONST as typeof VALUE_CONST, value: false };
    expect(evalValue(boolean)).toBe(false);
  });

  test('evalBoolean returns true for < call with two constants', () => {
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

  test('evalBoolean returns false for < call with two constants', () => {
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
});

describe('evalNumber', () => {
  test('evalNumber return 1 for constant 1', () => {
    const number = { type: VALUE_CONST as typeof VALUE_CONST, value: 1 };

    expect(evalValue(number)).toBe(1);
  });

  test('evalNumber return 2 for constant 2', () => {
    const number = { type: VALUE_CONST as typeof VALUE_CONST, value: 2 };

    expect(evalValue(number)).toBe(2);
  });

  test('evalNumber return -1 for NEGATE call with constant 1', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: NEGATE as typeof NEGATE,
      arguments: [{ type: VALUE_CONST as typeof VALUE_CONST, value: 1 }] as [
        NumberType
      ]
    };

    expect(evalValue(call)).toBe(-1);
  });

  test('evalNumber return -2 for NEGATE call with constant 2', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: NEGATE as typeof NEGATE,
      arguments: [{ type: VALUE_CONST as typeof VALUE_CONST, value: 2 }] as [
        NumberType
      ]
    };

    expect(evalValue(call)).toBe(-2);
  });

  test('evalNumber return 1 for NEGATE call with constant -1', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: NEGATE as typeof NEGATE,
      arguments: [
        {
          type: VALUE_CONST as typeof VALUE_CONST,
          value: -1
        }
      ] as [NumberType]
    };

    expect(evalValue(call)).toBe(1);
  });

  test('evalNumber throws error for NEGATE call with two or more constants', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: NEGATE as typeof NEGATE,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 }
      ] as [NumberType, NumberType]
    } as unknown as NumberType;

    expect(() => evalValue(call)).toThrow();
  });

  test('evalNumber return 2 for + call with constant 1 and constant 1', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: PLUS as typeof PLUS,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 }
      ]
    };

    expect(evalValue(call)).toBe(2);
  });

  test('evalNumber return 3 for + call with constant 1 and constant 2', () => {
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

  test('evalNumber return 6 for + call with constant 1, constant 2 and constant 3', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: PLUS as typeof PLUS,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 3 }
      ]
    };

    expect(evalValue(call)).toBe(6);
  });

  test('evalNumber throws error for + call with zero arguments', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: PLUS as typeof PLUS,
      arguments: []
    };

    expect(() => evalValue(call)).toThrow();
  });

  test('evalNumber return 0 for - call with constant 1 and constant 1', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: MINUS as typeof MINUS,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 }
      ] as [NumberType, NumberType]
    };

    expect(evalValue(call)).toBe(0);
  });

  test('evalNumber return 1 for - call with constant 2 and constant 1', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: MINUS as typeof MINUS,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 }
      ] as [NumberType, NumberType]
    };

    expect(evalValue(call)).toBe(1);
  });

  test('evalNumber throws error for - call with other than two arguments', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: MINUS as typeof MINUS,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 }
      ] as [NumberType, NumberType, NumberType]
    } as unknown as NumberType;

    expect(() => evalValue(call)).toThrow();
  });

  test('evalNumber return 2 for * call with constant 1 and constant 2', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: MULTIPLY as typeof MULTIPLY,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 }
      ]
    };

    expect(evalValue(call)).toBe(2);
  });

  test('evalNumber return 6 for * call with constant 2 and constant 3', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: MULTIPLY as typeof MULTIPLY,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 3 }
      ]
    };

    expect(evalValue(call)).toBe(6);
  });

  test('evalNumber return 6 for * call with constant 1, constant 2 and constant 3', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: MULTIPLY as typeof MULTIPLY,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 3 }
      ]
    };

    expect(evalValue(call)).toBe(6);
  });

  test('evalNumber throws error for * call with no arguments', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: MULTIPLY as typeof MULTIPLY,
      arguments: []
    };

    expect(() => evalValue(call)).toThrow();
  });

  test('evalNumber return 2 for / call with constant 4 and constant 2', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: DIVIDE as typeof DIVIDE,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 4 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 }
      ] as [NumberType, NumberType]
    };

    expect(evalValue(call)).toBe(2);
  });

  test('evalNumber return 2 for / call with constant 6 and constant 3', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: DIVIDE as typeof DIVIDE,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 6 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 3 }
      ] as [NumberType, NumberType]
    };

    expect(evalValue(call)).toBe(2);
  });

  test('evalNumber throws error for / call with zero arguments', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: DIVIDE as typeof DIVIDE,
      arguments: []
    } as unknown as NumberType;

    expect(() => evalValue(call)).toThrow();
  });

  test('evalNumber throws error for / call with one argument', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: DIVIDE as typeof DIVIDE,
      arguments: [{ type: VALUE_CONST as typeof VALUE_CONST, value: 1 }]
    } as unknown as NumberType;

    expect(() => evalValue(call)).toThrow();
  });

  test('evalNumber throws error for / call with more than two arguments', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: DIVIDE as typeof DIVIDE,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 }
      ]
    } as unknown as NumberType;

    expect(() => evalValue(call)).toThrow();
  });

  test('evalNumber throws error for / call that divides by zero', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: DIVIDE as typeof DIVIDE,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 0 }
      ] as [NumberType, NumberType]
    };

    expect(() => evalValue(call)).toThrow();
  });

  test('evalNumber return 1 for MIN call with constant 1 and constant 2', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: MIN as typeof MIN,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 }
      ]
    };

    expect(evalValue(call)).toBe(1);
  });

  test('evalNumber return 1 for MIN call with constant 2 and constant 1', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: MIN as typeof MIN,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 }
      ] as [NumberType, NumberType]
    };

    expect(evalValue(call)).toBe(1);
  });

  test('evalNumber return 5 for MIN call with constant 5', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: MIN as typeof MIN,
      arguments: [{ type: VALUE_CONST as typeof VALUE_CONST, value: 5 }]
    };

    expect(evalValue(call)).toBe(5);
  });

  test('evalNumber return min value for MIN call with more than two arguments', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: MIN as typeof MIN,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 5 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 3 }
      ] as [NumberType, NumberType, NumberType]
    };

    expect(evalValue(call)).toBe(2);
  });

  test('evalNumber throws error for MIN call with no arguments', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: MIN as typeof MIN,
      arguments: []
    };

    expect(() => evalValue(call)).toThrow();
  });

  test('evalNumber return 2 for MAX call with constant 1 and constant 2', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: MAX as typeof MAX,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 }
      ] as [NumberType, NumberType]
    };

    expect(evalValue(call)).toBe(2);
  });

  test('evalNumber return 2 for MAX call with constant 2 and constant 1', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: MAX as typeof MAX,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 }
      ] as [NumberType, NumberType]
    };

    expect(evalValue(call)).toBe(2);
  });

  test('evalNumber return 5 for MAX call with constant 5', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: MAX as typeof MAX,
      arguments: [{ type: VALUE_CONST as typeof VALUE_CONST, value: 5 }] as [
        NumberType
      ]
    };

    expect(evalValue(call)).toBe(5);
  });

  test('evalNumber return max value for MAX call with more than two arguments', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: MAX as typeof MAX,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 5 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 3 }
      ]
    };

    expect(evalValue(call)).toBe(5);
  });

  test('evalNumber throws error for MAX call with no arguments', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: MAX as typeof MAX,
      arguments: []
    };

    expect(() => evalValue(call)).toThrow();
  });

  test('evalNumber return 1.5 for AVERAGE call with constant 1 and constant 2', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: AVERAGE as typeof AVERAGE,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 }
      ]
    };

    expect(evalValue(call)).toBeCloseTo(1.5);
  });

  test('evalNumber return 5 for AVERAGE call with constant 5', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: AVERAGE as typeof AVERAGE,
      arguments: [{ type: VALUE_CONST as typeof VALUE_CONST, value: 5 }]
    };

    expect(evalValue(call)).toBe(5);
  });

  test('evalNumber throws error for AVERAGE call with no arguments', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: AVERAGE as typeof AVERAGE,
      arguments: []
    };

    expect(() => evalValue(call)).toThrow();
  });

  test('evalNumber return average value for AVERAGE call with more than two arguments', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: AVERAGE as typeof AVERAGE,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 5 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 3 }
      ]
    };

    expect(evalValue(call)).toBeCloseTo(3.3333333333333335);
  });

  test('evalNumber return 0.5 for STDDEV call with constant 1 and constant 2', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: STDDEV as typeof STDDEV,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 }
      ]
    };

    expect(evalValue(call)).toBeCloseTo(0.5);
  });

  test('evalNumber return 0 for STDDEV call with constant 5', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: STDDEV as typeof STDDEV,
      arguments: [{ type: VALUE_CONST as typeof VALUE_CONST, value: 5 }]
    };

    expect(evalValue(call)).toBe(0);
  });

  test('evalNumber throws error for STDDEV call with no arguments', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: STDDEV as typeof STDDEV,
      arguments: []
    };

    expect(() => evalValue(call)).toThrow();
  });

  test('evalNumber return standard deviation value for STDDEV call with more than two arguments', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: STDDEV as typeof STDDEV,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 5 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 3 }
      ]
    };

    expect(evalValue(call)).toBeCloseTo(1.247219128924647);
  });

  test('evalNumber return 1 for FIRST call with constant 1', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: FIRST as typeof FIRST,
      arguments: [{ type: VALUE_CONST as typeof VALUE_CONST, value: 1 }]
    };

    expect(evalValue(call)).toBe(1);
  });

  test('evalNumber return 1 for FIRST call with constant 1 and constant 2', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: FIRST as typeof FIRST,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 }
      ]
    };

    expect(evalValue(call)).toBe(1);
  });

  test('evalNumber return first value for FIRST call with more than two arguments', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: FIRST as typeof FIRST,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 5 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 3 }
      ]
    };

    expect(evalValue(call)).toBe(5);
  });

  test('evalNumber throws error for FIRST call with no arguments', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: FIRST as typeof FIRST,
      arguments: []
    };

    expect(() => evalValue(call)).toThrow();
  });

  test('evalNumber return 2 for LAST call with constant 1 and constant 2', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: LAST as typeof LAST,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 1 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 }
      ]
    };

    expect(evalValue(call)).toBe(2);
  });

  test('evalNumber return 5 for LAST call with constant 5', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: LAST as typeof LAST,
      arguments: [{ type: VALUE_CONST as typeof VALUE_CONST, value: 5 }]
    };

    expect(evalValue(call)).toBe(5);
  });

  test('evalNumber return last value for LAST call with more than two arguments', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: LAST as typeof LAST,
      arguments: [
        { type: VALUE_CONST as typeof VALUE_CONST, value: 5 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 2 },
        { type: VALUE_CONST as typeof VALUE_CONST, value: 3 }
      ]
    };

    expect(evalValue(call)).toBe(3);
  });

  test('evalNumber throws error for LAST call with no arguments', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: LAST as typeof LAST,
      arguments: []
    };

    expect(() => evalValue(call)).toThrow();
  });

  /*
  test('evalNumber with CALL of N arguments works with default DATA', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: PLUS as typeof PLUS,
      arguments: {
        type: typeof NUMBER_DATA,
        symbol: 'BTC/USDT',
        since: 3600,
        until: 0,
        default: [
          {
            type: VALUE_CONST as typeof VALUE_CONST,
            value: 1500
          },
          {
            type: VALUE_CONST as typeof VALUE_CONST,
            value: 3000
          }
        ]
      }
    };

    expect(evalValue(call)).toBe(4500);
  });
  */
});

describe('evalAction', () => {
  test('evalAction sets variable value for SET_VARIABLE action', () => {
    const action: Action = {
      type: ACTION_SET,
      name: 'a',
      value: {
        type: VALUE_CONST as typeof VALUE_CONST,
        value: 123
      }
    };

    const context = { a: 0 };

    evalAction(action, context);

    expect(context?.a).toBe(123);
  });

  test('evalAction sets variable value even if variable is not defined', () => {
    const action: Action = {
      type: ACTION_SET,
      name: 'b',
      value: {
        type: VALUE_CONST as typeof VALUE_CONST,
        value: 123
      }
    };

    const context = evalAction(action, { a: 0 });

    expect(context?.b).toBe(123);
  });

  test('cant set reserved variable', () => {
    const action: Action = {
      type: ACTION_SET,
      name: 'data',
      value: {
        type: VALUE_CONST as typeof VALUE_CONST,
        value: 123
      }
    };

    expect(() => evalAction(action, {})).toThrow();
  });

  test('evalAction buys stock for BUY_MARKET action', () => {
    const action: ActionBuyMarket = {
      type: ACTION_BUY,
      symbol: 'BTC',
      amount: { type: VALUE_CONST as typeof VALUE_CONST, value: 100 }
    };

    const btcWallet: ValueWallet = {
      type: 'WALLET',
      symbol: 'BTC',
      amount: 1000
    };
    const context: Context = {
      wallets: [btcWallet]
    };

    evalAction(action, context);

    const ctxBtcWallet = context.wallets.find(
      (w: ValueWallet) => w.symbol === 'BTC'
    );

    expect(ctxBtcWallet.amount).toBe(1100);
  });

  test('evalAction throws error for BUY_MARKET action with negative amount', () => {
    const action: ActionBuyMarket = {
      type: ACTION_BUY,
      symbol: 'BTC',
      amount: { type: VALUE_CONST as typeof VALUE_CONST, value: -100 }
    };

    expect(() => evalAction(action, {})).toThrow();
  });

  test('evalAction sells stock for SELL_MARKET action', () => {
    const action: ActionSellMarket = {
      type: ACTION_SELL,
      symbol: 'BTC',
      amount: { type: VALUE_CONST as typeof VALUE_CONST, value: 100 }
    };

    const btcWallet: ValueWallet = {
      type: 'WALLET',
      symbol: 'BTC',
      amount: 1000
    };
    const context: Context = {
      wallets: [btcWallet]
    };
    evalAction(action, context);

    const ctxBtcWallet = context.wallets.find(
      (w: ValueWallet) => w.symbol === 'BTC'
    );

    expect(ctxBtcWallet.amount).toBe(900);
  });

  test('evalAction throws error for SELL_MARKET action with negative amount', () => {
    const action: ActionSellMarket = {
      type: ACTION_SELL,
      symbol: 'BTC',
      amount: { type: VALUE_CONST as typeof VALUE_CONST, value: -100 }
    };

    const btcWallet: ValueWallet = {
      type: 'WALLET',
      symbol: 'BTC',
      amount: 1000
    };
    const context: Context = {
      wallets: [btcWallet]
    };

    expect(() => evalAction(action, context)).toThrow();
  });

  test('evalAction throws error for SELL_MARKET action with amount greater than owned', () => {
    const action: ActionSellMarket = {
      type: ACTION_SELL,
      symbol: 'BTC',
      amount: { type: VALUE_CONST as typeof VALUE_CONST, value: 1000 }
    };

    const btcWallet: ValueWallet = {
      type: 'WALLET',
      symbol: 'BTC',
      amount: 100
    };
    const context: Context = {
      wallets: [btcWallet]
    };

    expect(() => evalAction(action, context)).toThrow();
  });

  test('evalAction throws error for SELL_MARKET action with no stock owned', () => {
    const action: ActionSellMarket = {
      type: ACTION_SELL,
      symbol: 'BTC',
      amount: { type: VALUE_CONST as typeof VALUE_CONST, value: 1 }
    };

    const btcWallet: ValueWallet = {
      type: 'WALLET',
      symbol: 'BTC',
      amount: 0
    };
    const context: Context = {
      wallets: [btcWallet]
    };

    expect(() => evalAction(action, context)).toThrow();
  });

  test('evalAction throws error for SELL_MARKET action with unknown coin', () => {
    const action: ActionSellMarket = {
      type: ACTION_SELL,
      symbol: 'BTC',
      amount: { type: VALUE_CONST as typeof VALUE_CONST, value: 1000 }
    };

    const context: Context = {
      wallets: []
    };

    expect(() => evalAction(action, context)).toThrow();
  });

  test('evalAction throws error for unknown action', () => {
    const action = {
      type: 'DO THE THING',
      symbol: 'BTC',
      amount: { type: VALUE_CONST as typeof VALUE_CONST, value: 1 }
    } as unknown as Action;

    expect(() => evalAction(action, {})).toThrow();
  });
});

describe('evalRule', () => {
  test('evalRule executes action if condition is true', () => {
    const condition: BooleanType = {
      type: VALUE_CONST,
      value: true
    };

    const action: Action = {
      type: ACTION_SET,
      name: 'a',
      value: {
        type: VALUE_CONST as typeof VALUE_CONST,
        value: 123
      }
    };

    const rule: Rule = {
      name: 'test',
      condition,
      actions: [action]
    };

    const context = { a: 0 };

    evalRule(rule, context);

    expect(context.a).toBe(123);
  });
  test('evalRule does not execute action if condition is false', () => {
    const condition: BooleanType = {
      type: VALUE_CONST,
      value: false
    };

    const action: Action = {
      type: ACTION_SET,
      name: 'a',
      value: {
        type: VALUE_CONST as typeof VALUE_CONST,
        value: 123
      }
    };

    const rule: Rule = {
      name: 'test',
      condition,
      actions: [action]
    };

    const context = { a: 0 };

    evalRule(rule, context);

    expect(context.a).toBe(0);
  });

  test('evalRule executes all rules', () => {
    const condition: BooleanType = {
      type: VALUE_CONST,
      value: true
    };

    const action_a: Action = {
      type: ACTION_SET,
      name: 'a',
      value: {
        type: VALUE_CONST,
        value: 101
      }
    };

    const action_b: Action = {
      type: ACTION_SET,
      name: 'b',
      value: {
        type: VALUE_CONST,
        value: 102
      }
    };

    const rule: Rule = {
      name: 'test',
      condition,
      actions: [action_a, action_b]
    };

    const context: Context = { a: 0 };

    evalRule(rule, context);

    expect(context.a).toBe(101);
    expect(context.b).toBe(102);
  });

  test('evalRules throws error if required vars are not set', () => {
    const rules: Rules = {
      requiredVariables: ['a'],
      rules: []
    };

    expect(() => evalRules(rules, {})).toThrow();
  });
});

describe('data', () => {
  test('loaded datum is accesible', () => {
    const context: Context = {};

    const datum: ContextDatum = {
      value: 300,
      timestamp: Date.now()
    };

    loadDatum('USD/ARG', datum, context);

    const data = context.data['USD/ARG'];

    expect(data[0].value).toBe(300);
  });

  test('default value is returned when there is no data', () => {
    const context: Context = {};

    const _arguments: NumberData = {
      type: NUMBER_DATA,
      symbol: 'RICE_PRICE',
      from: 5, // 5sec ago
      until: 1, // 1sec ago
      default: {
        type: VALUE_CONST,
        value: 404
      }
    };

    const call: NumberCallMany = {
      type: VALUE_CALL,
      name: PLUS,
      arguments: _arguments
    };

    const result = evalValue(call, context);

    expect(result).toBe(404);
  });

  test('data outside from/until is excluded', () => {
    const context: Context = {};

    const data: ContextDatum[] = [
      {
        value: 80,
        timestamp: Date.now()
      },
      {
        value: 40,
        timestamp: Date.now() - 2000 // 2sec ago
      },
      {
        value: 20,
        timestamp: Date.now() - 4000 // 4sec ago
      },
      {
        value: 10,
        timestamp: Date.now() - 6000 // 6sec ago
      }
    ];

    data.forEach((datum) => loadDatum('RICE_PRICE', datum, context));

    const _arguments: NumberData = {
      type: NUMBER_DATA,
      symbol: 'RICE_PRICE',
      from: 5, // 5sec ago
      until: 1, // 1sec ago
      default: {
        type: VALUE_CONST,
        value: 403
      }
    };

    const call: NumberCallMany = {
      type: VALUE_CALL,
      name: PLUS,
      arguments: _arguments
    };

    const result = evalValue(call, context);

    expect(result).toBe(40 + 20);
  });
});
