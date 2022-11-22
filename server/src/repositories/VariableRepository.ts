import { Value } from '../interpreter/types/value';

export default interface VariableRepository {
  setVar(name: string, value: Value): Promise<Value>;
  getVars(): Promise<Record<string, Value>>;
}
