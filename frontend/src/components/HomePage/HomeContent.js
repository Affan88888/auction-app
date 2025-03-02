// src/components/HomeContent.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from './SearchBar';
import CategoryDropdown from './CategoryDropdown';
import CategoryIcons from './CategoryIcons';

function HomeContent({ children }) {
  const location = useLocation(); // Get the current location

  return (
    <div>
      {/* Conditionally render the search bar and category dropdown only on the home page */}
      {location.pathname === '/' && (
        <div className="search-and-categories">
          <CategoryDropdown />
          <SearchBar />
          <CategoryIcons />
        </div>
      )}
      {/* Render the main content (children) */}
      {children}
    </div>
  );
}

export default HomeContent;