// src/components/CategoryDropdown.js
import React, { useState } from 'react';
import './css/CategoryDropdown.css'; // Import styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList } from '@fortawesome/free-solid-svg-icons';

function CategoryDropdown() {
  const [isOpen, setIsOpen] = useState(false); // State to toggle dropdown visibility

  const toggleDropdown = () => {
    setIsOpen(!isOpen); // Toggle dropdown open/close
  };

  const categories = [
    'Elektronika',
    'Automobili',
    'Nekretnine',
    'Moda',
    'Sport',
    'Knjige',
    'Ostalo',
  ];

  return (
    <div className="category-dropdown">
      {/* Button to toggle dropdown */}
      <button className="dropdown-button" onClick={toggleDropdown}>
        <FontAwesomeIcon icon={faList} /> Kategorije
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <ul className="dropdown-menu">
          {categories.map((category, index) => (
            <li key={index} className="dropdown-item">
              <button>{category}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CategoryDropdown;