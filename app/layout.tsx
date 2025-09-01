import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FindScan - Bollinger Bands Indicator',
  description: 'Production-ready Bollinger Bands indicator built with KLineCharts',
  keywords: ['Bollinger Bands', 'Technical Analysis', 'Trading', 'KLineCharts', 'React'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}