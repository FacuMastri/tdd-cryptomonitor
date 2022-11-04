import { Res, Req, AddRoute, getBody, headers, HttpError } from './routes';
import { createUserSession } from '../users';

const addRoutes = (addRoute: AddRoute) => {
  addRoute('POST', '/login', async (req: Req, res: Res) => {
    const body = await getBody(req);

    const json = JSON.parse(body);
    const user = json.user;
    const password = json.password;

    if (!user) throw new HttpError(401, 'No User');
    if (!password) throw new HttpError(401, 'No Password');

    const jwt = createUserSession(user, password);

    res.writeHead(200, headers);
    res.end(jwt);
  });
};

export default addRoutes;
