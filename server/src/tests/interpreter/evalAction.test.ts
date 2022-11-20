import {
  Action,
  ACTION_BUY,
  ACTION_SELL,
  ACTION_SET,
  ActionBuyMarket,
  ActionSellMarket
} from '../../interpreter/types/action';
import { VALUE_CONST, ValueWallet } from '../../interpreter/types/value';
import { evalAction } from '../../interpreter/interpreter';
import { Context } from 'vm';

describe('evalAction', () => {
  test('evalAction sets variable value for SET_VARIABLE action', () => {
    const action: Action = {
      type: ACTION_SET,
      name: 'a',
      value: {
        type: VALUE_CONST,
        value: 123
      }
    };

    const context = { variables: { a: 0 } };

    evalAction(action, context);

    expect(context?.variables?.a).toBe(123);
  });

  test('evalAction sets variable value even if variable is not defined', () => {
    const action: Action = {
      type: ACTION_SET,
      name: 'b',
      value: {
        type: VALUE_CONST,
        value: 123
      }
    };

    const context = evalAction(action, { variables: { a: 0 } });

    expect(context?.variables?.b).toBe(123);
  });

  test('cant set reserved variable', () => {
    const action: Action = {
      type: ACTION_SET,
      name: 'data',
      value: {
        type: VALUE_CONST,
        value: 123
      }
    };

    expect(() => evalAction(action, {})).toThrow(Error);
  });

  test('evalAction buys stock for BUY_MARKET action', () => {
    const action: ActionBuyMarket = {
      type: ACTION_BUY,
      symbol: 'BTC',
      amount: { type: VALUE_CONST, value: 100 }
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
      amount: { type: VALUE_CONST, value: -100 }
    };

    expect(() => evalAction(action, {})).toThrow(Error);
  });

  test('evalAction sells stock for SELL_MARKET action', () => {
    const action: ActionSellMarket = {
      type: ACTION_SELL,
      symbol: 'BTC',
      amount: { type: VALUE_CONST, value: 100 }
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
      amount: { type: VALUE_CONST, value: -100 }
    };

    const btcWallet: ValueWallet = {
      type: 'WALLET',
      symbol: 'BTC',
      amount: 1000
    };
    const context: Context = {
      wallets: [btcWallet]
    };

    expect(() => evalAction(action, context)).toThrow(Error);
  });

  test('evalAction throws error for SELL_MARKET action with amount greater than owned', () => {
    const action: ActionSellMarket = {
      type: ACTION_SELL,
      symbol: 'BTC',
      amount: { type: VALUE_CONST, value: 1000 }
    };

    const btcWallet: ValueWallet = {
      type: 'WALLET',
      symbol: 'BTC',
      amount: 100
    };
    const context: Context = {
      wallets: [btcWallet]
    };

    expect(() => evalAction(action, context)).toThrow(Error);
  });

  test('evalAction throws error for SELL_MARKET action with no stock owned', () => {
    const action: ActionSellMarket = {
      type: ACTION_SELL,
      symbol: 'BTC',
      amount: { type: VALUE_CONST, value: 1 }
    };

    const btcWallet: ValueWallet = {
      type: 'WALLET',
      symbol: 'BTC',
      amount: 0
    };
    const context: Context = {
      wallets: [btcWallet]
    };

    expect(() => evalAction(action, context)).toThrow(Error);
  });

  test('evalAction throws error for SELL_MARKET action with unknown coin', () => {
    const action: ActionSellMarket = {
      type: ACTION_SELL,
      symbol: 'BTC',
      amount: { type: VALUE_CONST, value: 1000 }
    };

    const context: Context = {
      wallets: []
    };

    expect(() => evalAction(action, context)).toThrow(Error);
  });

  test('evalAction throws error for unknown action', () => {
    const action = {
      type: 'DO THE THING',
      symbol: 'BTC',
      amount: { type: VALUE_CONST, value: 1 }
    } as unknown as Action;

    expect(() => evalAction(action, {})).toThrow(Error);
  });
});
