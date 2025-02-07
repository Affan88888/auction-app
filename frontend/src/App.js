// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import About from './components/About';
import Register from './components/Register';
import Body from './components/HomeContent/Body';
import HomeContent from './components/HomeContent/HomeContent'; // Import the new HomeContent component
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        {/* Wrap the home page route with HomeContent */}
        <Routes>
          <Route
            path="/"
            element={
              <HomeContent>
                <Body />
              </HomeContent>
            }
          />
          <Route path="/onama" element={<About />} />
          <Route path="/registracija" element={<Register />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;