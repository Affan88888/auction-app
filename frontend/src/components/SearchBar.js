// src/components/SearchBar.js
import React, { useState } from 'react';
import './css/SearchBar.css'; // Optional: Add styles for the SearchBar

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent page reload
    console.log('Searching for:', searchTerm); // Replace this with actual search logic later
    // You can integrate this with your backend API to fetch filtered results
  };

  return (
    <section className="search-bar">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Pretražite artikle..."
          value={searchTerm}
          onChange={handleInputChange}
        />
        <button type="submit">Pretraži</button>
      </form>
    </section>
  );
}

export default SearchBar;