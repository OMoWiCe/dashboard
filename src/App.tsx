import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchSection';
import LocationDetails from './components/LocaionDetails';
import Trends from './components/TrendsSection';
import Footer from './components/Footer';
import { Container, Box } from '@mui/material';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('Sample Location');
  const [location, setLocation] = useState('Sample Location');
  const [refreshDisabled, setRefreshDisabled] = useState(false);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(1);

  useEffect(() => {
    if (refreshDisabled) {
      const timer = setTimeout(() => setRefreshDisabled(false), 30000);
      return () => clearTimeout(timer);
    }
  }, [refreshDisabled]);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, autoRefreshInterval * 60000);
    return () => clearInterval(interval);
  }, [autoRefreshInterval]);

  const refreshData = () => {
    console.log('Data refreshed');
  };

  const handleSearch = () => {
    setLocation(searchQuery);
  };

  return (
    <Box sx={{ bgcolor: 'grey.900', color: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Container sx={{ py: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          refreshData={refreshData}
          refreshDisabled={refreshDisabled}
          setRefreshDisabled={setRefreshDisabled}
          autoRefreshInterval={autoRefreshInterval}
          setAutoRefreshInterval={setAutoRefreshInterval}
        />
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <LocationDetails location={location} />
          <Trends />
        </Box>
      </Container>
      <Footer />
    </Box>
  );
}
