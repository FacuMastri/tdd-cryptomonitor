import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import {
  addRulesHandler,
  getRulesHandler,
  verifyCredentialsBody,
  makeVerifyJwtController,
  verifyJwtHeader,
  verifyRulesBody
} from './handlers';
import { loginController, verifyJwtController } from './handlers/';

export default class Server {
  private app: Express;
  private readonly port: number;

  constructor(app: Express, port: number) {
    this.app = app;
    this.port = port;
  }

  public start() {
    this.addHelpers();
    this.addHandlers();
    this.app.listen(this.port, () => {
      console.log(
        `Server is running on port ${this.port} at http://localhost:${this.port}/`
      );
    });
  }

  private addHandlers() {
    this.app.get('/', (req: Request, res: Response) => {
      res.send('Hello World!');
    });
    this.app.get('/verify', verifyJwtHeader, verifyJwtController);
    this.app.post('/login', verifyCredentialsBody, loginController);
    this.app.post(
      '/rules',
      verifyJwtHeader,
      verifyRulesBody,
      addRulesHandler()
    );
    this.app.get('/rules', verifyJwtHeader, getRulesHandler());
  }

  private addHelpers() {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(morgan('dev'));
  }
}
