import {Rules} from '../interpreter/types/rule';

export default interface RuleRepository {
  addRules(rules: Rules): Promise<Rules>;

  getAllRules(): Promise<Rules[]>;
}
