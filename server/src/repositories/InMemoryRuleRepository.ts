import RuleRepository from './RuleRepository';
import {Rule, Rules} from '../interpreter/types/rule';

export default class InMemoryRuleRepository implements RuleRepository {
  private rules: Rules[];

  constructor(rules?: Rules[]) {
    this.rules = rules || [];
  }

  public async addRules(rules: Rules): Promise<Rules> {
    this.rules.push(rules);
    return rules;
  }

  public async getAllRules(): Promise<Rules[]> {
    return this.rules;
  }
}
