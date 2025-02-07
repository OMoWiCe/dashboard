import React from 'react';
import Header from './Header';
import SearchSection from './SearchSection';
import LocationDetails from './LocationDetails';
import TrendsSection from './TrendsSection';
import Footer from './Footer';

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