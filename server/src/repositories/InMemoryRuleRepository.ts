import RuleRepository from './RuleRepository';
import { Rules } from '../interpreter/types/rule';

export default class InMemoryRuleRepository implements RuleRepository {
  private rules?: Rules;

  constructor(rules?: Rules) {
    this.rules = rules;
  }

  public async setRules(rules: Rules): Promise<Rules> {
    this.rules = rules;
    return rules;
  }

  public async getRules(): Promise<Rules | undefined> {
    return this.rules;
  }
}
