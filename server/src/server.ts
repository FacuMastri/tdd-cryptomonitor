import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import {
  addRulesController,
  getRulesController,
  verifyCredentialsBody,
  verifyJwtHeader,
  verifyRulesBody
} from './controllers';
import BinanceClient, {
  getAccountController,
  getExchangeInfoController
} from './binance/client';
import dotenv from 'dotenv';
import { verifyJwtHeaderAdmin } from './controllers/middleware';
import { loginController, verifyJwtController } from './controllers/users';

dotenv.config();

type BuyOrderParams = {
  symbol: string;
  price?: number;
  quantity?: number;
};

export default class Server {
  private app: Express;
  private readonly port: number;
  client: BinanceClient;

  constructor(app: Express, port: number) {
    this.app = app;
    this.port = port;
    this.client = new BinanceClient(
      process.env.BINANCE_API_KEY ?? '',
      process.env.BINANCE_API_SECRET ?? ''
    );
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
    this.app.get('/', (req: Request, res: Response) => {
      res.send('Hello World!');
    });
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

    this.app.get(
      '/binance/exchangeInfo',
      verifyJwtHeader,
      getExchangeInfoController(this.client)
    );

    this.app.get(
      '/binance/account',
      verifyJwtHeader,
      getAccountController(this.client)
    );

    // These are not meant to be endpoints
    this.app.get('/binance/buyOrders', (req: Request<BuyOrderParams>, resp) => {
      const symbol = req.query.symbol;
      // @ts-ignore
      const quantity = req.query.quantity as number;
      // @ts-ignore
      const price = req.query.price as number;

      if (symbol) {
        this.client.buy(symbol.toString(), quantity, price).then((data) => {
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
          this.client.sell(symbol.toString(), quantity, price).then((data) => {
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
