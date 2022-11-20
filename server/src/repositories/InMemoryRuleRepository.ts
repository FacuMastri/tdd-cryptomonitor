import RuleRepository from './RuleRepository';
import { Rule } from '../interpreter/types/rule';

export default class InMemoryRuleRepository implements RuleRepository {
  private rules: Rule[];

  constructor(rules?: Rule[]) {
    this.rules = rules || [];
  }

  public async addRule(rule: Rule): Promise<Rule> {
    this.rules.push(rule);
    return rule;
  }

  public async getAllRules(): Promise<Rule[]> {
    return this.rules;
  }
}
