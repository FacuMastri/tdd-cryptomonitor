import RuleRepository from '../repositories/RuleRepository';
import { Rules } from '../interpreter/types/rule';
import { SymbolMarketStatus, SymbolMarketStatusDict, Symbol } from './types';
import InMemoryRuleRepository from '../repositories/InMemoryRuleRepository';

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

  private newRulesForSymbol(): RulesForSymbol {
    return {
      ALZA: new InMemoryRuleRepository(),
      BAJA: new InMemoryRuleRepository(),
      ESTABLE: new InMemoryRuleRepository()
    };
  }

  public async addRules(
    rules: Rules,
    validFor: Symbol,
    validIn: SymbolMarketStatus
  ): Promise<Rules> {
    const rulesForSymbol = this.ruleRepositories[validFor] || {};
    const rulesForStatus = rulesForSymbol[validIn] || this.newRulesForSymbol();
    const ret = rulesForStatus.addRules(rules);
    this.ruleRepositories[validFor] = rulesForSymbol;
    return ret;
  }

  public async getAllRules(): Promise<RuleRepositories> {
    return this.ruleRepositories;
  }
}
