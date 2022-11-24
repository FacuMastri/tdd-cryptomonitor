import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { userService } from '../services';
import { getErrorMessage, sendResponse } from './utils';

const clientId =
  '283435392885-4q2ph3d1v2nuf98str251pvd1vg5elmq.apps.googleusercontent.com';

const client = new OAuth2Client(clientId);

export const googleLoginController = async (req: Request, res: Response) => {
  const { google } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: google,
    audience: clientId
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
