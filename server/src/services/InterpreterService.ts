import RuleRepository from '../repositories/RuleRepository';
import {Rule, Rules} from '../interpreter/types/rule';
import {
  SymbolMarketStatus,
  SymbolMarketStatusDict,
  Symbol
} from './MonitorService';

export type RulesForSymbol = {
  ALZA: RuleRepository;
  BAJA: RuleRepository;
  ESTABLE: RuleRepository;
};

export type RuleRepositories = { [key: Symbol]: RulesForSymbol };

export default class InterpreterService {
  private ruleRepositories: RuleRepositories;

  constructor(ruleRepositories?: RuleRepositories) {
    this.ruleRepositories = ruleRepositories || {};
  }

  public async getRulesFor(status: SymbolMarketStatusDict): Promise<Rules[]> {
    const rules: Rules[] = [];
    for (const symbol in status) {
      if (
        this.ruleRepositories[symbol] &&
        this.ruleRepositories[symbol][status[symbol]]
      ) {
        const symbolRules = await this.ruleRepositories[symbol][
          status[symbol]
        ].getAllRules();
        rules.push(...symbolRules);
      }
    }
    return rules;
  }

  public async addRules(
    rules: Rules,
    validFor: Symbol,
    validIn: SymbolMarketStatus
  ): Promise<Rules> {
    return this.ruleRepositories[validFor][validIn].addRules(rules);
  }

  public async getAllRules(): Promise<RuleRepositories> {
    return this.ruleRepositories;
  }
}
