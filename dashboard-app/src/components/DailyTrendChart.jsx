import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const DailyTrendChart = () => {
  const dailyTrendData = [
    { time: '7a', count: 50 },
    { time: '9a', count: 75 },
    { time: '11a', count: 90 },
    { time: '1p', count: 60 },
    { time: '3p', count: 120 },
    { time: '5p', count: 80 },
    { time: '7p', count: 70 },
  ];

  return (
    <div className="chart-container">
      <h3 className="chart-title">Daily Trend</h3>
      <LineChart width={600} height={300} data={dailyTrendData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </div>
  );
};

export default DailyTrendChart;