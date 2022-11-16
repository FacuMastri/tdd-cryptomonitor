import { RequestOptions } from 'https';
import * as https from 'https';
import * as crypto from 'crypto';

const API_HOST = 'testnet.binance.vision';
const API_PATH = '/api/v3';
const API_URL = `https://${API_HOST}${API_PATH}`;

export type ExchangeInfoParams = {
  symbol?: string;
  symbols?: string;
};

export class BinanceClient {
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
    const url = `${API_URL}/exchangeInfo`;
    const query = this.buildExchangeInfoQuery(params);

    return this.buildPromise(`${url}?${query}`);
  }

  public getAccountInfo(): Promise<any> {
    const query = this.buildSignedQuery();
    const options: RequestOptions = {
      hostname: API_HOST,
      path: `${API_PATH}/account?${query}`,
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
      hostname: API_HOST,
      path: `${API_PATH}/order?${query}`,
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
