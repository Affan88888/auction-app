// src/components/AuctionDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './css/AuctionDetails.css'; // Optional: Add CSS for styling

function AuctionDetails() {
  const { id } = useParams(); // Get the auction ID from the URL
  const [auction, setAuction] = useState(null); // State to store auction details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Fetch auction details from the backend
    const fetchAuctionDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/auctions/${id}`);
        if (response.ok) {
          const result = await response.json();
          setAuction(result.auction); // Store the fetched auction details
        } else {
          setError('Greška prilikom učitavanja detalja aukcije.');
        }
      } catch (err) {
        setError('Došlo je do greške prilikom učitavanja detalja aukcije.');
        console.error('Error fetching auction details:', err);
      } finally {
        setLoading(false); // Hide loading state
      }
    };

    fetchAuctionDetails();
  }, [id]); // Run effect whenever the auction ID changes

  if (loading) {
    return <div className="auction-details">Učitavanje detalja aukcije...</div>;
  }

  if (error) {
    return <div className="auction-details">{error}</div>;
  }

  return (
    <div className="auction-details">
      <h2>{auction.title}</h2>
      <p><strong>Opis:</strong> {auction.description}</p>
      <p><strong>Početna cijena:</strong> ${auction.starting_price}</p>
      <p><strong>Datum završetka:</strong> {new Date(auction.end_date).toLocaleString()}</p>
      <p><strong>Broj pregleda:</strong> {auction.views || 0}</p>

      {/* Display images */}
      {auction.images && auction.images.length > 0 ? (
        <div className="auction-images">
          {auction.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={auction.title}
              className="auction-image"
            />
          ))}
        </div>
      ) : (
        <p>Nema slika za ovu aukciju.</p>
      )}

      {/* Placeholder for bid functionality */}
      <button className="bid-button">Postavi ponudu</button>
    </div>
  );
}

export default AuctionDetails;