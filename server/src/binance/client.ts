import { URLSearchParams } from 'url';
import * as crypto from 'crypto';
import { RequestOptions } from 'https';
import https from 'https';
import { Request, Response } from 'express';

const apiHost = 'testnet.binance.vision';
const apiPath = '/api/v3';
const apiUrl = `https://${apiHost}${apiPath}`;

export type ExchangeInfoParams = {
  symbol?: string;
  symbols?: string;
};

export default class BinanceClient {
  private readonly apiKey: string;
  private readonly apiSecret: string;

  constructor(apiKey: string, apiSecret: string) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }

  private buildPromise(url: string | RequestOptions): Promise<any> {
    return new Promise((resolve) => {
      https.get(url, (resp: any) => {
        let data = '';
        resp.on('data', (chunk: any) => {
          data += chunk;
        });
        resp.on('end', () => {
          resolve(data);
        });
      });
    });
  }

  private buildExchangeInfoQuery(params?: ExchangeInfoParams): string {
    const query = new URLSearchParams();
    if (params?.symbol) {
      query.append('symbol', params.symbol);
    }
    if (params?.symbols) {
      query.append('symbols', params.symbols);
    }
    return query.toString();
  }

  private buildSignedQuery(query?: string): string {
    const timestamp = Date.now();
    const queryWithTimestamp = query
      ? `${query}&timestamp=${timestamp}`
      : `timestamp=${timestamp}`;
    const signature = crypto
      .createHmac('sha256', this.apiSecret)
      .update(queryWithTimestamp)
      .digest('hex');

    return `${queryWithTimestamp}&signature=${signature}`;
  }

  public getExchangeInfo(params?: ExchangeInfoParams): Promise<any> {
    const url = `${apiUrl}/exchangeInfo`;
    const query = this.buildExchangeInfoQuery(params);

    return this.buildPromise(`${url}?${query}`);
  }

  public getAccountInfo(): Promise<any> {
    const query = this.buildSignedQuery();
    const options: RequestOptions = {
      hostname: apiHost,
      path: `${apiPath}/account?${query}`,
      method: 'GET',
      headers: {
        'X-MBX-APIKEY': this.apiKey
      }
    };
    return this.buildPromise(options);
  }

  public doOrder(
    symbol: string,
    side: string,
    type: string,
    quantity?: number,
    price?: number
  ): Promise<any> {
    const unsignedQuery = new URLSearchParams();
    unsignedQuery.append('symbol', symbol);
    unsignedQuery.append('side', side);
    unsignedQuery.append('type', type);
    if (quantity) {
      unsignedQuery.append('quantity', quantity.toString());
    }
    if (price) {
      unsignedQuery.append('price', price.toString());
    }
    const query = this.buildSignedQuery(unsignedQuery.toString());

    const options: RequestOptions = {
      hostname: apiHost,
      path: `${apiPath}/order?${query}`,
      method: 'POST',
      headers: {
        'X-MBX-APIKEY': this.apiKey
      }
    };
    return this.buildPromise(options);
  }

  public buy(symbol: string, quantity?: number, price?: number): Promise<any> {
    return this.doOrder(symbol, 'BUY', 'MARKET', quantity, price);
  }

  public sell(symbol: string, quantity?: number, price?: number): Promise<any> {
    return this.doOrder(symbol, 'SELL', 'MARKET', quantity, price);
  }
}

export const getExchangeInfoController =
  (client: BinanceClient) => (req: Request, res: Response) => {
    const symbol = req.query.symbol;
    const symbols = req.query.symbols;
    const params = {
      symbol: symbol,
      symbols: symbols
    } as ExchangeInfoParams;
    client.getExchangeInfo(params).then((data) => {
      res.send(data);
    });
  };

export const getAccountController =
  (client: BinanceClient) => (req: Request, res: Response) => {
    client.getAccountInfo().then((data) => {
      res.send(data);
    });
  };
