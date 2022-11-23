import { binanceService, interpreterService } from './index';
import {DEFAULT_INTERVAL_IN_HOURS, DEFAULT_VARIATION_PERC, MIN_SYMBOL_VARIATION_PERC} from '../config';
import { evalRule, evalRules } from '../interpreter/interpreter';
import { Context } from '../interpreter/types/context';
import { ValueOutput } from '../interpreter/types/value';
import { ContextDatum } from '../interpreter/types/number';
import { SymbolMarketStatusDict, Symbol } from './types';
import {BinanceService} from "./BinanceService";

const WebSocket = require('ws');

const BINANCE_WS = `wss://stream.binance.com:9443/ws/`;

// If a symbol increases its value by more than variationPerc in the specified hours,
// the Status of the symbol will be ALZA.
// If a symbol decreases its value by more than variationPerc in the specified hours,
// the Status of the symbol will be BAJA.
// Otherwise, the Status of the symbol will be ESTABLE.
export type SymbolChangePolitic = {
  variationPerc: number;
  intervalInHours: number;
};

export default class MonitorService {
  private history: { [key: Symbol]: ContextDatum[] };
  private variables: { [name: Symbol]: ValueOutput };
  private status: SymbolMarketStatusDict;
  private statusChangePolitics: { [key: Symbol]: SymbolChangePolitic };

  private socket: any | undefined;

  constructor() {
    this.history = {};
    this.variables = {};
    this.status = {};
    this.statusChangePolitics = this.getDefaultPolitics();
    // Does not work if I change the anonymous function to a
    // method call, I don't know why
    this.setUpWebsocket().then(() => this.setDefaultPolitics());
  }

  private async setDefaultPolitics() {
    const symbols = await this.getValidSymbols();
    console.log('Setting default politics for symbols', symbols);
    symbols.forEach((symbol) => {
      this.addPolitic(symbol, DEFAULT_VARIATION_PERC, DEFAULT_INTERVAL_IN_HOURS);
    });
  }

  public addPolitic(
    symbol: Symbol,
    variationPerc: number,
    intervalInHours: number
  ) {
    this.statusChangePolitics[symbol] = {
      variationPerc,
      intervalInHours
    };
  }

  public getPolitics(): { [key: Symbol]: SymbolChangePolitic } {
    return this.statusChangePolitics;
  }

  public async getValidSymbols(): Promise<Symbol[]> {
    const info = JSON.parse(await binanceService.getExchangeInfo());
    return info.symbols.map((symbol: any) => symbol.symbol);
  }

  // Returns some politics as an example
  private getDefaultPolitics(): { [key: Symbol]: SymbolChangePolitic } {
    return {
      BTCUSDT: {
        variationPerc: 0.1,
        intervalInHours: 1
      },
      ETHUSDT: {
        variationPerc: 0.1,
        intervalInHours: 1
      },
      XRPUSDT: {
        variationPerc: 0.1,
        intervalInHours: 1
      }
    };
  }

  private async setUpWebsocket() {
    console.log('Setting up websocket');
    const symbols = await this.getValidSymbols();

    const streams = symbols.map(
      (symbol) => `${symbol.toLowerCase()}@bookTicker`
    );

    const url = `${BINANCE_WS}${streams.join('/')}`;
    this.socket = new WebSocket(url);
    this.socket.on('open', function () {
      console.log('socket open');
    });
    this.socket.on('error', function () {
      console.log('socket error');
    });
    this.socket.on('close', function () {
      console.log('socket close');
    });
    this.socket.addEventListener('message', (event: any) =>
      this.handleMessage(event)
    );
  }

  private async handleMessage(event: any) {
    const data = JSON.parse(event.data);
    const symbol = data.s;
    const price = data.b;
    if (!this.history[symbol]) {
      this.history[symbol] = [];
    }
    const symbolHistory = this.history[symbol];

    if (symbolHistory.length > 0) {
      const last_entry = symbolHistory[symbolHistory.length - 1];
      if (this.isRelevantVariation(last_entry.value, price)) {
        console.log('Relevant variation for symbol', symbol);
        symbolHistory.push({
          value: price,
          timestamp: Date.now()
        });
        this.updateStatus();
        const rulesStatus = await interpreterService.getRulesFor(this.status);
        rulesStatus.forEach((rules) => {
          rules.rules.forEach((r) => {
            const newContext = evalRule(r, this.getContext());
            this.setContext(newContext);
          });
        });
      }
    } else {
      symbolHistory.push({
        value: price,
        timestamp: Date.now()
      });
      this.updateStatus();
    }
  }

  // Returns the variation of the symbol in the last intervalInHours
  // It is calculated as the difference between the last price and the minimum price
  // in the last intervalInHours
  private getVariationOf(symbol: Symbol, intervalInHours: number): number {
    const symbolHistory = this.history[symbol];
    if (!symbolHistory) {
      return 0;
    }
    const last_entry = symbolHistory[symbolHistory.length - 1];
    const min_entry = symbolHistory.reduce((min, entry) => {
      if (
        entry.timestamp >
        last_entry.timestamp - intervalInHours * 3600 * 1000
      ) {
        return entry.value < min.value ? entry : min;
      }
      return min;
    });
    return (last_entry.value - min_entry.value) / min_entry.value;
  }

  // Updates status of the symbols according to the statusChangePolitics
  private updateStatus() {
    Object.entries(this.statusChangePolitics).forEach(([symbol, politic]) => {
      const variation = this.getVariationOf(symbol, politic.intervalInHours);
      if (variation > politic.variationPerc) {
        this.status[symbol] = 'ALZA';
      } else if (variation < -politic.variationPerc) {
        this.status[symbol] = 'BAJA';
      } else {
        this.status[symbol] = 'ESTABLE';
      }
    });
  }

  private isRelevantVariation(lastPrice: number, newPrice: number) {
    const variation = Math.abs((lastPrice - newPrice) / lastPrice);
    return variation > MIN_SYMBOL_VARIATION_PERC;
  }

  private getContext(): Context {
    const context: Context = {
      data: this.history,
      variables: {}
    };
    Object.entries(this.variables).forEach(([variableName, variableValue]) => {
      if (context.variables) context.variables[variableName] = variableValue;
    });
    return context;
  }

  private setContext(context: Context) {
    if (context.data) {
      this.history = context.data;
    }
    if (context.variables) {
      Object.entries(context.variables).forEach(
        ([variableName, variableValue]) => {
          if (variableName !== 'data') {
            this.variables[variableName] = variableValue;
          }
        }
      );
    }
  }
}
