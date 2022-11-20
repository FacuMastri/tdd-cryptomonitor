import { BooleanType } from '../../interpreter/types/boolean';
import { VALUE_CALL, VALUE_CONST } from '../../interpreter/types/value';
import { Action, ACTION_SET } from '../../interpreter/types/action';
import { Rule, Rules } from '../../interpreter/types/rule';
import {
  evalRule,
  evalRules,
  evalValue,
  loadDatum
} from '../../interpreter/interpreter';
import { Context } from 'vm';
import {
  ContextDatum,
  NUMBER_DATA,
  NumberCallMany,
  NumberData
} from '../../interpreter/types/number';
import { PLUS } from '../../interpreter/types/calls';

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
        type: VALUE_CONST,
        value: 123
      }
    };

    const rule: Rule = {
      name: 'test',
      condition,
      actions: [action]
    };

    const context = { variables: { a: 0 } };

    evalRule(rule, context);

    expect(context.variables.a).toBe(123);
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
        type: VALUE_CONST,
        value: 123
      }
    };

    const rule: Rule = {
      name: 'test',
      condition,
      actions: [action]
    };

    const context = { variables: { a: 0 } };

    evalRule(rule, context);

    expect(context.variables.a).toBe(0);
  });

  test('evalRule executes two actions with condition being true', () => {
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

  test('evalRules throws error if required variables are not set', () => {
    const rules: Rules = {
      requiredVariables: ['a'],
      rules: []
    };

    expect(() => evalRules(rules, {})).toThrow(Error);
  });
});

describe('data', () => {
  test('loaded datum is accessible', () => {
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
      since: 5, // 5sec ago
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
      since: 5, // 5sec ago
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
