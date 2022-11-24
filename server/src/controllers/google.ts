import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { userService } from '../services';
import { getErrorMessage, sendResponse } from './utils';
import { CLIENT_ID } from '../config';

const client = new OAuth2Client(CLIENT_ID);

export const googleLoginController = async (req: Request, res: Response) => {
  const { google } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: google,
    audience: CLIENT_ID
  });
  const payload = ticket.getPayload();

  if (payload == undefined) return sendResponse(res, 403, 'Invalid');
  const { email, name } = payload;

  try {
    const jwt = await userService.createFederatedJwt(
      email || name || 'invalid',
      { provider: 'google' }
    );
    sendResponse(res, 200, jwt);
  } catch (err) {
    sendResponse(res, 401, getErrorMessage(err));
  }
};
