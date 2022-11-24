import { Request, Response } from 'express';
import { binanceService, monitorService } from '../services';
import { ExchangeInfoParams } from '../services/BinanceService';
import { sendResponse } from './utils';

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
  sendResponse(res, 200, await binanceService.getExchangeInfo(params));
};

export const getAccountController = async (req: Request, res: Response) => {
  sendResponse(res, 200, await binanceService.getAccountInfo());
};

export const getTransactionsController = async (
  req: Request,
  res: Response
) => {
  res.send(binanceService.getTransactionsHistory());
};
