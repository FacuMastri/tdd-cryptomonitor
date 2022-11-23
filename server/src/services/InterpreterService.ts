/* eslint-disable @typescript-eslint/ban-types */
import RuleRepository from '../repositories/RuleRepository';
import { Rules } from '../interpreter/types/rule';
import { SymbolMarketStatus, SymbolMarketStatusDict, Symbol } from './types';
import InMemoryRuleRepository from '../repositories/InMemoryRuleRepository';
import VariableRepository from '../repositories/VariableRepository';
import InMemoryVariableRepository from '../repositories/InMemoryVariableRepository';
import { Value } from '../interpreter/types/value';

export type RulesForSymbol = {
  ALZA: RuleRepository;
  BAJA: RuleRepository;
  ESTABLE: RuleRepository;
};

export type RuleRepositories = { [key: Symbol]: RulesForSymbol };

export default class InterpreterService {
  private ruleRepositories: RuleRepositories;
  private varRepository: VariableRepository;

  constructor(
    ruleRepositories?: RuleRepositories,
    varRepository?: VariableRepository
  ) {
    this.ruleRepositories = ruleRepositories || {};
    this.varRepository = varRepository || new InMemoryVariableRepository();
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
        ].getRules();
        if (symbolRules) rules.push(symbolRules);
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

  public async setRules(
    rules: Rules,
    validFor: Symbol,
    validIn: SymbolMarketStatus
  ): Promise<Rules> {
    const rulesForSymbol =
      this.ruleRepositories[validFor] || this.newRulesForSymbol();

    await rulesForSymbol[validIn].setRules(rules);

    this.ruleRepositories[validFor] = rulesForSymbol;

    return rules;
  }

  public async getAllRules(): Promise<RuleRepositories> {
    return this.ruleRepositories;
  }

  private parseValue(value: string): Value {
    if (value === 'true')
      return {
        type: 'CONSTANT',
        value: true
      };
    if (value === 'false')
      return {
        type: 'CONSTANT',
        value: false
      };

    const numberValue = Number(value);
    if (!isNaN(numberValue))
      return {
        type: 'CONSTANT',
        value: numberValue
      };

    return {
      type: 'CONSTANT',
      value: value
    };
  }

  public async getAllVars(): Promise<VariableRepository> {
    return this.varRepository;
  }
  public async setVar(name: string, value: string): Promise<Value | undefined> {
    return this.varRepository.setVar(name, this.parseValue(value));
  }
}
