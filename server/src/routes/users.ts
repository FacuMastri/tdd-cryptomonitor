import { Res, Req, AddRoute, getBody, HttpError, resText } from './routes';
import { createUserJwt, getUser } from '../users';

const addRoutes = (addRoute: AddRoute) => {
  addRoute('POST', '/login', async (req: Req, res: Res) => {
    const body = await getBody(req);

    const json = JSON.parse(body);
    const user = json.user;
    const password = json.password;

    if (!user) throw new HttpError(401, 'No User');
    if (!password) throw new HttpError(401, 'No Password');

    const jwt = createUserJwt(user, password);

    resText(res, jwt);
  });
  addRoute('GET', '/verify', async (req: Req, res: Res) => {
    const { id } = getUser(req);
    resText(res, String(id));
  });
};

export default addRoutes;
