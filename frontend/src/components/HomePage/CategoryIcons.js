// src/components/CategoryIcons.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage_css/CategoryIcons.css';

function CategoryIcons() {
  const [categories, setCategories] = useState([]); // State to store categories
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate(); // For navigation

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

  if (loading) {
    return <div>Učitavanje kategorija...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="category-icons">
      {categories.map((category) => (
        <div
          key={category.id}
          className="category-icon"
          onClick={() => navigate(`/${category.name}`)} // Navigate to category-specific page
        >
          <span>{category.name}</span>
        </div>
      ))}
    </div>
  );
}

export default CategoryIcons;