import { Rule } from '../interpreter/types/rule';

export default interface RuleRepository {
  addRule(rule: Rule): Promise<Rule>;

  getAllRules(): Promise<Rule[]>;
}
