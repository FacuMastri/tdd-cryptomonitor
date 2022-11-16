import { Rule } from '../interpreter/types/rule';
import { ValueWallet } from '../interpreter/types/value';
import { ContextData } from '../interpreter/types/number';

export default interface RuleRepository {
  addRule(rule: Rule): Promise<Rule>;

  getAllRules(): Promise<
    number | string | boolean | ValueWallet[] | ContextData
  >;
}
