import { Context } from '../interpreter/types/context';
import fs from 'fs';

export let SystemContext: Context;

export function loadContext(filePath: string) {
  const context_str = fs.readFileSync(filePath, 'utf-8');
  const context_obj = JSON.parse(context_str);

  SystemContext = {
    rules: [],
    ...context_obj
  };
}