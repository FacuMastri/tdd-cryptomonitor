import {
  Res,
  Req,
  AddRoute,
  getBody,
  HttpError,
  resJson,
  resText
} from './routes';
import { Rules } from '../interpreter/types/rule';
import { findUser } from '../users';

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
  addRoute('POST', '/rules', async (req: Req, res: Res) => {
    const user = findUser(req);
    const body = await getBody(req);

    const rules = parseRules(body);

    user.context.rules = rules;

    resText(res, 'Ok');
  });
  addRoute('GET', '/rules', async (req: Req, res: Res) => {
    const user = findUser(req);

    const rules = user.context.rules;

    resJson(res, rules);
  });
};

export default addRoutes;
