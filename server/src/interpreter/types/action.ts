import { Value } from './value';

export const ACTION_BUY = 'BUY_MARKET';
export interface ActionBuyMarket {
  type: typeof ACTION_BUY;
  symbol: string;
  amount: Value;
}

export const ACTION_SELL = 'SELL_MARKET';
export interface ActionSellMarket {
  type: typeof ACTION_SELL;
  symbol: string;
  amount: Value;
}

export const ACTION_SET = 'SET_VARIABLE';
export interface ActionSetVariable {
  type: typeof ACTION_SET;
  name: string;
  value: Value;
}

export type Action = ActionBuyMarket | ActionSellMarket | ActionSetVariable;
