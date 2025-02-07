import { useState, useEffect } from "react";
import { Button, Input } from "@mui/material";
import { Search, RefreshCw } from "lucide-react";

export default function SearchSection() {
  const [searchQuery, setSearchQuery] = useState("");
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
    console.log("Data refreshed");
  };

  const handleSearch = () => {
    console.log("Search for:", searchQuery);
  };

  return (
    <div className="flex items-center space-x-2 mb-4">
      <Input
        placeholder="Search location"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Button onClick={handleSearch}>
        <Search />
      </Button>
      <Button
        onClick={() => {
          refreshData();
          setRefreshDisabled(true);
        }}
        disabled={refreshDisabled}
      >
        <RefreshCw /> {refreshDisabled ? "Disabled" : "Refresh Now"}
      </Button>
      <select
        className="p-2 rounded bg-gray-800 text-white"
        value={autoRefreshInterval}
        onChange={(e) => setAutoRefreshInterval(Number(e.target.value))}
      >
        <option value={1}>1 min</option>
        <option value={5}>5 min</option>
        <option value={15}>15 min</option>
        <option value={60}>1 hr</option>
      </select>
    </div>
  );
}
