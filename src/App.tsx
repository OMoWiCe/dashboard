import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchSection";
import Trends from "./components/TrendsSection";
import Footer from "./components/Footer";
import { Container, Box } from "@mui/material";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("Sample Location");
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
      console.log("Data refreshed");
    }, autoRefreshInterval * 60000);
    return () => clearInterval(interval);
  }, [autoRefreshInterval]);

  return (
    <Box
      sx={{
        bgcolor: "grey.900",
        color: "white",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />
      <Container
        sx={{ py: 4, flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={() => console.log("Search triggered")}
          refreshData={() => console.log("Data refreshed")}
          refreshDisabled={refreshDisabled}
          setRefreshDisabled={setRefreshDisabled}
          autoRefreshInterval={autoRefreshInterval}
          setAutoRefreshInterval={setAutoRefreshInterval}
        />
        <Trends />
      </Container>
      <Footer />
    </Box>
  );
}
