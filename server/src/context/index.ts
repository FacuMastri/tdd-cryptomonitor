import { Context } from '../interpreter/types/context';
import fs from 'fs';

export function loadContext(filePath: string) {
  const context_str = fs.readFileSync(filePath, 'utf-8');
  const context_obj = JSON.parse(context_str);
  const systemContext: Context = {
    rules: [],
    ...context_obj
  };
  console.log('Context loaded', systemContext);
  return systemContext;
}
