import { Value } from '../interpreter/types/value';
import VariableRepository from './VariableRepository';

export default class InMemoryVariableRepository implements VariableRepository {
  private vars: Record<string, Value>;

  constructor(vars?: Record<string, Value>) {
    this.vars = vars || {};
  }

  public async setVar(name: string, value: Value): Promise<Value> {
    this.vars[name] = value;
    return value;
  }
  public async getVars(): Promise<Record<string, Value>> {
    return this.vars;
  }
}
