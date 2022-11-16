import { Request, Response } from 'express';
import { binanceService } from '../services';
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
