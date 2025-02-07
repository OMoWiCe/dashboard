import React from 'react';
import Header from './components/Header';
import SearchSection from './components/SearchSection';
import LocationDetails from './components/LocaionDetails';
import TrendsSection from './components/TrendsSection';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <main className="p-4">
        <SearchSection />
        <LocationDetails />
        <TrendsSection />
      </main>
      <Footer />
    </div>
  );
}