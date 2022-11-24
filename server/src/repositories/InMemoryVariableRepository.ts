import { ValueOutput } from '../interpreter/types/value';
import VariableRepository from './VariableRepository';

export default class InMemoryVariableRepository implements VariableRepository {
  private vars: Record<string, ValueOutput>;

  constructor(vars?: Record<string, ValueOutput>) {
    this.vars = vars || {};
  }

  public async setVar(name: string, value: ValueOutput): Promise<ValueOutput> {
    this.vars[name] = value;
    return value;
  }
  public async getVars(): Promise<Record<string, ValueOutput>> {
    return this.vars;
  }
}
