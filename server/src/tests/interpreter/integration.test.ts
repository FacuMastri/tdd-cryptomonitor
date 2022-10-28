import {
  evalAction,
  evalRules,
  evalValue
} from '../../interpreter/interpreter';
import {
  ValueCall,
  ValueVariable,
  ValueWallet
} from '../../interpreter/types/value';
import { ContextData, NUMBER_DATA } from '../../interpreter/types/number';
import { Context } from 'vm';
import { Rules } from '../../interpreter/types/rule';
import { BooleanCall } from '../../interpreter/types/boolean';
import { Action } from '../../interpreter/types/action';

describe('Si el precio BTC/USDT cae bajo un nivel determinado por una variable, vender todo el BTC disponible ', () => {
  const lastPrice: ValueCall = {
    type: 'CALL',
    name: 'LAST',
    arguments: {
      type: NUMBER_DATA,
      symbol: 'BTC/USDT',
      since: 3600,
      until: 0,
      default: {
        type: 'VARIABLE',
        name: 'LIMIT_VALUE_BTC/USDT'
      }
    }
  };
  const limitValue: ValueVariable = {
    type: 'VARIABLE',
    name: 'LIMIT_VALUE_BTC/USDT'
  };
  const condition: BooleanCall = {
    type: 'CALL',
    name: '<',
    arguments: [lastPrice, limitValue]
  };

  const action: Action = {
    type: 'SELL_MARKET',
    //symbol: 'BTC/USDT', // FIXME: this is the original, what is it supposed to mean?
    symbol: 'BTC',
    amount: {
      type: 'WALLET',
      symbol: 'BTC'
    }
  };

  const rules: Rules = {
    requiredVariables: ['LIMIT_VALUE_BTC/USDT'],
    rules: [
      {
        name: 'Escape',
        condition,
        // FIXME: doc uses `action` rather than `actions`, see if spec can change
        // as `actions` describes better what it is
        actions: [action]
      }
    ]
  };

  describe('should sell all btc', () => {
    let context: Context;

    beforeEach(() => {
      const data: ContextData = {
        'BTC/USDT': [
          {
            timestamp: Date.now() - 100,
            value: 800
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
        'LIMIT_VALUE_BTC/USDT': 1000,
        data,
        wallets
      };
    });

    test('values', () => {
      const lim = evalValue(limitValue, context);

      expect(lim).toBe(1000);

      const last = evalValue(lastPrice, context);
      expect(last).toBe(800);
    });

    test('condition', () => {
      const result = evalValue(condition, context);
      expect(result).toBe(true);
    });

    test('action', () => {
      evalAction(action, context);

      const wallet = context.wallets.find(
        (wallet: ValueWallet) => wallet.symbol === 'BTC'
      );

      expect(wallet.amount).toBe(0);
    });

    test('eval rules', () => {
      const wallet = context.wallets.find(
        (wallet: ValueWallet) => wallet.symbol === 'BTC'
      );

      expect(wallet.amount).toBe(2);
      evalRules(rules, context);
      expect(wallet.amount).toBe(0);
    });
  });
});
