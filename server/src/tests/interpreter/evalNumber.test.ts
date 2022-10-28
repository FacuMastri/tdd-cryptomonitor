import {
  VALUE_CALL,
  VALUE_CONST,
  VALUE_VAR
} from '../../interpreter/types/value';
import { evalNumber, evalValue } from '../../interpreter/interpreter';
import {
  AVERAGE,
  DIVIDE,
  FIRST,
  LAST,
  MAX,
  MIN,
  MINUS,
  MULTIPLY,
  NEGATE,
  PLUS,
  STDDEV
} from '../../interpreter/types/calls';
import { NumberType } from '../../interpreter/types/number';

describe('evalNumber', () => {
  test('evalNumber returns 1 for constant 1', () => {
    const number = { type: VALUE_CONST as typeof VALUE_CONST, value: 1 };

    expect(evalValue(number)).toBe(1);
  });

  test('evalNumber returns 2 for constant 2', () => {
    const number = { type: VALUE_CONST as typeof VALUE_CONST, value: 2 };

    expect(evalValue(number)).toBe(2);
  });

  test('evalNumber returns -1 for NEGATE call with constant 1', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: NEGATE as typeof NEGATE,
      arguments: [{ type: VALUE_CONST as typeof VALUE_CONST, value: 1 }] as [
        NumberType
      ]
    };

    expect(evalValue(call)).toBe(-1);
  });

  test('evalNumber returns -2 for NEGATE call with constant 2', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: NEGATE as typeof NEGATE,
      arguments: [{ type: VALUE_CONST as typeof VALUE_CONST, value: 2 }] as [
        NumberType
      ]
    };

    expect(evalValue(call)).toBe(-2);
  });

  test('evalNumber returns 1 for NEGATE call with constant -1', () => {
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

    expect(() => evalValue(call)).toThrow(Error);
  });

  test('evalNumber returns 2 for + call with constant 1 and constant 1', () => {
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

  test('evalNumber returns 3 for + call with constant 1 and constant 2', () => {
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

  test('evalNumber returns 6 for + call with constant 1, constant 2 and constant 3', () => {
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

    expect(() => evalValue(call)).toThrow(Error);
  });

  test('evalNumber returns 0 for - call with constant 1 and constant 1', () => {
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

  test('evalNumber returns 1 for - call with constant 2 and constant 1', () => {
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

    expect(() => evalValue(call)).toThrow(Error);
  });

  test('evalNumber returns 2 for * call with constant 1 and constant 2', () => {
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

  test('evalNumber returns 6 for * call with constant 2 and constant 3', () => {
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

  test('evalNumber returns 6 for * call with constant 1, constant 2 and constant 3', () => {
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

    expect(() => evalValue(call)).toThrow(Error);
  });

  test('evalNumber returns 2 for / call with constant 4 and constant 2', () => {
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

  test('evalNumber returns 2 for / call with constant 6 and constant 3', () => {
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

    expect(() => evalValue(call)).toThrow(Error);
  });

  test('evalNumber throws error for / call with one argument', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: DIVIDE as typeof DIVIDE,
      arguments: [{ type: VALUE_CONST as typeof VALUE_CONST, value: 1 }]
    } as unknown as NumberType;

    expect(() => evalValue(call)).toThrow(Error);
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

    expect(() => evalValue(call)).toThrow(Error);
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

    expect(() => evalValue(call)).toThrow(Error);
  });

  test('evalNumber returns 1 for MIN call with constant 1 and constant 2', () => {
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

  test('evalNumber returns 1 for MIN call with constant 2 and constant 1', () => {
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

  test('evalNumber returns 5 for MIN call with constant 5', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: MIN as typeof MIN,
      arguments: [{ type: VALUE_CONST as typeof VALUE_CONST, value: 5 }]
    };

    expect(evalValue(call)).toBe(5);
  });

  test('evalNumber returns min value for MIN call with more than two arguments', () => {
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

    expect(() => evalValue(call)).toThrow(Error);
  });

  test('evalNumber returns 2 for MAX call with constant 1 and constant 2', () => {
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

  test('evalNumber returns 2 for MAX call with constant 2 and constant 1', () => {
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

  test('evalNumber returns 5 for MAX call with constant 5', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: MAX as typeof MAX,
      arguments: [{ type: VALUE_CONST as typeof VALUE_CONST, value: 5 }] as [
        NumberType
      ]
    };

    expect(evalValue(call)).toBe(5);
  });

  test('evalNumber returns max value for MAX call with more than two arguments', () => {
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

    expect(() => evalValue(call)).toThrow(Error);
  });

  test('evalNumber returns 1.5 for AVERAGE call with constant 1 and constant 2', () => {
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

  test('evalNumber returns 5 for AVERAGE call with constant 5', () => {
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

    expect(() => evalValue(call)).toThrow(Error);
  });

  test('evalNumber returns average value for AVERAGE call with more than two arguments', () => {
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

  test('evalNumber returns 0.5 for STDDEV call with constant 1 and constant 2', () => {
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

  test('evalNumber returns 0 for STDDEV call with constant 5', () => {
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

    expect(() => evalValue(call)).toThrow(Error);
  });

  test('evalNumber returns standard deviation value for STDDEV call with more than two arguments', () => {
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

  test('evalNumber returns 1 for FIRST call with constant 1', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: FIRST as typeof FIRST,
      arguments: [{ type: VALUE_CONST as typeof VALUE_CONST, value: 1 }]
    };

    expect(evalValue(call)).toBe(1);
  });

  test('evalNumber returns 1 for FIRST call with constant 1 and constant 2', () => {
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

  test('evalNumber returns first value for FIRST call with more than two arguments', () => {
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

    expect(() => evalValue(call)).toThrow(Error);
  });

  test('evalNumber returns 2 for LAST call with constant 1 and constant 2', () => {
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

  test('evalNumber returns 5 for LAST call with constant 5', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: LAST as typeof LAST,
      arguments: [{ type: VALUE_CONST as typeof VALUE_CONST, value: 5 }]
    };

    expect(evalValue(call)).toBe(5);
  });

  test('evalNumber returns last value for LAST call with more than two arguments', () => {
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

    expect(() => evalValue(call)).toThrow(Error);
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

  test('evalNumber calculates maximum between the stddev of {-1, -2, -3} and the sum of squares of three variables', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: MAX as typeof MAX,
      arguments: [
        {
          type: VALUE_CALL as typeof VALUE_CALL,
          name: STDDEV as typeof STDDEV,
          arguments: [
            {
              type: VALUE_CALL as typeof VALUE_CALL,
              name: NEGATE as typeof NEGATE,
              arguments: [{ type: VALUE_CONST as typeof VALUE_CONST, value: 1 }]
            },
            {
              type: VALUE_CALL as typeof VALUE_CALL,
              name: NEGATE as typeof NEGATE,
              arguments: [{ type: VALUE_CONST as typeof VALUE_CONST, value: 2 }]
            },
            {
              type: VALUE_CALL as typeof VALUE_CALL,
              name: NEGATE as typeof NEGATE,
              arguments: [{ type: VALUE_CONST as typeof VALUE_CONST, value: 3 }]
            }
          ]
        },
        {
          type: VALUE_CALL as typeof VALUE_CALL,
          name: PLUS as typeof PLUS,
          arguments: [
            {
              type: VALUE_CALL as typeof VALUE_CALL,
              name: MULTIPLY as typeof MULTIPLY,
              arguments: [
                { type: VALUE_VAR as typeof VALUE_VAR, name: 'var1' },
                { type: VALUE_VAR as typeof VALUE_VAR, name: 'var1' }
              ] as [NumberType, NumberType]
            },
            {
              type: VALUE_CALL as typeof VALUE_CALL,
              name: MULTIPLY as typeof MULTIPLY,
              arguments: [
                { type: VALUE_VAR as typeof VALUE_VAR, name: 'var2' },
                { type: VALUE_VAR as typeof VALUE_VAR, name: 'var2' }
              ] as [NumberType, NumberType]
            },
            {
              type: VALUE_CALL as typeof VALUE_CALL,
              name: MULTIPLY as typeof MULTIPLY,
              arguments: [
                { type: VALUE_VAR as typeof VALUE_VAR, name: 'var3' },
                { type: VALUE_VAR as typeof VALUE_VAR, name: 'var3' }
              ] as [NumberType, NumberType]
            }
          ] as [NumberType, NumberType, NumberType]
        }
      ] as [NumberType, NumberType]
    };

    expect(evalNumber(call, { var1: 5, var2: 8, var3: 3 })).toBe(98);
  });

  test('evalNumber throws error for / call with a divisor that evaluates to 0', () => {
    const call = {
      type: VALUE_CALL as typeof VALUE_CALL,
      name: DIVIDE as typeof DIVIDE,
      arguments: [
        {
          type: VALUE_CALL as typeof VALUE_CALL,
          name: MULTIPLY as typeof MULTIPLY,
          arguments: [
            { type: VALUE_CONST as typeof VALUE_CONST, value: 3 },
            { type: VALUE_CONST as typeof VALUE_CONST, value: 5 }
          ]
        },
        {
          type: VALUE_CALL as typeof VALUE_CALL,
          name: PLUS as typeof PLUS,
          arguments: [
            { type: VALUE_CONST as typeof VALUE_CONST, value: 8 },
            {
              type: VALUE_CALL as typeof VALUE_CALL,
              name: MULTIPLY as typeof MULTIPLY,
              arguments: [
                {
                  type: VALUE_CALL as typeof VALUE_CALL,
                  name: NEGATE as typeof NEGATE,
                  arguments: [
                    { type: VALUE_CONST as typeof VALUE_CONST, value: 1 }
                  ]
                },
                { type: VALUE_CONST as typeof VALUE_CONST, value: 8 }
              ] as [NumberType, NumberType]
            }
          ] as [NumberType, NumberType]
        }
      ] as [NumberType, NumberType]
    };

    expect(() => evalNumber(call)).toThrow(Error);
  });
});
