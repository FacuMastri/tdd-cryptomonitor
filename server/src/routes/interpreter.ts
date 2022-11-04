import { Res, Req, AddRoute, getBody } from './routes';
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
  throw new Error('Invalid Rules');
};

const addRoutes = (addRoute: AddRoute) => {
  addRoute('POST', '/*', async (req: Req, res: Res) => {
    const body = await getBody(req);

    let rules: Rules;
    try {
      rules = parseRules(body);
    } catch (e) {
      res.statusCode = 400;
      res.end((e as Error).message);
      return;
    }

    // TODO: Add rules to user

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('Ok');
  });
};

export default addRoutes;
