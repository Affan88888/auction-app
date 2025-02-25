// src/components/HomePage/Body.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import './HomePage_css/Body.css';

function Body() {
  const [auctions, setAuctions] = useState([]); // State to store auction items
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    // Fetch auction items from the backend
    const fetchAuctions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auctions');
        if (response.ok) {
          const result = await response.json();
          setAuctions(result.auctions); // Store the fetched auctions
        } else {
          setError('Greška prilikom učitavanja aukcija.');
        }
      } catch (err) {
        setError('Došlo je do greške prilikom učitavanja aukcija.');
        console.error('Error fetching auctions:', err);
      } finally {
        setLoading(false); // Hide loading state
      }
    };

    fetchAuctions();
  }, []); // Run effect only once on component mount

  if (loading) {
    return <div className="body">Učitavanje aukcija...</div>;
  }

  if (error) {
    return <div className="body">{error}</div>;
  }

  return (
    <main className="body">
      <h2>Aktivne Aukcije</h2>
      <div className="item-list">
        {auctions.length > 0 ? (
          auctions.map((item) => (
            <div
              key={item.id}
              className="item-card"
              onClick={() => navigate(`/auction/${item.id}`)} // Navigate to auction details page
              style={{ cursor: 'pointer' }} // Change cursor to pointer
            >
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
          <p>Nema aktivnih aukcija.</p>
        )}
      </div>
    </main>
  );
}

export default Body;