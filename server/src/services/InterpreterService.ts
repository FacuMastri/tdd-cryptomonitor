import RuleRepository from '../repositories/RuleRepository';
import { ValueWallet } from '../interpreter/types/value';
import { ContextData } from '../interpreter/types/number';
import { Rule } from '../interpreter/types/rule';

export default class InterpreterService {
  private ruleRepository: RuleRepository;

  constructor(ruleRepository: RuleRepository) {
    this.ruleRepository = ruleRepository;
  }

  public async getRules(): Promise<
    number | string | boolean | ValueWallet[] | ContextData
  > {
    return await this.ruleRepository.getAllRules();
  }

  public async addRule(rule: Rule): Promise<Rule> {
    return await this.ruleRepository.addRule(rule);
  }
}
