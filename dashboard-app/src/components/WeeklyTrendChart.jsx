import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const WeeklyTrendChart = () => {
  const weeklyTrendData = [
    { day: 'M', count: 400 },
    { day: 'T', count: 300 },
    { day: 'W', count: 500 },
    { day: 'T', count: 450 },
    { day: 'F', count: 600 },
    { day: 'S', count: 700 },
    { day: 'S', count: 500 },
  ];

  return (
    <div className="chart-container">
      <h3 className="chart-title">Weekly Trend</h3>
      <BarChart width={600} height={300} data={weeklyTrendData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#82ca9d" />
      </BarChart>
    </div>
  );
};

export default WeeklyTrendChart;