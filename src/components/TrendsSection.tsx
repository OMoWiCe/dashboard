import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const dummyDailyData = [
  { time: '7a', occupancy: 30 },
  { time: '9a', occupancy: 45 },
  { time: '11a', occupancy: 60 },
  { time: '1p', occupancy: 80 },
  { time: '3p', occupancy: 55 },
  { time: '5p', occupancy: 40 },
  { time: '7p', occupancy: 20 },
];

const dummyWeeklyData = [
  { day: 'M', occupancy: 50 },
  { day: 'T', occupancy: 60 },
  { day: 'W', occupancy: 70 },
  { day: 'T', occupancy: 65 },
  { day: 'F', occupancy: 85 },
  { day: 'S', occupancy: 90 },
  { day: 'S', occupancy: 75 },
];

function TrendsSection() {
  return (
    <Box display="flex" gap={2} p={2}>
      <Card sx={{ flex: 1, backgroundColor: '#1d1d1d' }}>
        <CardContent>
          <Typography variant="h6">Daily Trend</Typography>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dummyDailyData}>
              <XAxis dataKey="time" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip contentStyle={{ backgroundColor: '#333', color: '#fff' }} />
              <Bar dataKey="occupancy" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card sx={{ flex: 1, backgroundColor: '#1d1d1d' }}>
        <CardContent>
          <Typography variant="h6">Weekly Trend</Typography>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dummyWeeklyData}>
              <XAxis dataKey="day" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip contentStyle={{ backgroundColor: '#333', color: '#fff' }} />
              <Bar dataKey="occupancy" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Box>
  );
}

export default TrendsSection;