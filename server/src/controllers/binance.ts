import { Request, Response } from 'express';
import { binanceService, monitorService } from '../services';
import { ExchangeInfoParams } from '../services/BinanceService';

export const getExchangeInfoController = async (
  req: Request,
  res: Response
) => {
  const symbol = req.query.symbol;
  const symbols = req.query.symbols;
  const params = {
    symbol: symbol,
    symbols: symbols
  } as ExchangeInfoParams;
  res.send(await binanceService.getExchangeInfo(params));
};

export const getAccountController = async (req: Request, res: Response) => {
  res.send(await binanceService.getAccountInfo());
};

export const getTransactionsController = async (
  req: Request,
  res: Response
) => {
  res.send(binanceService.getTransactionsHistory());
};
