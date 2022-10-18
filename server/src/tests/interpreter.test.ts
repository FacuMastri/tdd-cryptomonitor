import { evalBoolean, evalNumber, evalValue } from '../interpreter/interpreter';
import { VALUE_CALL, VALUE_CONST, VALUE_VAR } from '../interpreter/types/value';
import { NumberType } from '../interpreter/types/number';
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
import { BooleanType } from '../interpreter/types/boolean';

test('evalBoolean returns true for constant true', () => {
  const boolean = { type: VALUE_CONST as typeof VALUE_CONST, value: true };
  expect(evalBoolean(boolean)).toBe(true);
});

test('evalBoolean returns false for constant false', () => {
  const boolean = { type: VALUE_CONST as typeof VALUE_CONST, value: false };
  expect(evalBoolean(boolean)).toBe(false);
});

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
  const boolean = { type: 'UNKNOWN' };
  fail();
  //expect(() => evalValue(boolean)).toThrow();
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

test('evalBoolean returns true for < call with two constants', () => {
  const call = {
    type: VALUE_CALL as typeof VALUE_CALL,
    name: LESS as typeof LESS,
    arguments: [
      { type: VALUE_CONST as typeof VALUE_CONST, value: 1 },
      { type: VALUE_CONST as typeof VALUE_CONST, value: 2 }
    ]
  };

  expect(evalBoolean(call)).toBe(true);
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

  expect(evalBoolean(call)).toBe(false);
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

  expect(evalBoolean(call)).toBe(true);
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

  expect(evalBoolean(call)).toBe(false);
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

  expect(evalBoolean(call)).toBe(true);
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

  expect(evalBoolean(call)).toBe(false);
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

  expect(evalBoolean(call)).toBe(true);
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

  expect(evalBoolean(call)).toBe(true);
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

  expect(evalBoolean(call)).toBe(true);
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

  expect(evalBoolean(call)).toBe(false);
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

  expect(evalBoolean(call)).toBe(true);
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

  expect(evalBoolean(call)).toBe(false);
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

  expect(evalBoolean(call)).toBe(true);
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

  expect(evalBoolean(call)).toBe(false);
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

  expect(evalBoolean(call)).toBe(true);
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

  expect(evalBoolean(call)).toBe(true);
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

  expect(evalBoolean(call)).toBe(false);
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

  expect(evalBoolean(call)).toBe(true);
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

  expect(evalBoolean(call)).toBe(false);
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

  expect(evalBoolean(call)).toBe(false);
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

  expect(evalBoolean(call)).toBe(true);
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

  expect(evalBoolean(call)).toBe(false);
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

  expect(evalBoolean(call)).toBe(true);
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

  expect(evalBoolean(call)).toBe(false);
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

  expect(evalBoolean(call)).toBe(true);
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

  expect(evalBoolean(call)).toBe(true);
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

  expect(evalBoolean(call)).toBe(true);
});

test('evalBoolean returns true for NOT call with false constant', () => {
  const call = {
    type: VALUE_CALL as typeof VALUE_CALL,
    name: NOT as typeof NOT,
    arguments: [{ type: VALUE_CONST as typeof VALUE_CONST, value: false }] as [
      BooleanType
    ]
  };

  expect(evalBoolean(call)).toBe(true);
});

test('evalBoolean returns false for NOT call with true constant', () => {
  const call = {
    type: VALUE_CALL as typeof VALUE_CALL,
    name: NOT as typeof NOT,
    arguments: [{ type: VALUE_CONST as typeof VALUE_CONST, value: true }] as [
      BooleanType
    ]
  };

  expect(evalBoolean(call)).toBe(false);
});

test('evalBoolean throws error for NOT call with two or more constants', () => {
  const call = {
    type: VALUE_CALL as typeof VALUE_CALL,
    name: NOT as typeof NOT,
    arguments: [
      { type: VALUE_CONST as typeof VALUE_CONST, value: true },
      { type: VALUE_CONST as typeof VALUE_CONST, value: true }
    ]
  };

  fail();
  //expect(() => evalBoolean(call)).toThrow();
});

test('evalNumber return 1 for constant 1', () => {
  const number = { type: VALUE_CONST as typeof VALUE_CONST, value: 1 };

  expect(evalNumber(number)).toBe(1);
});

