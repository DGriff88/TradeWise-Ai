import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TimeSeriesDataPoint } from '../types';
import { fetchTimeSeriesDaily } from '../services/alphaVantageService';
import Loader from './shared/Loader';

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const formattedDate = new Date(label).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return (
      <div className="bg-[#0D1117]/80 backdrop-blur-sm p-3 border border-[#30363D] rounded-lg shadow-lg">
        <p className="label text-sm text-[#8B949E]">{formattedDate}</p>
        <p className="intro text-[#25D366] font-bold">{`Close Price : $${payload[0].value.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};

interface StockChartProps {
    symbol: string;
}

const StockChart: React.FC<StockChartProps> = ({ symbol }) => {
    const [data, setData] = useState<TimeSeriesDataPoint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            setError('');
            try {
                const result = await fetchTimeSeriesDaily(symbol);
                setData(result);
            } catch (err) {
                setError('Failed to load chart data. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        if (symbol) {
            loadData();
        }
    }, [symbol]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-[300px]"><Loader /></div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-[300px] text-red-400">{error}</div>;
    }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#25D366" stopOpacity={0.7} />
              <stop offset="95%" stopColor="#25D366" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
          <XAxis 
            dataKey="date" 
            stroke="#8B949E" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(str) => {
                const date = new Date(str);
                return `${date.toLocaleString('default', { month: 'short' })} '${date.getFullYear().toString().slice(-2)}`;
            }}
          />
          <YAxis 
            stroke="#8B949E" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `$${value}`}
            domain={['dataMin - 10', 'dataMax + 10']}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="close" stroke="#25D366" fillOpacity={1} fill="url(#colorPrice)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
