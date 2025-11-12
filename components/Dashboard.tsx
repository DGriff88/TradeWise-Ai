
import React from 'react';
import Card from './shared/Card';
import MiniChart from './shared/MiniChart';
import { FeatureID } from '../types';

interface DashboardProps {
  onNavigate?: (id: FeatureID) => void;
}

interface Strategy {
  category: string;
  title: string;
  description: string;
  chartData: number[];
  chartType: 'line' | 'bar';
  chartColor: string;
  featureId: FeatureID;
}

const strategies: Strategy[] = [
  { category: 'STOCKS', title: 'AI Stock Picker', description: 'AI-selected top daily stocks to day trade', chartData: [5, 8, 6, 10, 7, 12, 9], chartType: 'bar', chartColor: '#25D366', featureId: 'aiScreener' },
  { category: 'STOCKS', title: 'SwingMax', description: 'Trade like a pro simply by following AI-guided signals', chartData: [3, 4, 6, 5, 8, 7, 9], chartType: 'line', chartColor: '#25D366', featureId: 'aiScreener' },
  { category: 'STOCKS', title: 'Daytrading Signal', description: 'Real-time market tracker for fast-paced day trading decisions.', chartData: [10, 8, 9, 7, 6, 8, 7], chartType: 'line', chartColor: '#25D366', featureId: 'aiScreener' },
  { category: 'AI PREDICTIONS', title: 'Prediction Signals', description: 'AI-driven price trend forecasts for the next trading session.', chartData: [7, 6, 8, 7, 9, 8, 10], chartType: 'line', chartColor: '#a78bfa', featureId: 'earningsPrediction' },
  { category: 'STOCKS & ETFs', title: 'Pattern Detection', description: 'AI-automated chart pattern detection for stocks and ETFs', chartData: [4, 5, 3, 6, 7, 5, 8], chartType: 'line', chartColor: '#f59e0b', featureId: 'chartAnalysis' },
  { category: 'AI INVESTMENT', title: 'Earnings Trading', description: 'Leverage earnings data for winning trades', chartData: [5, 8, 6, 10, 7, 12, 9], chartType: 'bar', chartColor: '#818cf8', featureId: 'earningsPrediction' },
];

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {strategies.map((strategy) => (
        <Card 
          key={strategy.title} 
          onClick={() => onNavigate?.(strategy.featureId)}
          className="hover:bg-[#30363D]/40 transition-colors duration-300 cursor-pointer group h-full"
        >
          <Card.Body>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-[#25D366] tracking-wider uppercase">{strategy.category}</p>
                <h4 className="text-lg font-bold text-white mt-1">{strategy.title}</h4>
              </div>
              <div className="w-24 h-12 opacity-70 group-hover:opacity-100 transition-opacity">
                <MiniChart data={strategy.chartData} type={strategy.chartType} color={strategy.chartColor} />
              </div>
            </div>
            <p className="text-sm text-[#8B949E] mt-3 min-h-[40px]">{strategy.description}</p>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default Dashboard;