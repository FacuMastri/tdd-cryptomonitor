import RuleRepository from './RuleRepository';
import { Rules } from '../interpreter/types/rule';

export default class InMemoryRuleRepository implements RuleRepository {
  private rules: Rules[];

  constructor(rules?: Rules[]) {
    this.rules = rules || [];
  }

  public async addRules(rule: Rules): Promise<Rules> {
    this.rules.push(rule);
    return rule;
  }

  public async getAllRules(): Promise<Rules[]> {
    return this.rules;
  }
}
