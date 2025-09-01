'use client';

import { useState } from 'react';
import { X, Settings } from 'lucide-react';
import { BollingerBandsOptions, BollingerBandsInputs } from '@/lib/types';

interface BollingerSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  options: BollingerBandsOptions;
  onChange: (options: BollingerBandsOptions) => void;
}

export default function BollingerSettings({ isOpen, onClose, options, onChange }: BollingerSettingsProps) {
  const [activeTab, setActiveTab] = useState<'inputs' | 'style'>('inputs');

  if (!isOpen) return null;

  const handleInputsChange = (field: keyof BollingerBandsInputs, value: string | number) => {
    const newInputs = { ...options.inputs, [field]: value };
    onChange({ ...options, inputs: newInputs });
  };

  const handleStyleChange = (
    band: 'basis' | 'upper' | 'lower', 
    field: string, 
    value: string | number | boolean
  ) => {
    const newStyle = {
      ...options.style,
      [band]: { ...options.style[band], [field]: value }
    };
    onChange({ ...options, style: newStyle });
  };

  const handleFillChange = (field: string, value: string | number | boolean) => {
    const newStyle = {
      ...options.style,
      fill: { ...options.style.fill, [field]: value }
    };
    onChange({ ...options, style: newStyle });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-96 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Bollinger Bands Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('inputs')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'inputs'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Inputs
          </button>
          <button
            onClick={() => setActiveTab('style')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'style'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Style
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-96 overflow-y-auto">
          {activeTab === 'inputs' && (
            <div className="space-y-4">
              {/* Length */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Length
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={options.inputs.length}
                  onChange={(e) => handleInputsChange('length', parseInt(e.target.value) || 20)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Basic MA Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Basic MA Type
                </label>
                <select
                  value={options.inputs.maType}
                  onChange={(e) => handleInputsChange('maType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="SMA">SMA</option>
                </select>
              </div>

              {/* Source */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source
                </label>
                <select
                  value={options.inputs.source}
                  onChange={(e) => handleInputsChange('source', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="close">Close</option>
                  <option value="open">Open</option>
                  <option value="high">High</option>
                  <option value="low">Low</option>
                </select>
              </div>

              {/* StdDev Multiplier */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  StdDev (multiplier)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="10"
                  value={options.inputs.stdDevMultiplier}
                  onChange={(e) => handleInputsChange('stdDevMultiplier', parseFloat(e.target.value) || 2)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Offset */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Offset
                </label>
                <input
                  type="number"
                  min="-50"
                  max="50"
                  value={options.inputs.offset}
                  onChange={(e) => handleInputsChange('offset', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {activeTab === 'style' && (
            <div className="space-y-6">
              {/* Basic (Middle Band) */}
              <div className="border border-gray-200 rounded-lg p-3">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Basic (Middle Band)</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={options.style.basis.visible}
                      onChange={(e) => handleStyleChange('basis', 'visible', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Visible</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">Color</label>
                      <input
                        type="color"
                        value={options.style.basis.color}
                        onChange={(e) => handleStyleChange('basis', 'color', e.target.value)}
                        className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">Width</label>
                      <select
                        value={options.style.basis.lineWidth}
                        onChange={(e) => handleStyleChange('basis', 'lineWidth', parseInt(e.target.value))}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">Style</label>
                      <select
                        value={options.style.basis.lineStyle}
                        onChange={(e) => handleStyleChange('basis', 'lineStyle', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      >
                        <option value="solid">Solid</option>
                        <option value="dashed">Dashed</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upper Band */}
              <div className="border border-gray-200 rounded-lg p-3">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Upper Band</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={options.style.upper.visible}
                      onChange={(e) => handleStyleChange('upper', 'visible', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Visible</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">Color</label>
                      <input
                        type="color"
                        value={options.style.upper.color}
                        onChange={(e) => handleStyleChange('upper', 'color', e.target.value)}
                        className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">Width</label>
                      <select
                        value={options.style.upper.lineWidth}
                        onChange={(e) => handleStyleChange('upper', 'lineWidth', parseInt(e.target.value))}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">Style</label>
                      <select
                        value={options.style.upper.lineStyle}
                        onChange={(e) => handleStyleChange('upper', 'lineStyle', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      >
                        <option value="solid">Solid</option>
                        <option value="dashed">Dashed</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lower Band */}
              <div className="border border-gray-200 rounded-lg p-3">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Lower Band</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={options.style.lower.visible}
                      onChange={(e) => handleStyleChange('lower', 'visible', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Visible</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">Color</label>
                      <input
                        type="color"
                        value={options.style.lower.color}
                        onChange={(e) => handleStyleChange('lower', 'color', e.target.value)}
                        className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">Width</label>
                      <select
                        value={options.style.lower.lineWidth}
                        onChange={(e) => handleStyleChange('lower', 'lineWidth', parseInt(e.target.value))}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600 mb-1">Style</label>
                      <select
                        value={options.style.lower.lineStyle}
                        onChange={(e) => handleStyleChange('lower', 'lineStyle', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                      >
                        <option value="solid">Solid</option>
                        <option value="dashed">Dashed</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Background Fill */}
              <div className="border border-gray-200 rounded-lg p-3">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Background Fill</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={options.style.fill.visible}
                      onChange={(e) => handleFillChange('visible', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Visible</span>
                  </label>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Opacity ({Math.round(options.style.fill.opacity * 100)}%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={options.style.fill.opacity}
                      onChange={(e) => handleFillChange('opacity', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}