test('evalNumber return 2 for constant 2', () => {
  const number = { type: VALUE_CONST as typeof VALUE_CONST, value: 2 };

  expect(evalNumber(number)).toBe(2);
});

test('evalNumber return -1 for NEGATE call with constant 1', () => {
  const call = {
    type: VALUE_CALL as typeof VALUE_CALL,
    name: NEGATE as typeof NEGATE,
    arguments: [{ type: VALUE_CONST as typeof VALUE_CONST, value: 1 }] as [
      NumberType
    ]
  };

  expect(evalNumber(call)).toBe(-1);
});

test('evalNumber return -2 for NEGATE call with constant 2', () => {
  const call = {
    type: VALUE_CALL as typeof VALUE_CALL,
    name: NEGATE as typeof NEGATE,
    arguments: [{ type: VALUE_CONST as typeof VALUE_CONST, value: 2 }] as [
      NumberType
    ]
  };

  expect(evalNumber(call)).toBe(-2);
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

  expect(evalNumber(call)).toBe(1);
});

test('evalNumber throws error for NEGATE call with two or more constants', () => {
  const call = {
    type: VALUE_CALL as typeof VALUE_CALL,
    name: NEGATE as typeof NEGATE,
    arguments: [
      { type: VALUE_CONST as typeof VALUE_CONST, value: 1 },
      { type: VALUE_CONST as typeof VALUE_CONST, value: 1 }
    ] as [NumberType, NumberType]
  };

  fail();
  //expect(() => evalNumber(call)).toThrow();
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

  expect(evalNumber(call)).toBe(2);
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

  expect(evalNumber(call)).toBe(3);
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

  expect(evalNumber(call)).toBe(6);
});

test('evalNumber throws error for + call with zero arguments', () => {
  const call = {
    type: VALUE_CALL as typeof VALUE_CALL,
    name: PLUS as typeof PLUS,
    arguments: []
  };

  expect(() => evalNumber(call)).toThrow();
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

  expect(evalNumber(call)).toBe(0);
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

  expect(evalNumber(call)).toBe(1);
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
  };

  fail();
  //expect(() => evalNumber(call)).toThrow();
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

  fail();
  //expect(evalNumber(call)).toBe(2);
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

  expect(evalNumber(call)).toBe(6);
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

  expect(evalNumber(call)).toBe(6);
});

test('evalNumber throws error for * call with no arguments', () => {
  const call = {
    type: VALUE_CALL as typeof VALUE_CALL,
    name: MULTIPLY as typeof MULTIPLY,
    arguments: []
  };

  expect(() => evalNumber(call)).toThrow();
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

  expect(evalNumber(call)).toBe(2);
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

  expect(evalNumber(call)).toBe(2);
});

test('evalNumber throws error for / call with zero arguments', () => {
  const call = {
    type: VALUE_CALL as typeof VALUE_CALL,
    name: DIVIDE as typeof DIVIDE,
    arguments: []
  };

  fail();
  //expect(() => evalNumber(call)).toThrow();
});

test('evalNumber throws error for / call with one argument', () => {
  const call = {
    type: VALUE_CALL as typeof VALUE_CALL,
    name: DIVIDE as typeof DIVIDE,
    arguments: [{ type: VALUE_CONST as typeof VALUE_CONST, value: 1 }]
  };

  fail();
  //expect(() => evalNumber(call)).toThrow();
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
  };

  fail();
  //expect(() => evalNumber(call)).toThrow();
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

  expect(() => evalNumber(call)).toThrow();
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

  expect(evalNumber(call)).toBe(1);
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

  expect(evalNumber(call)).toBe(1);
});

test('evalNumber return 5 for MIN call with constant 5', () => {
  const call = {
    type: VALUE_CALL as typeof VALUE_CALL,
    name: MIN as typeof MIN,
    arguments: [{ type: VALUE_CONST as typeof VALUE_CONST, value: 5 }]
  };

  expect(evalNumber(call)).toBe(5);
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

  expect(evalNumber(call)).toBe(2);
});

test('evalNumber throws error for MIN call with no arguments', () => {
  const call = {
    type: VALUE_CALL as typeof VALUE_CALL,
    name: MIN as typeof MIN,
    arguments: []
  };

  expect(() => evalNumber(call)).toThrow();
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

  expect(evalNumber(call)).toBe(2);
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

  expect(evalNumber(call)).toBe(2);
});

