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
import {
  ContextData,
  NumberCall,
  NumberConstant,
  NUMBER_DATA
} from '../../interpreter/types/number';
import { Context } from 'vm';
import { Rules } from '../../interpreter/types/rule';
import { BooleanCall, BooleanConstant } from '../../interpreter/types/boolean';
import {
  Action,
  ActionSellMarket,
  ActionSetVariable
} from '../../interpreter/types/action';

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

describe('Comprar 12 TDD/USDT siempre', () => {
  const amount: NumberConstant = {
    type: 'CONSTANT',
    value: 12
  };
  const condition: BooleanConstant = {
    type: 'CONSTANT',
    value: true
  };
  const action: Action = {
    type: 'BUY_MARKET',
    symbol: 'TDD/USDT',
    amount: amount
  };

  const rules: Rules = {
    requiredVariables: [],
    rules: [
      {
        name: 'Comprar 12 TDD/USDT siempre"',
        condition,
        actions: [action]
      }
    ]
  };

  describe('should buy 12 usdt', () => {
    let context: Context;

    beforeEach(() => {
      const wallets: ValueWallet[] = [
        {
          type: 'WALLET',
          symbol: 'TDD/USDT',
          amount: 2
        },
        {
          type: 'WALLET',
          symbol: 'TDD/BTC',
          amount: 100
        }
      ];
      context = {
        wallets
      };
    });

    test('values', () => {
      const amount_result = evalValue(amount, context);
      expect(amount_result).toBe(12);
    });

    test('condition', () => {
      const cond_result = evalValue(condition, context);
      expect(cond_result).toBe(true);
    });

    test('action', () => {
      evalAction(action, context);

      const wallet = context.wallets.find(
        (wallet: ValueWallet) => wallet.symbol === 'TDD/USDT'
      );

      expect(wallet.amount).toBe(2 /* inicial */ + 12 /* comprado */);
    });

    test('eval rules', () => {
      const wallet = context.wallets.find(
        (wallet: ValueWallet) => wallet.symbol === 'TDD/USDT'
      );

      expect(wallet.amount).toBe(2);
      evalRules(rules, context);
      expect(wallet.amount).toBe(14);
    });
  });
});

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
  });
});
