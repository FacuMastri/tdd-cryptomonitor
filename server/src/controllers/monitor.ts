import { Request, Response } from 'express';
import { monitorService } from '../services';
import { sendResponse } from './utils';

export const addPoliticController = async (req: Request, res: Response) => {
  const { symbol, variationPerc, intervalInHours } = req.body;
  await monitorService.addPolitic(symbol, variationPerc, intervalInHours);
  sendResponse(res, 200, monitorService.getPolitics());
};

export const getPoliticsController = async (req: Request, res: Response) => {
  sendResponse(res, 200, monitorService.getPolitics());
};

export const getSymbolsController = async (req: Request, res: Response) => {
  sendResponse(res, 200, await monitorService.getValidSymbols());
};

export const getPricesHistoryController = async (
  req: Request,
  res: Response
) => {
  sendResponse(res, 200, monitorService.getHistory());
};
