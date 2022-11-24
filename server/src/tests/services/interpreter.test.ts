import InterpreterService from '../../services/InterpreterService';
import { Rules } from '../../interpreter/types/rule';

describe('InterpreterService', () => {
  describe('getRulesFor', () => {
    const getRules = (): Rules => ({
      requiredVariables: ['TDD/USDT'],
      rules: [
        {
          name: 'Comprar 12 TDD/USDT siempre',
          condition: {
            type: 'CONSTANT',
            value: true
          },
          actions: [
            {
              type: 'BUY_MARKET',
              symbol: 'TDD/USDT',
              amount: {
                type: 'CONSTANT',
                value: 12
              }
            }
          ]
        }
      ]
    });

    test('should return empty rules', async () => {
      const interpreterService: InterpreterService = new InterpreterService();
      const rules = await interpreterService.getRulesFor({
        BTCUSDT: 'ALZA',
        ETHUSDT: 'BAJA'
      });
      expect(rules).toMatchObject([]);
    });

    test('should return rules', async () => {
      const rulesToAdd = getRules();
      const interpreterService: InterpreterService = new InterpreterService();
      await interpreterService.setRules(rulesToAdd, 'BTCUSDT', 'ALZA');

      const rules = await interpreterService.getRulesFor({
        BTCUSDT: 'ALZA',
        ETHUSDT: 'BAJA'
      });
      expect(rules).toMatchObject([rulesToAdd]);
    });

    test('should not return rules if status does not match', async () => {
      const rulesToAdd = getRules();
      const interpreterService: InterpreterService = new InterpreterService();
      await interpreterService.setRules(rulesToAdd, 'BTCUSDT', 'ALZA');

      const rules = await interpreterService.getRulesFor({
        BTCUSDT: 'BAJA',
        ETHUSDT: 'BAJA'
      });
      expect(rules).toMatchObject([]);
    });

    test('should not return rules if symbol does not match', async () => {
      const rulesToAdd = getRules();
      const interpreterService: InterpreterService = new InterpreterService();
      await interpreterService.setRules(rulesToAdd, 'BTCUSDT', 'ALZA');

      const rules = await interpreterService.getRulesFor({
        ETHUSDT: 'ALZA'
      });
      expect(rules).toMatchObject([]);
    });
  });

  describe('setVar', () => {
    test('should set number var', async () => {
      const interpreterService: InterpreterService = new InterpreterService();
      await interpreterService.setVar('variableName', '12');
      const vars = await interpreterService.getAllVars();
      expect(vars['variableName']).toEqual(12);
    });

    test('should set string var', async () => {
      const interpreterService: InterpreterService = new InterpreterService();
      await interpreterService.setVar('variableName', 'string');
      const vars = await interpreterService.getAllVars();
      expect(vars['variableName']).toEqual('string');
    });

    test('should set boolean var', async () => {
      const interpreterService: InterpreterService = new InterpreterService();
      await interpreterService.setVar('variableName', 'true');
      const vars = await interpreterService.getAllVars();
      expect(vars['variableName']).toEqual(true);
    });

    test('should set more than one var', async () => {
      const interpreterService: InterpreterService = new InterpreterService();
      await interpreterService.setVar('variableName', 'true');
      await interpreterService.setVar('variableName2', 'false');
      const vars = await interpreterService.getAllVars();
      expect(vars['variableName']).toEqual(true);
      expect(vars['variableName2']).toEqual(false);
    });
  });
});
