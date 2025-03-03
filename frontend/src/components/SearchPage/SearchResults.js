// src/components/SearchResults.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../HomePage/HomePage_css/Body.css'; // Reuse styles from Body.js

function SearchResults() {
  const { query } = useParams(); // Get the search query from the URL
  const [auctions, setAuctions] = useState([]); // State to store auction items
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch search results from the backend
    const fetchSearchResults = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/search?q=${query}`);
        if (response.ok) {
          const result = await response.json();
          setAuctions(result.auctions); // Store the fetched auctions
        } else {
          setError('Greška prilikom učitavanja rezultata pretrage.');
        }
      } catch (err) {
        setError('Došlo je do greške prilikom učitavanja rezultata pretrage.');
        console.error('Error fetching search results:', err);
      } finally {
        setLoading(false); // Hide loading state
      }
    };

    fetchSearchResults();
  }, [query]); // Run effect whenever the search query changes

  if (loading) {
    return <div className="body">Učitavanje rezultata pretrage...</div>;
  }

  if (error) {
    return <div className="body">{error}</div>;
  }

  return (
    <main className="body">
      <h2>Rezultati pretrage za: "{query}"</h2>
      <div className="item-list">
        {auctions.length > 0 ? (
          auctions.map((item) => (
            <div
              key={item.id}
              className="item-card"
              onClick={() => navigate(`/auction/${item.id}`)} // Navigate to auction details page
              style={{ cursor: 'pointer' }}
            >
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p>Trenutna cijena: ${item.starting_price}</p>
              {/* Display main image */}
              {item.images && item.images.length > 0 ? (
                <img
                  src={item.images[0]} // Show the first image
                  alt={item.title}
                  className="item-image"
                />
              ) : (
                <p>Nema slika za ovu aukciju.</p>
              )}
            </div>
          ))
        ) : (
          <p>Nema rezultata za vašu pretragu.</p>
        )}
      </div>
    </main>
  );
}

export default SearchResults;