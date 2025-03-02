// src/components/CategoryAuctions.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './HomePage/HomePage_css/Body.css';

function CategoryAuctions() {
  const { categoryName } = useParams(); // Get the category name from the URL
  const [auctions, setAuctions] = useState([]); // State to store auction items
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Fetch auctions for the specific category
    const fetchCategoryAuctions = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/auctions/category/${categoryName}`);
        if (response.ok) {
          const result = await response.json();
          setAuctions(result.auctions); // Store the fetched auctions
        } else {
          setError('Greška prilikom učitavanja aukcija.');
        }
      } catch (err) {
        setError('Došlo je do greške prilikom učitavanja aukcija.');
        console.error('Error fetching category auctions:', err);
      } finally {
        setLoading(false); // Hide loading state
      }
    };

    fetchCategoryAuctions();
  }, [categoryName]); // Run effect whenever the category name changes

  if (loading) {
    return <div className="body">Učitavanje aukcija...</div>;
  }

  if (error) {
    return <div className="body">{error}</div>;
  }

  return (
    <main className="body">
      <h2>Aukcije u kategoriji: {categoryName}</h2>
      <div className="item-list">
        {auctions.length > 0 ? (
          auctions.map((item) => (
            <div key={item.id} className="item-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p>Trenutna cijena: ${item.current_price}</p>
              {/* Display main image */}
              {item.main_image_url ? (
                <img
                  src={item.main_image_url}
                  alt={item.title}
                  className="item-image"
                />
              ) : (
                <p>Nema glavne slike za ovu aukciju.</p>
              )}
            </div>
          ))
        ) : (
          <p>Nema aktivnih aukcija u ovoj kategoriji.</p>
        )}
      </div>
    </main>
  );
}

export default CategoryAuctions;