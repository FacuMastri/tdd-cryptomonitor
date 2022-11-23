import {
  evalAction,
  evalRules,
  evalValue
} from '../../../interpreter/interpreter';
import { ValueWallet } from '../../../interpreter/types/value';
import { NumberConstant } from '../../../interpreter/types/number';
import { Context } from 'vm';
import { Rules } from '../../../interpreter/types/rule';
import { BooleanConstant } from '../../../interpreter/types/boolean';
import { Action } from '../../../interpreter/types/action';

// TODO: this now uses external services
describe.skip('Comprar 12 TDD/USDT siempre', () => {
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

    test('eval rules two times', () => {
      const wallet = context.wallets.find(
        (wallet: ValueWallet) => wallet.symbol === 'TDD/USDT'
      );

      expect(wallet.amount).toBe(2);
      evalRules(rules, context);
      evalRules(rules, context);
      expect(wallet.amount).toBe(26);
    });
  });
});
