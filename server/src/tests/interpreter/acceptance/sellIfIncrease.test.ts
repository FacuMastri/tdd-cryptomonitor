import {
  evalAction,
  evalRules,
  evalValue
} from '../../../interpreter/interpreter';
import {
  ValueCall,
  ValueVariable,
  ValueWallet
} from '../../../interpreter/types/value';
import { ContextData, NumberCall } from '../../../interpreter/types/number';
import { Context } from 'vm';
import { Rules } from '../../../interpreter/types/rule';
import { BooleanCall } from '../../../interpreter/types/boolean';
import {
  ActionSellMarket,
  ActionSetVariable
} from '../../../interpreter/types/action';
import { mockServices } from '../mocks';

describe('Si el precio de BTC/USDT aumenta más de 15% del valor de la última venta, vender 0.1 BTC', () => {
  mockServices();

  const lastSell: ValueVariable = {
    type: 'VARIABLE',
    name: 'LAST_SELL_VALUE_BTC/USDT'
  };
  const thresholdLastSell: ValueCall = {
    type: 'CALL',
    name: '*',
    arguments: [
      {
        type: 'CONSTANT',
        value: 1.15
      },
      lastSell
    ]
  };
  const lastPrice: NumberCall = {
    type: 'CALL',
    name: 'LAST',
    arguments: {
      type: 'DATA',
      symbol: 'BTC/USDT',
      since: 3600,
      until: 0
    }
  };
  const condition: BooleanCall = {
    type: 'CALL',
    name: '>',
    arguments: [lastPrice, thresholdLastSell]
  };

  const actionSell: ActionSellMarket = {
    type: 'SELL_MARKET',
    symbol: 'BTC/USDT',
    amount: {
      type: 'CONSTANT',
      value: 0.1
    }
  };

  const actionSet: ActionSetVariable = {
    type: 'SET_VARIABLE',
    name: 'LAST_SELL_VALUE_BTC/USDT',
    value: lastPrice
  };

  const rules: Rules = {
    requiredVariables: ['LAST_SELL_VALUE_BTC/USDT'],
    rules: [
      {
        name: 'Vender si sube 15%',
        condition,
        actions: [actionSell, actionSet]
      }
    ]
  };

  describe('should sell 0.1 BTC, starting from 100 to 120', () => {
    let context: Context;

    beforeEach(() => {
      const data: ContextData = {
        'BTC/USDT': [
          {
            timestamp: Date.now() - 100,
            value: 120 // aumentó 20% (ver abajo)
          }
        ]
      };
      const wallets: ValueWallet[] = [
        {
          type: 'WALLET',
          symbol: 'BTC',
          amount: 2
        }
      ];
      context = {
        variables: {
          'LAST_SELL_VALUE_BTC/USDT': 100
        },
        data,
        wallets
      };
    });

    test('Threshold value should be 115 and last value should be 120', () => {
      const lim = evalValue(thresholdLastSell, context);
      expect(lim).toBeCloseTo(115);

      const last = evalValue(lastPrice, context);
      expect(last).toBeCloseTo(120);
    });

    test('Condition should be true', () => {
      const result = evalValue(condition, context);
      expect(result).toBe(true);
    });

    test('Wallet amount should be 1.9 and last sell value should be 120', () => {
      evalAction(actionSell, context);
      const wallet = context.wallets.find(
        (wallet: ValueWallet) => wallet.symbol === 'BTC'
      );
      expect(wallet.amount).toBeCloseTo(1.9);

      evalAction(actionSet, context);
      expect(context.variables['LAST_SELL_VALUE_BTC/USDT']).toBe(120);
    });

    test('Should sell 0.1, wallet amount should be 1.9 and last sell value should be 120', () => {
      const wallet = context.wallets.find(
        (wallet: ValueWallet) => wallet.symbol === 'BTC'
      );

      expect(wallet.amount).toBe(2);
      expect(context.variables['LAST_SELL_VALUE_BTC/USDT']).toBe(100);
      evalRules(rules, context);
      expect(wallet.amount).toBeCloseTo(1.9);
      expect(context.variables['LAST_SELL_VALUE_BTC/USDT']).toBe(120);
    });

    test('After selling 0.1 the first time, evalRules should not change wallet amount nor last sell value', () => {
      const wallet = context.wallets.find(
        (wallet: ValueWallet) => wallet.symbol === 'BTC'
      );

      expect(wallet.amount).toBe(2);
      expect(context.variables['LAST_SELL_VALUE_BTC/USDT']).toBe(100);
      evalRules(rules, context);
      expect(wallet.amount).toBeCloseTo(1.9);
      expect(context.variables['LAST_SELL_VALUE_BTC/USDT']).toBe(120);
      // the value doesn't change the second time so no sell
      evalRules(rules, context);
      expect(wallet.amount).toBeCloseTo(1.9);
      expect(context.variables['LAST_SELL_VALUE_BTC/USDT']).toBe(120);
    });
  });

  describe('Should not sell 0.1 BTC as last value does not get higher enough', () => {
    let context: Context;

    beforeEach(() => {
      const data: ContextData = {
        'BTC/USDT': [
          {
            timestamp: Date.now() - 100,
            value: 110 // aumentó 10% (ver abajo)
          }
        ]
      };
      const wallets: ValueWallet[] = [
        {
          type: 'WALLET',
          symbol: 'BTC',
          amount: 2
        }
      ];
      context = {
        variables: {
          'LAST_SELL_VALUE_BTC/USDT': 100
        },
        data,
        wallets
      };
    });

    test('Threshold value should be 115 and last value should be 110', () => {
      const lim = evalValue(thresholdLastSell, context);
      expect(lim).toBeCloseTo(115);

      const last = evalValue(lastPrice, context);
      expect(last).toBeCloseTo(110);
    });

    test('Condition should be false', () => {
      const result = evalValue(condition, context);
      expect(result).toBe(false);
    });

    test('Should not sell 0.1, wallet amount should be 2 and last sell value should be 100', () => {
      const wallet = context.wallets.find(
        (wallet: ValueWallet) => wallet.symbol === 'BTC'
      );

      expect(wallet.amount).toBe(2);
      expect(context.variables['LAST_SELL_VALUE_BTC/USDT']).toBe(100);
      evalRules(rules, context);
      expect(wallet.amount).toBeCloseTo(2);
      // Since we did not sell (the condition was not met), the last sell value is not updated
      expect(context.variables['LAST_SELL_VALUE_BTC/USDT']).toBe(100);
    });
  });

  describe('should not sell 0.1 BTC, goes down more than 15%', () => {
    let context: Context;

    beforeEach(() => {
      const data: ContextData = {
        'BTC/USDT': [
          {
            timestamp: Date.now() - 100,
            value: 80 // aumentó 10% (ver abajo)
          }
        ]
      };
      const wallets: ValueWallet[] = [
        {
          type: 'WALLET',
          symbol: 'BTC',
          amount: 2
        }
      ];
      context = {
        variables: {
          'LAST_SELL_VALUE_BTC/USDT': 100
        },
        data,
        wallets
      };
    });

    test('Threshold value should be 115 and last value should be 80', () => {
      const lim = evalValue(thresholdLastSell, context);
      expect(lim).toBeCloseTo(115);

      const last = evalValue(lastPrice, context);
      expect(last).toBeCloseTo(80);
    });

    test('Condition should be false', () => {
      const result = evalValue(condition, context);
      expect(result).toBe(false);
    });

    test('Action should update last sell value to 80', () => {
      evalAction(actionSet, context);
      expect(context.variables['LAST_SELL_VALUE_BTC/USDT']).toBe(80);
    });

    test('Should not sell 0.1, wallet amount should be 2 and last sell value should be 100', () => {
      const wallet = context.wallets.find(
        (wallet: ValueWallet) => wallet.symbol === 'BTC'
      );

      expect(wallet.amount).toBe(2);
      expect(context.variables['LAST_SELL_VALUE_BTC/USDT']).toBe(100);
      evalRules(rules, context);
      expect(wallet.amount).toBeCloseTo(2);
      expect(context.variables['LAST_SELL_VALUE_BTC/USDT']).toBe(100);
    });
  });
});
