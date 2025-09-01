# Bollinger Bands Indicator

A professional-grade Bollinger Bands technical analysis tool built with Next.js, TypeScript, and KLineCharts. Features a TradingView-inspired interface with real-time parameter adjustments and interactive charting capabilities.

## Features

- **Complete Bollinger Bands Implementation** with customizable parameters
- **Professional Settings Panel** with separate Inputs and Style configuration tabs
- **Real-time Chart Updates** when adjusting any parameter
- **Interactive Crosshair Tooltips** displaying OHLCV data and Bollinger values
- **Fully Customizable Styling** including colors, line styles, and fill opacity
- **Modern Dark Theme** optimized for financial data visualization
- **Type-Safe TypeScript** implementation throughout

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn package manager

### Installation

1. **Clone or download the project**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Start development server**:
   ```bash
   npm run dev
   ```
4. **Open in browser**: Navigate to `http://localhost:3000`



## Usage

### Adding Bollinger Bands
1. Click the **"Add Bollinger Bands"** button
2. Configure parameters in the **Inputs** tab:
   - **Length**: Period for moving average calculation (1-100)
   - **Source**: Price source (Close, Open, High, Low)
   - **StdDev Multiplier**: Standard deviation multiplier (0.1-10.0)
   - **Offset**: Shift bands by number of bars (-50 to +50)

### Customizing Appearance
1. Switch to the **Style** tab
2. Configure each band (Upper, Basis, Lower):
   - Toggle visibility
   - Select colors
   - Adjust line width (1-4px)
   - Choose line style (solid/dashed)
3. Configure background fill opacity

### Chart Interaction
- **Hover**: View detailed OHLCV and indicator values
- **Zoom**: Mouse wheel to zoom in/out
- **Pan**: Click and drag to navigate
- **Real-time Updates**: All changes reflect immediately

## Technical Specifications

### Bollinger Bands Formula
- **Basis (Middle Band)**: Simple Moving Average of source price
- **Upper Band**: Basis + (Multiplier × Standard Deviation)
- **Lower Band**: Basis - (Multiplier × Standard Deviation)
- **Standard Deviation**: Sample standard deviation (N-1 denominator)

### Default Parameters
- Length: 20 periods
- Source: Close price
- StdDev Multiplier: 2.0
- Offset: 0 bars

## Data Format

The application expects OHLCV data in JSON format:

```json
[
  {
    "timestamp": 1640995200000,
    "open": 46222.05,
    "high": 47143.98,
    "low": 45637.54,
    "close": 46306.45,
    "volume": 28394.55
  }
]
```



## Dependencies

### Core Dependencies
- **Next.js 14+**: React framework
- **React 18+**: UI library
- **TypeScript**: Type safety
- **TailwindCSS**: Utility-first CSS framework
- **KLineCharts v9.8.5**: Professional charting library

### Dev Dependencies
- TypeScript compiler
- ESLint configuration
- PostCSS for Tailwind processing

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Optimized for datasets with 200-1000 candles
- Real-time parameter updates with minimal latency
- Efficient memory usage with proper cleanup
- Smooth interactions at 60fps

## Customization

### Adding MA Types
Extend the indicator by modifying `lib/indicators/bollinger.ts` to support EMA, WMA, or other moving averages.

### Theme Customization
Update color schemes in `tailwind.config.js` and component styling.

### Additional Indicators
The chart architecture supports adding more technical indicators following the established pattern.

## API Reference

### BollingerBands Component Props
```typescript
interface BollingerBandsSettings {
  length: number;           // Period length (1-100)
  source: 'close' | 'open' | 'high' | 'low';
  stddevMultiplier: number; // Multiplier (0.1-10.0)
  offset: number;          // Bar offset (-50 to +50)
  visible: boolean;        // Show/hide indicator
  // Style properties for each band...
}
```

### Chart Component Props
```typescript
interface ChartProps {
  data: OHLCVData[];       // OHLCV candle data
  bollinger?: BollingerBandsSettings;
  onBollingerChange?: (settings: BollingerBandsSettings) => void;
}
```

## Known Limitations

- Mobile touch interactions may need optimization for production use
- Large datasets (>1000 candles) may experience slight performance degradation
- Currently supports SMA only (EMA/WMA can be added as enhancement)

## License

MIT License - See LICENSE file for details

## Support

For technical questions or integration support:
- Review the [KLineCharts documentation](https://klinecharts.com/en-US/)
- Check [Next.js documentation](https://nextjs.org/docs)
- Refer to [TailwindCSS documentation](https://tailwindcss.com/docs)

---

**Built with ❤️ for professional financial data visualization**