import cors from 'cors';
import express, { Express, NextFunction, Request, Response } from 'express';
import { createUserJwt, findUserByJwt, loadUsers } from './users';
import morgan from 'morgan';

const PORT = 8080;

loadUsers('db/users.json');

const app: Express = express();

function verifyJwtHeader(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.jwt) {
    return res.status(401).send('No token was provided');
  }
  next();
}

function verifyCredentialsBody(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.body.user) {
    return res.status(401).send('No user provided');
  }
  if (!req.body.password) {
    return res.status(401).send('No password provided');
  }
  next();
}

function verifyRulesBody(req: Request, res: Response, next: NextFunction) {
  if (!req.body.rules || !req.body.requiredVariables) {
    return res.status(406).send('Invalid rules, verify the format required');
  }
  next();
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/verify', verifyJwtHeader, async (req: Request, res: Response) => {
  try {
    const { id } = findUserByJwt(req.headers.jwt as string);
    res.status(200).send(String(id));
  } catch (err) {
    res.status(401).send(getErrorMessage(err));
  }
});

app.post(
  '/login',
  verifyCredentialsBody,
  async (req: Request, res: Response) => {
    const { user, password } = req.body;

    try {
      const jwt = createUserJwt(user, password);
      res.status(200).send(jwt);
    } catch (err) {
      res.status(401).send(getErrorMessage(err));
    }
  }
);

app.post(
  '/rules',
  verifyJwtHeader,
  verifyRulesBody,
  async (req: Request, res: Response) => {
    // TODO ver manejo de errores interno porque se repite codigo try/catch
    let user;
    try {
      user = findUserByJwt(req.headers.jwt as string);
    } catch (err) {
      return res.status(401).send(getErrorMessage(err));
    }
    user.context.rules = req.body;
    res.status(200).send('Rules added');
  }
);

app.get('/rules', verifyJwtHeader, async (req: Request, res: Response) => {
  // TODO ver manejo de errores interno porque se repite codigo try/catch
  let user;
  try {
    user = findUserByJwt(req.headers.jwt as string);
  } catch (err) {
    return res.status(401).send(getErrorMessage(err));
  }
  const rules = user.context.rules;
  res.status(200).send(rules);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} at http://localhost:${PORT}/`);
});