test('evalNumber return 5 for MAX call with constant 5', () => {
  const call = {
    type: VALUE_CALL as typeof VALUE_CALL,
    name: MAX as typeof MAX,
    arguments: [{ type: VALUE_CONST as typeof VALUE_CONST, value: 5 }] as [
      NumberType
    ]
  };

  expect(evalNumber(call)).toBe(5);
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

  expect(evalNumber(call)).toBe(5);
});

test('evalNumber throws error for MAX call with no arguments', () => {
  const call = {
    type: VALUE_CALL as typeof VALUE_CALL,
    name: MAX as typeof MAX,
    arguments: []
  };

  expect(() => evalNumber(call)).toThrow();
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

  expect(evalNumber(call)).toBeCloseTo(1.5);
});

test('evalNumber return 5 for AVERAGE call with constant 5', () => {
  const call = {
    type: VALUE_CALL as typeof VALUE_CALL,
    name: AVERAGE as typeof AVERAGE,
    arguments: [{ type: VALUE_CONST as typeof VALUE_CONST, value: 5 }]
  };

  expect(evalNumber(call)).toBe(5);
});

test('evalNumber throws error for AVERAGE call with no arguments', () => {
  const call = {
    type: VALUE_CALL as typeof VALUE_CALL,
    name: AVERAGE as typeof AVERAGE,
    arguments: []
  };

  expect(() => evalNumber(call)).toThrow();
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

  expect(evalNumber(call)).toBeCloseTo(3.3333333333333335);
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

  expect(evalNumber(call)).toBeCloseTo(0.5);
});

test('evalNumber return 0 for STDDEV call with constant 5', () => {
  const call = {
    type: VALUE_CALL as typeof VALUE_CALL,
    name: STDDEV as typeof STDDEV,
    arguments: [{ type: VALUE_CONST as typeof VALUE_CONST, value: 5 }]
  };

  expect(evalNumber(call)).toBe(0);
});

test('evalNumber throws error for STDDEV call with no arguments', () => {
  const call = {
    type: VALUE_CALL as typeof VALUE_CALL,
    name: STDDEV as typeof STDDEV,
    arguments: []
  };

  expect(() => evalNumber(call)).toThrow();
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

  expect(evalNumber(call)).toBeCloseTo(1.247219128924647);
});

test('evalNumber return 1 for FIRST call with constant 1', () => {
  const call = {
    type: VALUE_CALL as typeof VALUE_CALL,
    name: FIRST as typeof FIRST,
    arguments: [{ type: VALUE_CONST as typeof VALUE_CONST, value: 1 }]
  };

  expect(evalNumber(call)).toBe(1);
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

  expect(evalNumber(call)).toBe(1);
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

  expect(evalNumber(call)).toBe(5);
});

test('evalNumber throws error for FIRST call with no arguments', () => {
  const call = {
    type: VALUE_CALL as typeof VALUE_CALL,
    name: FIRST as typeof FIRST,
    arguments: []
  };

  expect(() => evalNumber(call)).toThrow();
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

  expect(evalNumber(call)).toBe(2);
});

test('evalNumber return 5 for LAST call with constant 5', () => {
  const call = {
    type: VALUE_CALL as typeof VALUE_CALL,
    name: LAST as typeof LAST,
    arguments: [{ type: VALUE_CONST as typeof VALUE_CONST, value: 5 }]
  };

  expect(evalNumber(call)).toBe(5);
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

  expect(evalNumber(call)).toBe(3);
});

test('evalNumber throws error for LAST call with no arguments', () => {
  const call = {
    type: VALUE_CALL as typeof VALUE_CALL,
    name: LAST as typeof LAST,
    arguments: []
  };

  expect(() => evalNumber(call)).toThrow();
});

