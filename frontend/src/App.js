// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import About from './components/About';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import NapraviAukciju from './components/AdminPage/NapraviAukciju';
import Body from './components/HomePage/Body';
import CategoryIcons from './components/HomePage/CategoryIcons';
import HomeContent from './components/HomePage/HomeContent';
import AuctionDetails from './components/AuctionPage/AuctionDetails';
import CategoryAuctions from './components/CategoryPage/CategoryAuctions';
import SearchResults from './components/SearchResults';
import { UserProvider } from './UserContext';
import './App.css';

function App() {
  return (
    <Router>
      <UserProvider> {/* Wrap the app with UserProvider */}
        <div className="app">
          <Header />
          <Routes>
            <Route
              path="/"
              element={
                <HomeContent>
                  <CategoryIcons />
                  <Body />
                </HomeContent>
              }
            />
            <Route path="/o-nama" element={<About />} />
            <Route path="/registracija" element={<Register />} />
            <Route path="/prijava" element={<Login />} />
            <Route path="/moj-profil" element={<Profile />} />
            <Route path="/admin-stranica" element={<NapraviAukciju />} />
            <Route path="/auction/:id" element={<AuctionDetails />} />
            <Route path="/:categoryName" element={<CategoryAuctions />} />
            <Route path="/search/:query" element={<SearchResults />} />
          </Routes>
          <Footer />
        </div>
      </UserProvider>
    </Router>
  );
}

export default App;