import { Response } from 'express';

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export function sendResponse(
  res: Response,
  statusCode: number,
  resBody?: unknown
) {
  res.status(statusCode).send(resBody);
}
