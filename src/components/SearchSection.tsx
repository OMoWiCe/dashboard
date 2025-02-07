import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, MenuItem } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';

function SearchSection() {
  const [searchQuery, setSearchQuery] = useState('');
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
    console.log(`Searching for ${searchQuery}`);
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" gap={2} p={2}>
      <TextField 
        label="Search location" 
        variant="outlined" 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)} 
        InputProps={{ endAdornment: <SearchIcon /> }} 
      />
      <Button variant="contained" onClick={handleSearch}>Search</Button>
      <Button variant="contained" onClick={() => { refreshData(); setRefreshDisabled(true); }} disabled={refreshDisabled}>
        <RefreshIcon /> {refreshDisabled ? 'Disabled' : 'Refresh Now'}
      </Button>
      <TextField
        select
        label="Auto Refresh"
        value={autoRefreshInterval}
        onChange={(e) => setAutoRefreshInterval(Number(e.target.value))}
        variant="outlined"
      >
        <MenuItem value={1}>1 min</MenuItem>
        <MenuItem value={5}>5 min</MenuItem>
        <MenuItem value={15}>15 min</MenuItem>
        <MenuItem value={60}>1 hr</MenuItem>
      </TextField>
    </Box>
  );
}

export default SearchSection;