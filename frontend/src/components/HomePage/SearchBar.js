import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage_css/SearchBar.css'; // Optional: Add styles for the SearchBar

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent page reload

    if (searchTerm.trim()) {
      navigate(`/search/${encodeURIComponent(searchTerm)}`); // Redirect to search results page
    } else {
      alert('Unesite pojam za pretragu.'); // Prompt user to enter a search term
    }
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