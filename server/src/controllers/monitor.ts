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
  sendResponse(res, 200, await monitorService.getValidSymbolsWithStatus());
};

export const getPricesHistoryController = async (
  req: Request,
  res: Response
) => {
  sendResponse(res, 200, monitorService.getHistory());
};

export const getOpCriteriasController = async (req: Request, res: Response) => {
sendResponse(res, 200, monitorService.getOpCriteria());
}

export const addOpCriteriasController = async (req: Request, res: Response) => {
  const { symbol, minOpValue } = req.body;
  await monitorService.setOpCriteria(symbol, minOpValue);
};
