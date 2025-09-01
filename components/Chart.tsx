'use client';

import { useEffect, useRef } from 'react';
import { init, dispose } from 'klinecharts';
import { OHLCV, BollingerBandsData, BollingerBandsOptions } from '@/lib/types';

// Type definitions for KLineCharts - using library's actual types
type Chart = import('klinecharts').Chart;

interface ChartData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface ChartProps {
  data: OHLCV[];
  bollingerBands?: BollingerBandsData[] | null;
  bollingerOptions?: BollingerBandsOptions;
  className?: string;
}

export default function Chart({ data, bollingerBands, bollingerOptions, className = '' }: ChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize chart with minimal configuration
    chartInstance.current = init(chartRef.current);

    // Clean up on unmount
    return () => {
      if (chartInstance.current && chartRef.current) {
        dispose(chartRef.current);
        chartInstance.current = null;
      }
    };
  }, []);

  // Update chart data
  useEffect(() => {
    if (!chartInstance.current || !data.length) return;

    // Convert OHLCV data to KLineCharts format
    const chartData: ChartData[] = data.map(candle => ({
      timestamp: candle.timestamp,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
      volume: candle.volume
    }));

    chartInstance.current.applyNewData(chartData);
  }, [data]);

  // Add Bollinger Bands as overlay lines
  useEffect(() => {
    if (!chartInstance.current || !bollingerBands || !bollingerOptions) {
      return;
    }

    try {
      // Create technical indicator for Bollinger Bands
      // Using the library's expected format and suppressing type checking for complex library types
      const indicator = {
        name: 'BOLL',
        calcParams: [20, 2], // length, multiplier
        plots: [
          { key: 'upper', title: 'Upper', type: 'line' },
          { key: 'mid', title: 'Mid', type: 'line' },
          { key: 'lower', title: 'Lower', type: 'line' }
        ],
        calc: () => {
          return bollingerBands.map(bb => ({
            upper: isNaN(bb.upper) ? null : bb.upper,
            mid: isNaN(bb.basis) ? null : bb.basis,
            lower: isNaN(bb.lower) ? null : bb.lower
          }));
        },
        draw: ({ ctx, visibleRange, indicator, xAxis, yAxis }: {
          ctx: CanvasRenderingContext2D;
          visibleRange: { from: number; to: number };
          indicator: { result: Array<{ upper: number | null; mid: number | null; lower: number | null }> };
          xAxis: { convertToPixel: (value: number) => number };
          yAxis: { convertToPixel: (value: number) => number };
        }) => {
          if (!indicator.result || !indicator.result.length) return;

          const { from, to } = visibleRange;
          const { style } = bollingerOptions;

          // Draw lines
          (['upper', 'mid', 'lower'] as const).forEach(key => {
            const styleKey = key === 'mid' ? 'basis' : key;
            const lineStyle = style[styleKey as 'basis' | 'upper' | 'lower'];
            
            if (!lineStyle.visible) return;

            ctx.strokeStyle = lineStyle.color;
            ctx.lineWidth = lineStyle.lineWidth;
            ctx.setLineDash(lineStyle.lineStyle === 'dashed' ? [5, 5] : []);
            
            ctx.beginPath();
            let started = false;
            
            for (let i = from; i < to; i++) {
              const data = indicator.result[i];
              if (!data || data[key] === null) continue;
              
              const x = xAxis.convertToPixel(i);
              const y = yAxis.convertToPixel(data[key] as number);
              
              if (!started) {
                ctx.moveTo(x, y);
                started = true;
              } else {
                ctx.lineTo(x, y);
              }
            }
            
            ctx.stroke();
            ctx.setLineDash([]);
          });

          // Draw fill area
          if (style.fill.visible) {
            ctx.globalAlpha = style.fill.opacity;
            ctx.fillStyle = style.upper.color + '30';
            
            ctx.beginPath();
            let started = false;
            
            // Upper line
            for (let i = from; i < to; i++) {
              const data = indicator.result[i];
              if (!data || data.upper === null) continue;
              
              const x = xAxis.convertToPixel(i);
              const y = yAxis.convertToPixel(data.upper);
              
              if (!started) {
                ctx.moveTo(x, y);
                started = true;
              } else {
                ctx.lineTo(x, y);
              }
            }
            
            // Lower line (reverse)
            for (let i = to - 1; i >= from; i--) {
              const data = indicator.result[i];
              if (!data || data.lower === null) continue;
              
              const x = xAxis.convertToPixel(i);
              const y = yAxis.convertToPixel(data.lower);
              ctx.lineTo(x, y);
            }
            
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 1;
          }

          return true; // KLineCharts expects a boolean return value
        }
      };

      // Remove existing and create new indicator
      chartInstance.current.removeIndicator('main', 'BOLL');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      chartInstance.current.createIndicator(indicator as any, false);

    } catch (error) {
      console.warn('Bollinger Bands rendering error:', error);
    }
  }, [bollingerBands, bollingerOptions]);

  return (
    <div 
      ref={chartRef} 
      className={`w-full h-full bg-gray-900 ${className}`}
      style={{ minHeight: '400px' }}
    />
  );
}