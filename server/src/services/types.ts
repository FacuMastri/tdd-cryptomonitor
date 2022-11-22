/* eslint-disable @typescript-eslint/ban-types */
// FIXME: Don't use the name Symbol
export type Symbol = string;

export const symbolMarketStatuses = ['ALZA', 'BAJA', 'ESTABLE'] as const;
export type SymbolMarketStatus = typeof symbolMarketStatuses[number];

export type SymbolMarketStatusDict = { [key: Symbol]: SymbolMarketStatus };

export const isMarketStatus = (status: string): status is SymbolMarketStatus =>
  symbolMarketStatuses.includes(status as SymbolMarketStatus);
