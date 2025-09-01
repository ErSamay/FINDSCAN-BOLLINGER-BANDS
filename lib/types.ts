export interface OHLCV {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface BollingerBandsData {
  timestamp: number;
  basis: number;
  upper: number;
  lower: number;
}

export interface BollingerBandsInputs {
  length: number;
  maType: 'SMA';
  source: 'close' | 'open' | 'high' | 'low';
  stdDevMultiplier: number;
  offset: number;
}

export interface BandStyle {
  visible: boolean;
  color: string;
  lineWidth: number;
  lineStyle: 'solid' | 'dashed';
}

export interface BollingerBandsStyle {
  basis: BandStyle;
  upper: BandStyle;
  lower: BandStyle;
  fill: {
    visible: boolean;
    opacity: number;
  };
}

export interface BollingerBandsOptions {
  inputs: BollingerBandsInputs;
  style: BollingerBandsStyle;
}