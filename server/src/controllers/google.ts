import { Request, Response } from 'express';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { userService } from '../services';
import { getErrorMessage } from './utils';
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

  if (payload == undefined) return res.status(4003).send('Invalid');

  const { email, name } = payload;

  try {
    const jwt = await userService.createFederatedJwt(
      email || name || 'invalid',
      { provider: 'google' }
    );
    res.status(200).send(jwt);
  } catch (err) {
    res.status(401).send(getErrorMessage(err));
  }
};
