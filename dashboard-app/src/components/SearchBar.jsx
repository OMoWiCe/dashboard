import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectItem } from '@/components/ui/select';
import { Search, RefreshCw } from 'lucide-react';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshDisabled, setRefreshDisabled] = useState(false);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(1);

  const handleRefresh = () => {
    setRefreshDisabled(true);
    setTimeout(() => setRefreshDisabled(false), 30000);
  };

  return (
    <div className="search-bar">
      <Input
        placeholder="Search location"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      <Button className="search-button"><Search className="icon" /></Button>
      <Button onClick={handleRefresh} disabled={refreshDisabled} className="refresh-button">
        <RefreshCw className="icon" /> Refresh Now
      </Button>
      <Select
        value={autoRefreshInterval}
        onValueChange={(val) => setAutoRefreshInterval(parseInt(val))}
        className="refresh-select"
      >
        <SelectItem value={1}>1 min</SelectItem>
        <SelectItem value={5}>5 min</SelectItem>
        <SelectItem value={15}>15 min</SelectItem>
        <SelectItem value={60}>1 hr</SelectItem>
      </Select>
    </div>
  );
};

export default SearchBar;