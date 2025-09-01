import { OHLCV, BollingerBandsData, BollingerBandsInputs } from '../types';

/**
 * Computes Simple Moving Average
 */
function sma(values: number[], period: number): number[] {
  const result: number[] = [];
  
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) {
      result.push(NaN);
      continue;
    }
    
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) {
      sum += values[j];
    }
    result.push(sum / period);
  }
  
  return result;
}

/**
 * Computes Standard Deviation (using sample standard deviation)
 */
function standardDeviation(values: number[], period: number): number[] {
  const result: number[] = [];
  
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) {
      result.push(NaN);
      continue;
    }
    
    // Calculate mean for this period
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) {
      sum += values[j];
    }
    const mean = sum / period;
    
    // Calculate variance (sample variance with N-1 denominator)
    let variance = 0;
    for (let j = i - period + 1; j <= i; j++) {
      variance += Math.pow(values[j] - mean, 2);
    }
    variance = variance / (period - 1); // Sample standard deviation
    
    result.push(Math.sqrt(variance));
  }
  
  return result;
}

/**
 * Applies offset to shift data series
 */
function applyOffset<T>(data: T[], offset: number): T[] {
  if (offset === 0) return data;
  
  const result = new Array(data.length);
  
  if (offset > 0) {
    // Shift forward (positive offset)
    for (let i = 0; i < data.length; i++) {
      const targetIndex = i + offset;
      if (targetIndex < data.length) {
        result[targetIndex] = data[i];
      }
    }
  } else {
    // Shift backward (negative offset)
    for (let i = 0; i < data.length; i++) {
      const sourceIndex = i - offset;
      if (sourceIndex < data.length) {
        result[i] = data[sourceIndex];
      }
    }
  }
  
  return result;
}

/**
 * Computes Bollinger Bands indicator
 * 
 * Formula:
 * - Basis (middle band) = SMA(source, length)
 * - Standard Deviation = sample standard deviation of last length values
 * - Upper = Basis + (StdDev multiplier * StdDev)
 * - Lower = Basis - (StdDev multiplier * StdDev)
 * 
 * Note: Uses sample standard deviation (N-1 denominator) for consistency with most financial platforms.
 */
export function computeBollingerBands(
  data: OHLCV[],
  inputs: BollingerBandsInputs
): BollingerBandsData[] {
  const { length, source, stdDevMultiplier, offset } = inputs;
  
  if (data.length === 0) return [];
  
  // Extract source values
  const sourceValues = data.map(candle => {
    switch (source) {
      case 'open': return candle.open;
      case 'high': return candle.high;
      case 'low': return candle.low;
      case 'close':
      default: return candle.close;
    }
  });
  
  // Calculate SMA (basis line)
  const basisValues = sma(sourceValues, length);
  
  // Calculate standard deviation
  const stdDevValues = standardDeviation(sourceValues, length);
  
  // Calculate upper and lower bands
  const upperValues = basisValues.map((basis, i) => {
    if (isNaN(basis) || isNaN(stdDevValues[i])) return NaN;
    return basis + (stdDevMultiplier * stdDevValues[i]);
  });
  
  const lowerValues = basisValues.map((basis, i) => {
    if (isNaN(basis) || isNaN(stdDevValues[i])) return NaN;
    return basis - (stdDevMultiplier * stdDevValues[i]);
  });
  
  // Apply offset if specified
  const offsetBasis = applyOffset(basisValues, offset);
  const offsetUpper = applyOffset(upperValues, offset);
  const offsetLower = applyOffset(lowerValues, offset);
  
  // Combine results
  return data.map((candle, i) => ({
    timestamp: candle.timestamp,
    basis: offsetBasis[i] || NaN,
    upper: offsetUpper[i] || NaN,
    lower: offsetLower[i] || NaN,
  }));
}