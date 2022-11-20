import {ContextData, ContextDatum} from './number';
import { ValueOutput, ValueWallet } from './value';

export type ContextValue = ValueOutput | ValueWallet[] | ContextData;

export type Context = {
  data?: {
    [symbol: string]: ContextDatum[],
  },
  variables?: {
    [variableName: string]: ValueOutput,
  }
  wallets?: ValueWallet[],
}
