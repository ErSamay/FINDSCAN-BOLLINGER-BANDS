'use client';

import { useState, useEffect } from 'react';
import { Plus, TrendingUp } from 'lucide-react';
import Chart from '@/components/Chart';
import BollingerSettings from '@/components/BollingerSettings';
import { computeBollingerBands } from '@/lib/indicators/bollinger';
import { OHLCV, BollingerBandsData, BollingerBandsOptions } from '@/lib/types';

// Default Bollinger Bands options
const defaultBollingerOptions: BollingerBandsOptions = {
  inputs: {
    length: 20,
    maType: 'SMA',
    source: 'close',
    stdDevMultiplier: 2,
    offset: 0
  },
  style: {
    basis: {
      visible: true,
      color: '#ff9800',
      lineWidth: 1,
      lineStyle: 'solid'
    },
    upper: {
      visible: true,
      color: '#2196f3',
      lineWidth: 1,
      lineStyle: 'solid'
    },
    lower: {
      visible: true,
      color: '#2196f3',
      lineWidth: 1,
      lineStyle: 'solid'
    },
    fill: {
      visible: true,
      opacity: 0.1
    }
  }
};

export default function HomePage() {
  const [ohlcvData, setOhlcvData] = useState<OHLCV[]>([]);
  const [bollingerBands, setBollingerBands] = useState<BollingerBandsData[] | null>(null);
  const [bollingerOptions, setBollingerOptions] = useState<BollingerBandsOptions>(defaultBollingerOptions);
  const [showBollingerBands, setShowBollingerBands] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load OHLCV data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/data/ohlcv.json');
        if (!response.ok) {
          throw new Error('Failed to load OHLCV data');
        }
        const data: OHLCV[] = await response.json();
        setOhlcvData(data);
        setError(null);
      } catch (err) {
        console.error('Error loading OHLCV data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Recompute Bollinger Bands when options change
  useEffect(() => {
    if (!ohlcvData.length || !showBollingerBands) {
      setBollingerBands(null);
      return;
    }

    try {
      const bands = computeBollingerBands(ohlcvData, bollingerOptions.inputs);
      setBollingerBands(bands);
    } catch (err) {
      console.error('Error computing Bollinger Bands:', err);
      setBollingerBands(null);
    }
  }, [ohlcvData, bollingerOptions, showBollingerBands]);

  const handleAddBollingerBands = () => {
    setShowBollingerBands(true);
    setShowSettings(true);
  };

  const handleRemoveBollingerBands = () => {
    setShowBollingerBands(false);
    setBollingerBands(null);
  };

  const handleOptionsChange = (newOptions: BollingerBandsOptions) => {
    setBollingerOptions(newOptions);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading chart data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400 text-center">
          <p className="text-xl font-semibold mb-2">Error loading data</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-white">FindScan - Bollinger Bands</h1>
          </div>
          <div className="flex items-center gap-2">
            {!showBollingerBands ? (
              <button
                onClick={handleAddBollingerBands}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Bollinger Bands
              </button>
            ) : (
              <>
                <button
                  onClick={() => setShowSettings(true)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Settings
                </button>
                <button
                  onClick={handleRemoveBollingerBands}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Remove
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4">
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          {/* Chart Header */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Bitcoin/USD</h2>
                <p className="text-gray-400 text-sm">
                  {ohlcvData.length > 0 && (
                    <>
                      {new Date(ohlcvData[0].timestamp).toLocaleDateString()} - {' '}
                      {new Date(ohlcvData[ohlcvData.length - 1].timestamp).toLocaleDateString()}
                      {' '}({ohlcvData.length} candles)
                    </>
                  )}
                </p>
              </div>
              {showBollingerBands && (
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: bollingerOptions.style.basis.color }}
                    />
                    <span className="text-gray-300">Basis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: bollingerOptions.style.upper.color }}
                    />
                    <span className="text-gray-300">Upper/Lower</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chart */}
          <div style={{ height: '600px' }}>
            <Chart
              data={ohlcvData}
              bollingerBands={bollingerBands}
              bollingerOptions={showBollingerBands ? bollingerOptions : undefined}
            />
          </div>
        </div>

        {/* Info Panel */}
        <div className="mt-4 bg-gray-800 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">Chart Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Data Points:</span>
              <span className="text-white ml-2">{ohlcvData.length} candles</span>
            </div>
            <div>
              <span className="text-gray-400">Timeframe:</span>
              <span className="text-white ml-2">1 Day</span>
            </div>
            <div>
              <span className="text-gray-400">Bollinger Bands:</span>
              <span className="text-white ml-2">
                {showBollingerBands ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          
          {showBollingerBands && (
            <div className="mt-3 pt-3 border-t border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Length:</span>
                  <span className="text-white ml-2">{bollingerOptions.inputs.length}</span>
                </div>
                <div>
                  <span className="text-gray-400">MA Type:</span>
                  <span className="text-white ml-2">{bollingerOptions.inputs.maType}</span>
                </div>
                <div>
                  <span className="text-gray-400">Source:</span>
                  <span className="text-white ml-2 capitalize">{bollingerOptions.inputs.source}</span>
                </div>
                <div>
                  <span className="text-gray-400">StdDev:</span>
                  <span className="text-white ml-2">{bollingerOptions.inputs.stdDevMultiplier}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Settings Modal */}
      <BollingerSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        options={bollingerOptions}
        onChange={handleOptionsChange}
      />
    </div>
  );
}