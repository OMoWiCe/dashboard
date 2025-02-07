import React from 'react';
import { TextField, Button, MenuItem, Box } from '@mui/material';
import { Search, Refresh } from '@mui/icons-material';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  refreshData: () => void;
  refreshDisabled: boolean;
  setRefreshDisabled: (disabled: boolean) => void;
  autoRefreshInterval: number;
  setAutoRefreshInterval: (interval: number) => void;
}

export default function SearchSection({ searchQuery, setSearchQuery, handleSearch, refreshData, refreshDisabled, setRefreshDisabled, autoRefreshInterval, setAutoRefreshInterval }: SearchBarProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 4 }}>
      <TextField
        label="Search Location"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        sx={{ bgcolor: 'grey.800', input: { color: 'white' }, flex: 1 }}
      />
      <Button variant="contained" color="primary" onClick={handleSearch}><Search /></Button>
      <Button variant="contained" color="secondary" onClick={() => { refreshData(); setRefreshDisabled(true); }} disabled={refreshDisabled}>
        <Refresh /> {refreshDisabled ? 'Disabled' : 'Refresh Now'}
      </Button>
      <TextField
        select
        label="Auto Refresh"
        value={autoRefreshInterval}
        onChange={(e) => setAutoRefreshInterval(Number(e.target.value))}
        sx={{ bgcolor: 'grey.800', input: { color: 'white' } }}
      >
        <MenuItem value={1}>1 min</MenuItem>
        <MenuItem value={5}>5 min</MenuItem>
        <MenuItem value={15}>15 min</MenuItem>
        <MenuItem value={60}>1 hr</MenuItem>
      </TextField>
    </Box>
  );
}
