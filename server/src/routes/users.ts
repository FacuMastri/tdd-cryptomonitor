import { Res, Req, AddRoute, getBody, headers } from './routes';
import { createUserSession } from '../users';

const addRoutes = (addRoute: AddRoute) => {
  addRoute('POST', '/login', async (req: Req, res: Res) => {
    const body = await getBody(req);

    const json = JSON.parse(body);
    const user = json.user;
    const password = json.password;

    if (!user) throw new Error('No User');
    if (!password) throw new Error('No Password');

    const jwt = createUserSession(user, password);

    res.writeHead(200, headers);
    res.end(jwt);
  });
};

export default addRoutes;