test('evalValue return variable value for VARIABLE value', () => {
  const variable = {
    type: VALUE_VAR as typeof VALUE_VAR,
    name: 'a'
  };

  expect(evalValue(variable)).toBe(123);
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

/*
test('evalAction sets variable value for SET_VARIABLE action', () => {
  const action = {
    type: 'SET_VARIABLE',
    name: typeof 'a',
    value: { type: VALUE_CONST as typeof VALUE_CONST, value: 456 }
  };

  const context = evalAction(action, { a: 123 });

  expect(context.a).toBe(456);
});

test('evalAction sets variable value even if variable is not defined', () => {
  const action = {
    type: 'SET_VARIABLE',
    name: typeof 'b',
    value: { type: VALUE_CONST as typeof VALUE_CONST, value: 1000 }
  };

  const context = evalAction(action, { a: 123 });

  expect(context.b).toBe(1000);
});

test('evalAction buys stock for BUY_MARKET action', () => {
  const action = {
    type: 'BUY_MARKET',
    symbol: 'BTC',
    amount: { type: VALUE_CONST as typeof VALUE_CONST, value: 10 }
  };

  const context = evalAction(action, { wallets: {} });

  expect(context.wallets['BTC']).toBe(10);
});

test('evalAction throws error for BUY_MARKET action with negative amount', () => {
  const action = {
    type: 'BUY_MARKET',
    symbol: 'BTC',
    amount: { type: VALUE_CONST as typeof VALUE_CONST, value: -10 }
  };

  expect(() => evalAction(action, {})).toThrow();
});

test('evalAction sells stock for SELL_MARKET action', () => {
  const action = {
    type: 'SELL_MARKET',
    symbol: 'BTC',
    amount: { type: VALUE_CONST as typeof VALUE_CONST, value: 5 }
  };

  const context = evalAction(action, { wallets: { BTC: 10 } });

  expect(context.wallets['BTC']).toBe(5);
});

test('evalAction throws error for SELL_MARKET action with negative amount', () => {
  const action = {
    type: 'SELL_MARKET',
    symbol: 'BTC',
    amount: { type: VALUE_CONST as typeof VALUE_CONST, value: -5 }
  };

  expect(() => evalAction(action, { wallets: { BTC: 10 } })).toThrow();
});

test('evalAction throws error for SELL_MARKET action with amount greater than owned', () => {
  const action = {
    type: 'SELL_MARKET',
    symbol: 'BTC',
    amount: { type: VALUE_CONST as typeof VALUE_CONST, value: 15 }
  };

  expect(() => evalAction(action, { wallets: { BTC: 10 } })).toThrow();
});

test('evalAction throws error for SELL_MARKET action with no stock owned', () => {
  const action = {
    type: 'SELL_MARKET',
    symbol: 'BTC',
    amount: { type: VALUE_CONST as typeof VALUE_CONST, value: 5 }
  };

  expect(() => evalAction(action, { wallets: { BTC: 0 } })).toThrow();
});

test('evalAction throws error for SELL_MARKET action with unknown coin', () => {
  const action = {
    type: 'SELL_MARKET',
    symbol: 'BTC',
    amount: { type: VALUE_CONST as typeof VALUE_CONST, value: 5 }
  };

  expect(() => evalAction(action, { wallets: {} })).toThrow();
});

test('evalRule executes action if condition is true', () => {
  const rule = {
    condition: { type: VALUE_CONST as typeof VALUE_CONST, value: true },
    action: [
      {
        type: 'SET_VARIABLE',
        name: typeof 'a',
        value: { type: VALUE_CONST as typeof VALUE_CONST, value: 456 }
      }
    ]
  };

  const context = evalRule(rule, { a: 123 });

  expect(context.a).toBe(456);
});

test('evalRule does not execute action if condition is false', () => {
  const rule = {
    condition: { type: VALUE_CONST as typeof VALUE_CONST, value: false },
    action: [
      {
        type: 'SET_VARIABLE',
        name: typeof 'a',
        value: { type: VALUE_CONST as typeof VALUE_CONST, value: 456 }
      }
    ]
  };

  const context = evalRule(rule, { a: 123 });

  expect(context.a).toBe(123);
});

test('evalRule executes all rules', () => {
  const rule = {
    name: typeof 'test_rule',
    condition: {
      type: VALUE_CONST as typeof VALUE_CONST,
      value: true
    },
    action: [
      {
        type: 'SET_VARIABLE',
        name: typeof 'a',
        value: { type: VALUE_CONST as typeof VALUE_CONST, value: 888 }
      },
      {
        type: 'SET_VARIABLE',
        name: typeof 'b',
        value: { type: VALUE_CONST as typeof VALUE_CONST, value: 555 }
      }
    ]
  };

  const context = evalRule(rule, { a: 123, b: 0 });

  expect(context.a).toBe(888);
  expect(context.b).toBe(555);
});

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

  expect(evalNumber(call)).toBe(4500);
});
*/
