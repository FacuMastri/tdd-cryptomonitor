import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import { createUserJwt, findUserByJwt, loadUsers } from './users';
import morgan from 'morgan';

const PORT = 8080;

loadUsers('db/users.json');

const app: Express = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/verify', async (req: Request, res: Response) => {
  if (!req.headers.jwt) {
    res.status(401).send('No token was provided');
  }
  try {
    const { id } = findUserByJwt(req.headers.jwt as string);
    res.status(200).send(String(id));
    // resText(res, String(id));
  } catch (err) {
    let message;
    if (err instanceof Error) {
      message = err.message;
    } else {
      message = String(err);
    }
    res.status(401).send(message);
  }
});

app.post('/login', async (req: Request, res: Response) => {
  const { user, password } = req.body;

  if (!user) {
    return res.status(401).send('No user provided');
  }
  if (!password) {
    return res.status(401).send('No password provided');
  }

  try {
    const jwt = createUserJwt(user, password);
    res.status(200).send(jwt);
  } catch (err) {
    let message;
    if (err instanceof Error) {
      message = err.message;
    } else {
      message = String(err);
    }
    res.status(401).send(message);
  }
});

app.post('/rules', async (req: Request, res: Response) => {
  if (!req.headers.jwt) {
    return res.status(401).send('No token was provided');
  }

  // TODO ver manejo de errores interno porque se repite codigo
  const user = findUserByJwt(req.headers.jwt as string);
  if (!req.body.rules || !req.body.requiredVariables) {
    return res.status(406).send('Invalid rules');
  }
  user.context.rules = req.body;
  res.status(200).send('Rules added');
});

app.get('/rules', async (req: Request, res: Response) => {
  if (!req.headers.jwt) {
    res.status(401).send('No token was provided');
  }

  const user = findUserByJwt(req.headers.jwt as string);
  const rules = user.context.rules;
  res.status(200).send(rules);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} at http://localhost:${PORT}/`);
});
