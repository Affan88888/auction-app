// src/components/AuctionDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './css/AuctionDetails.css'; // Optional: Add CSS for styling

function AuctionDetails() {
  const { id } = useParams(); // Get the auction ID from the URL
  const [auction, setAuction] = useState(null); // State to store auction details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Track the current image index

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

  // Handle navigation to the next image
  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === auction.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Handle navigation to the previous image
  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? auction.images.length - 1 : prevIndex - 1
    );
  };

  // Handle clicking on a thumbnail to set it as the current image
  const selectThumbnail = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="auction-details">
      <h2>{auction.title}</h2>
      <p><strong>Opis:</strong> {auction.description}</p>
      <p><strong>Početna cijena:</strong> ${auction.starting_price}</p>
      <p><strong>Datum završetka:</strong> {new Date(auction.end_date).toLocaleString()}</p>
      <p><strong>Broj pregleda:</strong> {auction.views || 0}</p>

      {/* Image slider */}
      {auction.images && auction.images.length > 0 ? (
        <>
          <div className="image-slider">
            <button className="arrow-button left-arrow" onClick={goToPreviousImage}>
              &#10094;
            </button>
            <img
              src={auction.images[currentImageIndex]}
              alt={`${auction.title} - Image ${currentImageIndex + 1}`}
              className="auction-image"
            />
            <button className="arrow-button right-arrow" onClick={goToNextImage}>
              &#10095;
            </button>
          </div>

          {/* Thumbnail row */}
          <div className="thumbnail-row">
            {auction.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${auction.title} - Thumbnail ${index + 1}`}
                className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                onClick={() => selectThumbnail(index)}
              />
            ))}
          </div>
        </>
      ) : (
        <p>Nema slika za ovu aukciju.</p>
      )}

      {/* Placeholder for bid functionality */}
      <button className="bid-button">Postavi ponudu</button>
    </div>
  );
}

export default AuctionDetails;