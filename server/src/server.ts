import express, { Express } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import {
  verifyCredentialsBody,
  verifyJwtHeader,
  verifyJwtHeaderAdmin,
  verifyRulesBody
} from './controllers/middleware';
import { loginController, verifyJwtController } from './controllers/users';
import {
  getAccountController,
  getExchangeInfoController,
  getTransactionsController
} from './controllers/binance';
import {
  addRulesController,
  getRulesController,
  getVarsController,
  setVarController
} from './controllers/interpreter';
import {
  addOpCriteriasController,
  addPoliticController,
  getOpCriteriasController,
  getPoliticsController,
  getPricesHistoryController,
  getSymbolsController
} from './controllers/monitor';

export default class Server {
  private app: Express;
  private readonly port: number;

  constructor(app: Express, port: number) {
    this.app = app;
    this.port = port;
  }

  public start() {
    this.addHelpers();
    this.addControllers();
    this.app.listen(this.port, () => {
      console.log(
        `Server is running on port ${this.port} at http://localhost:${this.port}/`
      );
    });
  }

  private addControllers() {
    // Users

    this.app.get('/verify', verifyJwtHeader, verifyJwtController);
    this.app.post('/login', verifyCredentialsBody, loginController);

    // Interpreter

    this.app.get('/vars', verifyJwtHeader, getVarsController);
    this.app.post('/vars', verifyJwtHeaderAdmin, setVarController);

    this.app.get('/rules', verifyJwtHeader, getRulesController);
    this.app.post(
      '/rules',
      verifyJwtHeader,
      verifyRulesBody,
      addRulesController
    );

    // Monitor

    this.app.get('/symbols', verifyJwtHeader, getSymbolsController);
    this.app.post('/politics', verifyJwtHeaderAdmin, addPoliticController);
    this.app.get('/politics', verifyJwtHeader, getPoliticsController);
    this.app.get('/prices', verifyJwtHeader, getPricesHistoryController);
    this.app.get(
      '/walletOpCriterias',
      verifyJwtHeader,
      getOpCriteriasController
    );

    this.app.post(
      '/walletOpCriterias',
      verifyJwtHeaderAdmin,
      addOpCriteriasController
    );

    // Binance

    this.app.get('/binance/exchangeInfo', getExchangeInfoController);
    this.app.get('/binance/account', getAccountController);
    this.app.get('/transactions', verifyJwtHeader, getTransactionsController);
  }

  private addHelpers() {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(morgan('dev'));
  }
}
