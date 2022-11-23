import { Rules } from '../interpreter/types/rule';

export default interface RuleRepository {
  // Change the value of Rules that the repository holds
  setRules(rules: Rules): Promise<Rules>;

  // Return the value of Rules that the repository holds
  getRules(): Promise<Rules | undefined>;
}

