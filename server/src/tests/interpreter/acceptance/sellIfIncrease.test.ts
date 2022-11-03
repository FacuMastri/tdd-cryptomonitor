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

describe('Si el precio de BTC/USDT aumenta más de 15% del valor de la última venta, vender 0.1 BTC', () => {
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

  describe('should sell 0.1 BTC', () => {
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
          symbol: 'BTC/USDT',
          amount: 2
        }
      ];
      context = {
        'LAST_SELL_VALUE_BTC/USDT': 100,
        data,
        wallets
      };
    });

    test('values', () => {
      const lim = evalValue(thresholdLastSell, context);
      expect(lim).toBeCloseTo(115);

      const last = evalValue(lastPrice, context);
      expect(last).toBeCloseTo(120);
    });

    test('condition', () => {
      const result = evalValue(condition, context);
      expect(result).toBe(true);
    });

    test('action', () => {
      evalAction(actionSell, context);
      const wallet = context.wallets.find(
        (wallet: ValueWallet) => wallet.symbol === 'BTC/USDT'
      );
      expect(wallet.amount).toBeCloseTo(1.9);

      evalAction(actionSet, context);
      expect(context['LAST_SELL_VALUE_BTC/USDT']).toBe(120);
    });

    test('eval rules', () => {
      const wallet = context.wallets.find(
        (wallet: ValueWallet) => wallet.symbol === 'BTC/USDT'
      );

      expect(wallet.amount).toBe(2);
      expect(context['LAST_SELL_VALUE_BTC/USDT']).toBe(100);
      evalRules(rules, context);
      expect(wallet.amount).toBeCloseTo(1.9);
      expect(context['LAST_SELL_VALUE_BTC/USDT']).toBe(120);
    });

    test('eval rules two times', () => {
      const wallet = context.wallets.find(
        (wallet: ValueWallet) => wallet.symbol === 'BTC/USDT'
      );

      expect(wallet.amount).toBe(2);
      expect(context['LAST_SELL_VALUE_BTC/USDT']).toBe(100);
      evalRules(rules, context);
      expect(wallet.amount).toBeCloseTo(1.9);
      expect(context['LAST_SELL_VALUE_BTC/USDT']).toBe(120);
      //the value doesnt change the second time so no sell
      evalRules(rules, context);
      expect(wallet.amount).toBeCloseTo(1.9);
      expect(context['LAST_SELL_VALUE_BTC/USDT']).toBe(120);
    });
  });

  describe('shouldnt sell 0.1 BTC, doesnt go up enough', () => {
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
          symbol: 'BTC/USDT',
          amount: 2
        }
      ];
      context = {
        'LAST_SELL_VALUE_BTC/USDT': 100,
        data,
        wallets
      };
    });

    test('values', () => {
      const lim = evalValue(thresholdLastSell, context);
      expect(lim).toBeCloseTo(115);

      const last = evalValue(lastPrice, context);
      expect(last).toBeCloseTo(110);
    });

    test('condition', () => {
      const result = evalValue(condition, context);
      expect(result).toBe(false);
    });

    test('action', () => {
      evalAction(actionSet, context);
      expect(context['LAST_SELL_VALUE_BTC/USDT']).toBe(110);
    });

    test('eval rules', () => {
      const wallet = context.wallets.find(
        (wallet: ValueWallet) => wallet.symbol === 'BTC/USDT'
      );

      expect(wallet.amount).toBe(2);
      expect(context['LAST_SELL_VALUE_BTC/USDT']).toBe(100);
      evalRules(rules, context);
      expect(wallet.amount).toBeCloseTo(2);
      // Since we did not sell (the condition was not met), the last sell value is not updated
      expect(context['LAST_SELL_VALUE_BTC/USDT']).toBe(100);
    });
  });

  describe('shouldnt sell 0.1 BTC, goes down more than 15%', () => {
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
          symbol: 'BTC/USDT',
          amount: 2
        }
      ];
      context = {
        'LAST_SELL_VALUE_BTC/USDT': 100,
        data,
        wallets
      };
    });

    test('values', () => {
      const lim = evalValue(thresholdLastSell, context);
      expect(lim).toBeCloseTo(115);

      const last = evalValue(lastPrice, context);
      expect(last).toBeCloseTo(80);
    });

    test('condition', () => {
      const result = evalValue(condition, context);
      expect(result).toBe(false);
    });

    test('action', () => {
      evalAction(actionSet, context);
      expect(context['LAST_SELL_VALUE_BTC/USDT']).toBe(80);
    });

    test('eval rules', () => {
      const wallet = context.wallets.find(
        (wallet: ValueWallet) => wallet.symbol === 'BTC/USDT'
      );

      expect(wallet.amount).toBe(2);
      expect(context['LAST_SELL_VALUE_BTC/USDT']).toBe(100);
      evalRules(rules, context);
      expect(wallet.amount).toBeCloseTo(2);
    });
  });
});
