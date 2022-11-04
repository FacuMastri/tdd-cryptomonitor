import { Res, Req, AddRoute, getBody, headers, HttpError } from './routes';
import { Rules } from '../interpreter/types/rule';

// TODO: Move this to interpreter
const parseRules = (body: string): Rules => {
  const json = JSON.parse(body);
  console.log('json', json);
  // TODO: Validate json
  if (json.rules && json.requiredVariables) {
    return json;
  }
  // TODO: Add more specific error messages (Nice to have)
  throw new HttpError(406, 'Invalid Rules');
};

const addRoutes = (addRoute: AddRoute) => {
  addRoute('POST', '/*', async (req: Req, res: Res) => {
    const body = await getBody(req);

    const rules = parseRules(body);

    // TODO: Add rules to user

    res.writeHead(200, headers);
    res.end('Ok');
  });
};

export default addRoutes;
