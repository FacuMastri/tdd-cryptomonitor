import { Request, Response } from 'express';
import { getErrorMessage, sendResponse } from './utils';
import { userService } from '../services';
import { googleLoginController } from './google';

export const loginController = async (req: Request, res: Response) => {
  if (req.body.google) return googleLoginController(req, res);
  const { user, password } = req.body;

  try {
    const jwt = await userService.createUserJwt(user, password);
    sendResponse(res, 200, jwt);
  } catch (err) {
    sendResponse(res, 401, getErrorMessage(err));
  }
};

export const verifyJwtController = async (req: Request, res: Response) => {
  try {
    const { id } = await userService.findUserByJwt(req.headers.jwt as string);
    sendResponse(res, 200, String(id));
  } catch (err) {
    sendResponse(res, 401, getErrorMessage(err));
  }
};
