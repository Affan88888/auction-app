// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Body from './components/Body';
import Footer from './components/Footer';
import About from './components/About'; // Import the new About component
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Body />} />
          <Route path="/onama" element={<About />} /> {/* Route for the About page */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;