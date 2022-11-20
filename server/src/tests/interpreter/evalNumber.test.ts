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
import {
  NumberCall,
  NumberConstant,
  NumberType
} from '../../interpreter/types/number';

describe('evalNumber', () => {
  test('evalNumber returns 1 for constant 1', () => {
    const number: NumberConstant = { type: VALUE_CONST, value: 1 };

    expect(evalValue(number)).toBe(1);
  });

  test('evalNumber returns 2 for constant 2', () => {
    const number: NumberConstant = { type: VALUE_CONST, value: 2 };

    expect(evalValue(number)).toBe(2);
  });

  test('evalNumber returns -1 for NEGATE call with constant 1', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: NEGATE,
      arguments: [{ type: VALUE_CONST, value: 1 }]
    };

    expect(evalValue(call)).toBe(-1);
  });

  test('evalNumber returns -2 for NEGATE call with constant 2', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: NEGATE,
      arguments: [{ type: VALUE_CONST, value: 2 }]
    };

    expect(evalValue(call)).toBe(-2);
  });

  test('evalNumber returns 1 for NEGATE call with constant -1', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: NEGATE,
      arguments: [
        {
          type: VALUE_CONST,
          value: -1
        }
      ]
    };

    expect(evalValue(call)).toBe(1);
  });

  test('evalNumber throws error for NEGATE call with two or more constants', () => {
    const call = {
      type: VALUE_CALL,
      name: NEGATE,
      arguments: [
        { type: VALUE_CONST, value: 1 },
        { type: VALUE_CONST, value: 1 }
      ]
    } as unknown as NumberType;

    expect(() => evalValue(call)).toThrow(Error);
  });

  test('evalNumber returns 2 for + call with constant 1 and constant 1', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: PLUS,
      arguments: [
        { type: VALUE_CONST, value: 1 },
        { type: VALUE_CONST, value: 1 }
      ]
    };

    expect(evalValue(call)).toBe(2);
  });

  test('evalNumber returns 3 for + call with constant 1 and constant 2', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: PLUS,
      arguments: [
        { type: VALUE_CONST, value: 1 },
        { type: VALUE_CONST, value: 2 }
      ]
    };

    expect(evalValue(call)).toBe(3);
  });

  test('evalNumber returns 6 for + call with constant 1, constant 2 and constant 3', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: PLUS,
      arguments: [
        { type: VALUE_CONST, value: 1 },
        { type: VALUE_CONST, value: 2 },
        { type: VALUE_CONST, value: 3 }
      ]
    };

    expect(evalValue(call)).toBe(6);
  });

  test('evalNumber throws error for + call with zero arguments', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: PLUS,
      arguments: []
    };

    expect(() => evalValue(call)).toThrow(Error);
  });

  test('evalNumber returns 0 for - call with constant 1 and constant 1', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: MINUS,
      arguments: [
        { type: VALUE_CONST, value: 1 },
        { type: VALUE_CONST, value: 1 }
      ] as [NumberType, NumberType]
    };

    expect(evalValue(call)).toBe(0);
  });

  test('evalNumber returns 1 for - call with constant 2 and constant 1', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: MINUS,
      arguments: [
        { type: VALUE_CONST, value: 2 },
        { type: VALUE_CONST, value: 1 }
      ] as [NumberType, NumberType]
    };

    expect(evalValue(call)).toBe(1);
  });

  test('evalNumber throws error for - call with other than two arguments', () => {
    const call = {
      type: VALUE_CALL,
      name: MINUS,
      arguments: [
        { type: VALUE_CONST, value: 1 },
        { type: VALUE_CONST, value: 1 },
        { type: VALUE_CONST, value: 1 }
      ] as [NumberType, NumberType, NumberType]
    } as unknown as NumberType;

    expect(() => evalValue(call)).toThrow(Error);
  });

  test('evalNumber returns 2 for * call with constant 1 and constant 2', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: MULTIPLY,
      arguments: [
        { type: VALUE_CONST, value: 1 },
        { type: VALUE_CONST, value: 2 }
      ]
    };

    expect(evalValue(call)).toBe(2);
  });

  test('evalNumber returns 6 for * call with constant 2 and constant 3', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: MULTIPLY,
      arguments: [
        { type: VALUE_CONST, value: 2 },
        { type: VALUE_CONST, value: 3 }
      ]
    };

    expect(evalValue(call)).toBe(6);
  });

  test('evalNumber returns 6 for * call with constant 1, constant 2 and constant 3', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: MULTIPLY,
      arguments: [
        { type: VALUE_CONST, value: 1 },
        { type: VALUE_CONST, value: 2 },
        { type: VALUE_CONST, value: 3 }
      ]
    };

    expect(evalValue(call)).toBe(6);
  });

  test('evalNumber throws error for * call with no arguments', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: MULTIPLY,
      arguments: []
    };

    expect(() => evalValue(call)).toThrow(Error);
  });

  test('evalNumber returns 2 for / call with constant 4 and constant 2', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: DIVIDE,
      arguments: [
        { type: VALUE_CONST, value: 4 },
        { type: VALUE_CONST, value: 2 }
      ] as [NumberType, NumberType]
    };

    expect(evalValue(call)).toBe(2);
  });

  test('evalNumber returns 2 for / call with constant 6 and constant 3', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: DIVIDE,
      arguments: [
        { type: VALUE_CONST, value: 6 },
        { type: VALUE_CONST, value: 3 }
      ] as [NumberType, NumberType]
    };

    expect(evalValue(call)).toBe(2);
  });

  test('evalNumber throws error for / call with zero arguments', () => {
    const call = {
      type: VALUE_CALL,
      name: DIVIDE,
      arguments: []
    } as unknown as NumberType;

    expect(() => evalValue(call)).toThrow(Error);
  });

  test('evalNumber throws error for / call with one argument', () => {
    const call = {
      type: VALUE_CALL,
      name: DIVIDE,
      arguments: [{ type: VALUE_CONST, value: 1 }]
    } as unknown as NumberType;

    expect(() => evalValue(call)).toThrow(Error);
  });

  test('evalNumber throws error for / call with more than two arguments', () => {
    const call = {
      type: VALUE_CALL,
      name: DIVIDE,
      arguments: [
        { type: VALUE_CONST, value: 1 },
        { type: VALUE_CONST, value: 1 },
        { type: VALUE_CONST, value: 1 }
      ]
    } as unknown as NumberType;

    expect(() => evalValue(call)).toThrow(Error);
  });

  test('evalNumber throws error for / call that divides by zero', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: DIVIDE,
      arguments: [
        { type: VALUE_CONST, value: 1 },
        { type: VALUE_CONST, value: 0 }
      ]
    };

    expect(() => evalValue(call)).toThrow(Error);
  });

  test('evalNumber returns 1 for MIN call with constant 1 and constant 2', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: MIN,
      arguments: [
        { type: VALUE_CONST, value: 1 },
        { type: VALUE_CONST, value: 2 }
      ]
    };

    expect(evalValue(call)).toBe(1);
  });

  test('evalNumber returns 1 for MIN call with constant 2 and constant 1', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: MIN,
      arguments: [
        { type: VALUE_CONST, value: 2 },
        { type: VALUE_CONST, value: 1 }
      ] as [NumberType, NumberType]
    };

    expect(evalValue(call)).toBe(1);
  });

  test('evalNumber returns 5 for MIN call with constant 5', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: MIN,
      arguments: [{ type: VALUE_CONST, value: 5 }]
    };

    expect(evalValue(call)).toBe(5);
  });

  test('evalNumber returns min value for MIN call with more than two arguments', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: MIN,
      arguments: [
        { type: VALUE_CONST, value: 5 },
        { type: VALUE_CONST, value: 2 },
        { type: VALUE_CONST, value: 3 }
      ] as [NumberType, NumberType, NumberType]
    };

    expect(evalValue(call)).toBe(2);
  });

  test('evalNumber throws error for MIN call with no arguments', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: MIN,
      arguments: []
    };

    expect(() => evalValue(call)).toThrow(Error);
  });

  test('evalNumber returns 2 for MAX call with constant 1 and constant 2', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: MAX,
      arguments: [
        { type: VALUE_CONST, value: 1 },
        { type: VALUE_CONST, value: 2 }
      ] as [NumberType, NumberType]
    };

    expect(evalValue(call)).toBe(2);
  });

  test('evalNumber returns 2 for MAX call with constant 2 and constant 1', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: MAX,
      arguments: [
        { type: VALUE_CONST, value: 2 },
        { type: VALUE_CONST, value: 1 }
      ] as [NumberType, NumberType]
    };

    expect(evalValue(call)).toBe(2);
  });

  test('evalNumber returns 5 for MAX call with constant 5', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: MAX,
      arguments: [{ type: VALUE_CONST, value: 5 }] as [NumberType]
    };

    expect(evalValue(call)).toBe(5);
  });

  test('evalNumber returns max value for MAX call with more than two arguments', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: MAX,
      arguments: [
        { type: VALUE_CONST, value: 5 },
        { type: VALUE_CONST, value: 2 },
        { type: VALUE_CONST, value: 3 }
      ]
    };

    expect(evalValue(call)).toBe(5);
  });

  test('evalNumber throws error for MAX call with no arguments', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: MAX,
      arguments: []
    };

    expect(() => evalValue(call)).toThrow(Error);
  });

  test('evalNumber returns 1.5 for AVERAGE call with constant 1 and constant 2', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: AVERAGE,
      arguments: [
        { type: VALUE_CONST, value: 1 },
        { type: VALUE_CONST, value: 2 }
      ]
    };

    expect(evalValue(call)).toBeCloseTo(1.5);
  });

  test('evalNumber returns 5 for AVERAGE call with constant 5', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: AVERAGE,
      arguments: [{ type: VALUE_CONST, value: 5 }]
    };

    expect(evalValue(call)).toBe(5);
  });

  test('evalNumber throws error for AVERAGE call with no arguments', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: AVERAGE,
      arguments: []
    };

    expect(() => evalValue(call)).toThrow(Error);
  });

  test('evalNumber returns average value for AVERAGE call with more than two arguments', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: AVERAGE,
      arguments: [
        { type: VALUE_CONST, value: 5 },
        { type: VALUE_CONST, value: 2 },
        { type: VALUE_CONST, value: 3 }
      ]
    };

    expect(evalValue(call)).toBeCloseTo(3.3333333333333335);
  });

  test('evalNumber returns 0.5 for STDDEV call with constant 1 and constant 2', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: STDDEV,
      arguments: [
        { type: VALUE_CONST, value: 1 },
        { type: VALUE_CONST, value: 2 }
      ]
    };

    expect(evalValue(call)).toBeCloseTo(0.5);
  });

  test('evalNumber returns 0 for STDDEV call with constant 5', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: STDDEV,
      arguments: [{ type: VALUE_CONST, value: 5 }]
    };

    expect(evalValue(call)).toBe(0);
  });

  test('evalNumber throws error for STDDEV call with no arguments', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: STDDEV,
      arguments: []
    };

    expect(() => evalValue(call)).toThrow(Error);
  });

  test('evalNumber returns standard deviation value for STDDEV call with more than two arguments', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: STDDEV,
      arguments: [
        { type: VALUE_CONST, value: 5 },
        { type: VALUE_CONST, value: 2 },
        { type: VALUE_CONST, value: 3 }
      ]
    };

    expect(evalValue(call)).toBeCloseTo(1.247219128924647);
  });

  test('evalNumber returns 1 for FIRST call with constant 1', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: FIRST,
      arguments: [{ type: VALUE_CONST, value: 1 }]
    };

    expect(evalValue(call)).toBe(1);
  });

  test('evalNumber returns 1 for FIRST call with constant 1 and constant 2', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: FIRST,
      arguments: [
        { type: VALUE_CONST, value: 1 },
        { type: VALUE_CONST, value: 2 }
      ]
    };

    expect(evalValue(call)).toBe(1);
  });

  test('evalNumber returns first value for FIRST call with more than two arguments', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: FIRST,
      arguments: [
        { type: VALUE_CONST, value: 5 },
        { type: VALUE_CONST, value: 2 },
        { type: VALUE_CONST, value: 3 }
      ]
    };

    expect(evalValue(call)).toBe(5);
  });

  test('evalNumber throws error for FIRST call with no arguments', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: FIRST,
      arguments: []
    };

    expect(() => evalValue(call)).toThrow(Error);
  });

  test('evalNumber returns 2 for LAST call with constant 1 and constant 2', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: LAST,
      arguments: [
        { type: VALUE_CONST, value: 1 },
        { type: VALUE_CONST, value: 2 }
      ]
    };

    expect(evalValue(call)).toBe(2);
  });

  test('evalNumber returns 5 for LAST call with constant 5', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: LAST,
      arguments: [{ type: VALUE_CONST, value: 5 }]
    };

    expect(evalValue(call)).toBe(5);
  });

  test('evalNumber returns last value for LAST call with more than two arguments', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: LAST,
      arguments: [
        { type: VALUE_CONST, value: 5 },
        { type: VALUE_CONST, value: 2 },
        { type: VALUE_CONST, value: 3 }
      ]
    };

    expect(evalValue(call)).toBe(3);
  });

  test('evalNumber throws error for LAST call with no arguments', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: LAST,
      arguments: []
    };

    expect(() => evalValue(call)).toThrow(Error);
  });

  /*
  test('evalNumber with CALL of N arguments works with default DATA', () => {
    const call: NumberCall = {
      type: VALUE_CALL ,
      name: PLUS ,
      arguments: {
        type: typeof NUMBER_DATA,
        symbol: 'BTC/USDT',
        since: 3600,
        until: 0,
        default: [
          {
            type: VALUE_CONST ,
            value: 1500
          },
          {
            type: VALUE_CONST ,
            value: 3000
          }
        ]
      }
    };

    expect(evalValue(call)).toBe(4500);
  });
  */

  test('evalNumber calculates maximum between the stddev of {-1, -2, -3} and the sum of squares of three variables', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: MAX,
      arguments: [
        {
          type: VALUE_CALL,
          name: STDDEV,
          arguments: [
            {
              type: VALUE_CALL,
              name: NEGATE,
              arguments: [{ type: VALUE_CONST, value: 1 }]
            },
            {
              type: VALUE_CALL,
              name: NEGATE,
              arguments: [{ type: VALUE_CONST, value: 2 }]
            },
            {
              type: VALUE_CALL,
              name: NEGATE,
              arguments: [{ type: VALUE_CONST, value: 3 }]
            }
          ]
        },
        {
          type: VALUE_CALL,
          name: PLUS,
          arguments: [
            {
              type: VALUE_CALL,
              name: MULTIPLY,
              arguments: [
                { type: VALUE_VAR, name: 'var1' },
                { type: VALUE_VAR, name: 'var1' }
              ]
            },
            {
              type: VALUE_CALL,
              name: MULTIPLY,
              arguments: [
                { type: VALUE_VAR, name: 'var2' },
                { type: VALUE_VAR, name: 'var2' }
              ]
            },
            {
              type: VALUE_CALL,
              name: MULTIPLY,
              arguments: [
                { type: VALUE_VAR, name: 'var3' },
                { type: VALUE_VAR, name: 'var3' }
              ]
            }
          ]
        }
      ]
    };

    expect(evalNumber(call, { variables: { var1: 5, var2: 8, var3: 3 } })).toBe(
      98
    );
  });

  test('evalNumber throws error for / call with a divisor that evaluates to 0', () => {
    const call: NumberCall = {
      type: VALUE_CALL,
      name: DIVIDE,
      arguments: [
        {
          type: VALUE_CALL,
          name: MULTIPLY,
          arguments: [
            { type: VALUE_CONST, value: 3 },
            { type: VALUE_CONST, value: 5 }
          ]
        },
        {
          type: VALUE_CALL,
          name: PLUS,
          arguments: [
            { type: VALUE_CONST, value: 8 },
            {
              type: VALUE_CALL,
              name: MULTIPLY,
              arguments: [
                {
                  type: VALUE_CALL,
                  name: NEGATE,
                  arguments: [{ type: VALUE_CONST, value: 1 }]
                },
                { type: VALUE_CONST, value: 8 }
              ]
            }
          ]
        }
      ]
    };

    expect(() => evalNumber(call)).toThrow(Error);
  });
});
