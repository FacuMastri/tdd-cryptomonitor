import RuleRepository from './RuleRepository';
import { Context } from '../interpreter/types/context';
import { Rule } from '../interpreter/types/rule';
import { ValueWallet } from '../interpreter/types/value';
import { ContextData } from '../interpreter/types/number';

export default class InMemoryRuleRepository implements RuleRepository {
  private context: Context;
  constructor(systemContext: Context) {
    this.context = systemContext;
  }

  public async addRule(rule: Rule): Promise<Rule> {
    (this.context.rules as any[]).push(rule);
    return rule;
  }

  public async getAllRules(): Promise<
    number | string | boolean | ValueWallet[] | ContextData
  > {
    return this.context.rules;
  }
}
