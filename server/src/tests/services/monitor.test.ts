import { calculateVariation } from '../../services/helper';
import { ContextDatum } from '../../interpreter/types/number';

describe('Monitor Service', () => {
  describe('calculateVariation', () => {
    test('should return 0 if history is empty', () => {
      const variation = calculateVariation('BTCUSDT', 1, []);
      expect(variation).toEqual(0);
      expect(true).toEqual(true);
    });

    test('should return 0 if history is undefined', () => {
      const variation = calculateVariation('BTCUSDT', 1, undefined);
      expect(variation).toEqual(0);
    });

    test('should return 0 if there is only one element in history', () => {
      const history: ContextDatum[] = [
        {
          timestamp: Date.now() - 60 * 1000,
          value: 1
        }
      ];
      const variation = calculateVariation('BTCUSDT', 1, history);
      expect(variation).toEqual(0);
    });

    test('should return 1 if values are 1 and 2', () => {
      const history: ContextDatum[] = [
        {
          timestamp: Date.now() - 2 * 60 * 1000,
          value: 1
        },
        {
          timestamp: Date.now() - 60 * 1000,
          value: 2
        }
      ];
      const variation = calculateVariation('BTCUSDT', 1, history);
      expect(variation).toEqual(1);
    });

    test('should return 0 if values are 1 and 2 but one of them is older than 1 hour', () => {
      const history: ContextDatum[] = [
        {
          // two hours ago
          timestamp: Date.now() - 2 * 60 * 60 * 1000,
          value: 1
        },
        {
          // one minute ago
          timestamp: Date.now() - 60 * 1000,
          value: 2
        }
      ];
      const variation = calculateVariation('BTCUSDT', 1, history);
      expect(variation).toEqual(0);
    });

    test('should return 1 if values are 1 and 2 and 3 but 3 is older than 1 hour', () => {
      const history: ContextDatum[] = [
        {
          // two hours ago
          timestamp: Date.now() - 2 * 60 * 60 * 1000,
          value: 3
        },
        {
          // two minutes ago
          timestamp: Date.now() - 2 * 60 * 1000,
          value: 2
        },
        {
          // one minute ago
          timestamp: Date.now() - 60 * 1000,
          value: 1
        }
      ];
      const variation = calculateVariation('BTCUSDT', 1, history);
      expect(variation).toEqual(1);
    });

    test('should return difference between min and max divided by min value', () => {
      const history: ContextDatum[] = [
        {
          // two hours ago
          timestamp: Date.now() - 2 * 60 * 60 * 1000,
          value: 3
        },
        {
          // two minutes ago
          timestamp: Date.now() - 2 * 60 * 1000,
          value: 2
        },
        {
          // one minute ago
          timestamp: Date.now() - 60 * 1000,
          value: 0.5
        }
      ];
      const variation = calculateVariation('BTCUSDT', 2.01, history);
      expect(variation).toBeCloseTo(5);
    });

    test('should throw error if min value is 0', () => {
      const history: ContextDatum[] = [
        {
          // two hours ago
          timestamp: Date.now() - 2 * 60 * 60 * 1000,
          value: 3
        },
        {
          // two minutes ago
          timestamp: Date.now() - 2 * 60 * 1000,
          value: 2
        },
        {
          // one minute ago
          timestamp: Date.now() - 60 * 1000,
          value: 0
        }
      ];
      expect(() => calculateVariation('BTCUSDT', 2.01, history)).toThrow();
    });

    test('should throw error if interval is 0', () => {
      const history: ContextDatum[] = [
        {
          // two hours ago
          timestamp: Date.now() - 2 * 60 * 60 * 1000,
          value: 3
        },
        {
          // two minutes ago
          timestamp: Date.now() - 2 * 60 * 1000,
          value: 2
        },
        {
          // one minute ago
          timestamp: Date.now() - 60 * 1000,
          value: 0
        }
      ];
      expect(() => calculateVariation('BTCUSDT', 0, history)).toThrow();
    });
  });
});
