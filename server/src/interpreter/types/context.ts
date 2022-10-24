import { ContextData } from './number';
import { ValueOutput, ValueWallet } from './value';

export type ContextValue = ValueOutput | ValueWallet[] | ContextData;
export type Context = Record<string, ContextValue>;
