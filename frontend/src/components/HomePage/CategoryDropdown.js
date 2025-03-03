import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './HomePage_css/CategoryDropdown.css';

function CategoryDropdown() {
  const [categories, setCategories] = useState([]); // State to store categories
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [isOpen, setIsOpen] = useState(false); // State to toggle dropdown visibility
  const navigate = useNavigate(); // To navigate to categories

  useEffect(() => {
    // Fetch categories from the backend
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/categories');
        if (response.ok) {
          const result = await response.json();
          setCategories(result.categories); // Store the fetched categories
        } else {
          setError('Greška prilikom učitavanja kategorija.');
        }
      } catch (err) {
        setError('Došlo je do greške prilikom učitavanja kategorija.');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false); // Hide loading state
      }
    };

    fetchCategories();
  }, []); // Run effect only once on component mount

  const toggleDropdown = () => {
    setIsOpen(!isOpen); // Toggle dropdown open/close
  };

  return (
    <div className="category-dropdown">
      {/* Button to toggle dropdown */}
      <button className="dropdown-button" onClick={toggleDropdown}>
        <FontAwesomeIcon icon={faList} /> Kategorije
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <ul className="dropdown-menu">
          {loading ? (
            <li>Učitavanje kategorija...</li>
          ) : error ? (
            <li>{error}</li>
          ) : (
            categories.map((category) => (
              <li key={category.id} className="dropdown-item">
                <button onClick={() => navigate(`/${category.name}`)}>{category.name}</button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

export default CategoryDropdown;