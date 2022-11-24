/* eslint-disable @typescript-eslint/ban-types */
import { binanceService, interpreterService } from './index';
import {
  DEFAULT_INTERVAL_IN_HOURS,
  DEFAULT_VARIATION_PERC,
  MIN_SYMBOL_VARIATION_PERC
} from '../config';
import { evalRules } from '../interpreter/interpreter';
import { ContextDatum } from '../interpreter/types/number';
import { SymbolMarketStatusDict, Symbol, SymbolMarketStatus } from './types';
import { WebSocket } from 'ws';
import { calculateVariation } from './helper';

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

export type SymbolWithStatus = {
  symbol: string;
  status: SymbolMarketStatus;
};

export type OpCriteria = {
  symbol: string;
  minOpValue: number;
};

export default class MonitorService {
  private history: { [key: Symbol]: ContextDatum[] };
  private readonly status: SymbolMarketStatusDict;
  private readonly statusChangePolitics: { [key: Symbol]: SymbolChangePolitic };
  private opCriteria: OpCriteria | undefined;
  private socket: any | undefined;

  constructor(startSocket = true) {
    this.history = {};
    this.status = {};
    this.statusChangePolitics = this.getDefaultPolitics();
    // Does not work if I change the anonymous function to a
    // method call, I don't know why
    startSocket && this.setUpWebsocket().then(() => this.setDefaultPolitics());
  }

  private async setDefaultPolitics() {
    const symbols = await this.getValidSymbols();
    console.log('Setting default politics for symbols', symbols);
    symbols.forEach((symbol) => {
      this.addPolitic(
        symbol,
        DEFAULT_VARIATION_PERC,
        DEFAULT_INTERVAL_IN_HOURS
      );
    });
  }

  private isOperational(): boolean {
    if (!this.opCriteria) {
      return true;
    }
    const { symbol, minOpValue } = this.opCriteria;
    const symbolHistory = this.history[symbol];
    if (!symbolHistory) {
      return false;
    }
    const last_entry = symbolHistory[symbolHistory.length - 1];
    return last_entry.value > minOpValue;
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

  public setOpCriteria(symbol: Symbol, minOpValue: number) {
    this.opCriteria = { symbol, minOpValue };
  }

  public getOpCriteria(): OpCriteria | undefined {
    return this.opCriteria;
  }

  public getPolitics(): { [key: Symbol]: SymbolChangePolitic } {
    return this.statusChangePolitics;
  }

  public async getValidSymbols(): Promise<Symbol[]> {
    const info = JSON.parse(await binanceService.getExchangeInfo());
    return info.symbols.map((symbol: any) => symbol.symbol);
  }

  public async getValidSymbolsWithStatus(): Promise<SymbolWithStatus[]> {
    const symbols = await this.getValidSymbols();
    return symbols.map((symbol) => {
      return {
        symbol,
        status: this.getStatusFor(symbol)
      };
    });
  }

  public getStatusFor(symbol: Symbol): SymbolMarketStatus {
    return this.status[symbol];
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
        console.log('Relevant variation for symbol', symbol, price);
        symbolHistory.push({
          value: price,
          timestamp: Date.now()
        });
        await this.handleRelevantVariation();
      }
    } else {
      symbolHistory.push({
        value: price,
        timestamp: Date.now()
      });
      await this.handleRelevantVariation();
    }
  }

  private async handleRelevantVariation() {
    this.updateStatus();
    if (this.isOperational()) {
      await this.evalRulesAndUpdateContext();
    } else {
      console.log('Not evaluating rules because the wallet is not operational');
    }
  }

  private async evalRulesAndUpdateContext() {
    const rulesStatus = await interpreterService.getRulesFor(this.status);

    for (const rules of rulesStatus) {
      const context = await interpreterService.getContextFor(rules);
      const ruleNames = rules.rules.map((rule) => rule.name);
      try {
        const new_context = evalRules(rules, context);
        if (new_context.variables) {
          for await (const [key, value] of Object.entries(
            new_context.variables
          )) {
            await interpreterService.setVarParsed(key, value);
          }
        }
        console.log('\x1b[32m%s\x1b[0m', 'Rules evaluated successfully ');
      } catch (error) {
        // @ts-ignore
        const err = error?.message ?? 'Error at evalRules';
        console.log('\x1b[31m%s\x1b[0m', err);
      }
      if (ruleNames.length > 0) console.log(ruleNames);
    }
  }

  // Returns the variation of the symbol in the last intervalInHours
  // It is calculated as the difference between the last price and the minimum price
  // in the last intervalInHours
  private getVariationOf(symbol: Symbol, intervalInHours: number): number {
    return calculateVariation(symbol, intervalInHours, this.history[symbol]);
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

  public getHistory(): { [key: Symbol]: ContextDatum[] } {
    return this.history;
  }
}
