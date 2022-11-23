import { Request, Response } from 'express';
import { monitorService } from '../services';

export const addPoliticController = async (req: Request, res: Response) => {
  const { symbol, variationPerc, intervalInHours } = req.body;
  await monitorService.addPolitic(symbol, variationPerc, intervalInHours);
  res.status(200).send(monitorService.getPolitics());
};

export const getPoliticsController = async (req: Request, res: Response) => {
  res.status(200).send(monitorService.getPolitics());
};

export const getSymbolsController = async (req: Request, res: Response) => {
  res.status(200).send(await monitorService.getValidSymbols());
};

export const getPricesController = async (req: Request, res: Response) => {
  res.status(200).send(await monitorService.getHistory());
};
