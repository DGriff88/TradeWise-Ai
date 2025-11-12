
import React from 'react';

interface MiniChartProps {
  data: number[];
  type: 'line' | 'bar';
  color: string;
}

const MiniChart: React.FC<MiniChartProps> = ({ data, type, color }) => {
  const width = 100;
  const height = 40;
  const maxVal = Math.max(...data, 0);
  const minVal = Math.min(...data, 0);
  const range = maxVal - minVal;

  const getY = (val: number) => {
    if (range === 0) return height / 2;
    return height - ((val - minVal) / range) * height;
  };

  if (type === 'line') {
    const points = data.map((d, i) => `${(i / (data.length - 1)) * width},${getY(d)}`).join(' ');
    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
        <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={points} />
      </svg>
    );
  }

  if (type === 'bar') {
    const barWidth = width / data.length;
    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
        {data.map((d, i) => (
          <rect
            key={i}
            x={(i * barWidth) + 1}
            y={getY(d)}
            width={barWidth - 2}
            height={height - getY(d)}
            fill={color}
            rx="1"
          />
        ))}
      </svg>
    );
  }

  return null;
};

export default MiniChart;
