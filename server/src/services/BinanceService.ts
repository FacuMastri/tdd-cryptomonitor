import * as https from 'https';
import { RequestOptions } from 'https';
import * as crypto from 'crypto';
import { SymbolMarketStatus } from './types';
import MonitorService from './MonitorService';
import { monitorService } from './index';

const API_HOST = 'testnet.binance.vision';
const API_PATH = '/api/v3';
const API_URL = `https://${API_HOST}${API_PATH}`;

export type ExchangeInfoParams = {
  symbol?: string;
  symbols?: string;
};

export type BuyOrderParams = {
  symbol: string;
  price?: number;
  quantity?: number;
};

export type TransactionRecord = {
  symbol: string;
  type: 'BUY' | 'SELL';
  symbolStatus: SymbolMarketStatus;
  quantity: number;
  timestamp: number;
};

export class BinanceService {
  private readonly apiKey: string;
  private readonly apiSecret: string;
  private transactionsHistory: TransactionRecord[];

  constructor(apiKey: string, apiSecret: string) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.transactionsHistory = [];
  }

  public buy(symbol: string, quantity: number): Promise<any> {
    this.transactionsHistory.push({
      symbol,
      type: 'BUY',
      quantity: quantity,
      symbolStatus: monitorService.getStatusFor(symbol),
      timestamp: Date.now()
    });

    return this.doOrder(symbol, 'BUY', 'MARKET', quantity);
  }

  public sell(symbol: string, quantity: number): Promise<any> {
    this.transactionsHistory.push({
      symbol,
      type: 'SELL',
      quantity,
      symbolStatus: monitorService.getStatusFor(symbol),
      timestamp: Date.now()
    });

    return this.doOrder(symbol, 'SELL', 'MARKET', quantity);
  }

  public getTransactionsHistory(): TransactionRecord[] {
    return this.transactionsHistory;
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
}
