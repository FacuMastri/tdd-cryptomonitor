import * as interpreter from '../../interpreter/interpreter';
import {
  ActionBuyMarket,
  ActionSellMarket
} from '../../interpreter/types/action';
import { Context } from 'vm';
import { evalValue } from '../../interpreter/interpreter';
import { VALUE_WALLET, ValueWallet } from '../../interpreter/types/value';

function getCurrencyFromSymbol(symbol: string): string {
  return symbol.split('/')[0];
}

function evalSellMarketMock(
  action: ActionSellMarket,
  context: Context
): Context {
  const amount = evalValue(action.amount, context);
  if (typeof amount !== 'number') throw new Error('Amount must be a number');
  if (amount < 0) throw new Error('Cannot sell negative amount');

  const wallets = context.wallets as ValueWallet[];
  const currency = getCurrencyFromSymbol(action.symbol);

  const wallet = wallets.find((wallet) => wallet.symbol === currency);
  if (!wallet) throw new Error('No wallet for symbol: ' + currency);

  // @ts-ignore
  if (wallet.amount < amount) throw new Error('Not enough funds in wallet');

  // @ts-ignore
  wallet.amount -= amount;

  return context;
}

export const evalBuyMarketMock = (
  action: ActionBuyMarket,
  context: Context
): Context => {
  const amount = evalValue(action.amount, context);
  if (typeof amount !== 'number') throw new Error('Amount must be a number');
  if (amount < 0) throw new Error('Cannot buy negative amount');

  const wallets = context.wallets as ValueWallet[];
  const currency = getCurrencyFromSymbol(action.symbol);

  const wallet = wallets.find((wallet) => wallet.symbol === currency);

  if (!wallet) {
    wallets.push({
      type: VALUE_WALLET,
      symbol: currency,
      // @ts-ignore
      amount: amount
    });
  } else {
    // @ts-ignore
    wallet.amount += amount;
  }
  return context;
};

export function mockServices() {
  jest
    .spyOn(interpreter, 'evalSellMarket')
    .mockImplementation(evalSellMarketMock);
  jest
    .spyOn(interpreter, 'evalBuyMarket')
    .mockImplementation(evalBuyMarketMock);
}
