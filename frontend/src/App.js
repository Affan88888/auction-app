// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CategoryDropdown from './components/CategoryDropdown'; // Import the new CategoryDropdown component
import Body from './components/Body';
import Footer from './components/Footer';
import About from './components/About';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        {/* Container for CategoryDropdown and SearchBar */}
        <div className="search-and-categories">
          <CategoryDropdown /> {/* Kategorije button on the left */}
          <SearchBar />       {/* Search bar on the right */}
        </div>
        <Routes>
          <Route path="/" element={<Body />} />
          <Route path="/onama" element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;