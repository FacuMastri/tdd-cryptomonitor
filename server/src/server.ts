import express, { Express, Request } from 'express';
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
  getExchangeInfoController
} from './controllers/binance';
import { binanceService } from './services';
import {
  addRulesController,
  getRulesController
} from './controllers/interpreter';
import { BuyOrderParams } from './services/BinanceService';
import MonitorService from './services/MonitorService';
import {
  addPoliticController,
  getPoliticsController
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
    this.app.get('/verify', verifyJwtHeader, verifyJwtController);
    this.app.post('/login', verifyCredentialsBody, loginController);
    this.app.post(
      '/rules',
      verifyJwtHeader,
      verifyRulesBody,
      addRulesController
    );

    this.app.get('/rules', verifyJwtHeader, getRulesController);
    this.app.post('/rules', verifyJwtHeaderAdmin, addRulesController);
    this.app.post('/politics', verifyJwtHeaderAdmin, addPoliticController);
    this.app.get('/politics', verifyJwtHeader, getPoliticsController);

    this.app.get('/binance/exchangeInfo', getExchangeInfoController);

    this.app.get('/binance/account', getAccountController);

    // These are not meant to be endpoints
    this.app.get('/binance/buyOrders', (req: Request<BuyOrderParams>, resp) => {
      const symbol = req.query.symbol;
      // @ts-ignore
      const quantity = req.query.quantity as number;
      // @ts-ignore
      const price = req.query.price as number;

      if (symbol) {
        binanceService.buy(symbol.toString(), quantity, price).then((data) => {
          resp.send(data);
        });
      } else {
        resp.send({
          error: 'Symbol is required'
        });
      }
    });

    this.app.get(
      '/binance/sellOrders',
      (req: Request<BuyOrderParams>, resp) => {
        const symbol = req.query.symbol;
        // @ts-ignore
        const quantity = req.query.quantity as number;
        // @ts-ignore
        const price = req.query.price as number;

        if (symbol) {
          binanceService
            .sell(symbol.toString(), quantity, price)
            .then((data) => {
              resp.send(data);
            });
        } else {
          resp.send({
            error: 'Symbol is required'
          });
        }
      }
    );
  }

  private addHelpers() {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(morgan('dev'));
  }
}
