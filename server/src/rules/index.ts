import fs from "fs";
import {Rule} from "../interpreter/types/rule";

export function loadRules(filePath: string) {
  const rulesStr = fs.readFileSync(filePath, 'utf-8');
  const rulesObj = JSON.parse(rulesStr);
  const systemRules: Rule[] = [
    ...rulesObj
  ]
  console.log('Rules loaded', systemRules);
  return systemRules;
}