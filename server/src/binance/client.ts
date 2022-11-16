import { Request, Response } from 'express';

export const getExchangeInfoController =
  (client: BinanceClient) => (req: Request, res: Response) => {
    const symbol = req.query.symbol;
    const symbols = req.query.symbols;
    const params = {
      symbol: symbol,
      symbols: symbols
    } as ExchangeInfoParams;
    client.getExchangeInfo(params).then((data) => {
      res.send(data);
    });
  };

export const getAccountController =
  (client: BinanceClient) => (req: Request, res: Response) => {
    client.getAccountInfo().then((data) => {
      res.send(data);
    });
  };
