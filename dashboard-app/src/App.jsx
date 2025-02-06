import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import LocationCard from './components/LocationCard';
import DailyTrendChart from './components/DailyTrendChart';
import WeeklyTrendChart from './components/WeeklyTrendChart';
import Footer from './components/Footer';
import DisclaimerPopup from './components/DisclaimerPopup';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <SearchBar />
                <LocationCard />
                <DailyTrendChart />
                <WeeklyTrendChart />
              </>
            }
          />
        </Routes>
        <Footer />
        <DisclaimerPopup />
      </div>
    </Router>
  );
};

export default App;