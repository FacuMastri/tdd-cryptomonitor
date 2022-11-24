import { ValueOutput } from '../interpreter/types/value';

export default interface VariableRepository {
  setVar(name: string, value: ValueOutput): Promise<ValueOutput>;
  getVars(): Promise<Record<string, ValueOutput>>;
}
