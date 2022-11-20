import { Context } from '../interpreter/types/context';
import fs from 'fs';

export function loadContext(filePath: string): Context {
  const contextStr = fs.readFileSync(filePath, 'utf-8');
  const contextObj = JSON.parse(contextStr);
  const systemContext: Context = {
    ...contextObj
  };
  console.log('Context loaded', systemContext);
  return systemContext;
}
