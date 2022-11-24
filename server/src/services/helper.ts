import { Symbol } from './types';
import { ContextDatum } from '../interpreter/types/number';

export function calculateVariation(
  symbol: Symbol,
  intervalInHours: number,
  symbolHistory?: ContextDatum[]
): number {
  if (intervalInHours <= 0) {
    throw new Error('Interval must be greater than 0');
  }

  if (!symbolHistory) {
    return 0;
  }

  const entriesValidForInterval = symbolHistory.filter((entry) => {
    return entry.timestamp > Date.now() - intervalInHours * 60 * 60 * 1000;
  });

  if (entriesValidForInterval.length < 2) {
    return 0;
  }

  console.log('entriesValidForInterval', entriesValidForInterval);

  const min_entry = entriesValidForInterval.reduce((min, entry) => {
    return entry.value < min.value ? entry : min;
  });

  if (min_entry.value === 0) {
    throw new Error('min_entry is 0');
  }

  const max_entry = entriesValidForInterval.reduce((max, entry) => {
    return entry.value > max.value ? entry : max;
  });

  return (max_entry.value - min_entry.value) / min_entry.value;
}
