import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../../UserContext'; // Import the useUser hook
import PlaceBid from './PlaceBid'; // Import the PlaceBid component
import './AuctionPage_css/AuctionDetails.css'; // Import CSS for styling
import './AuctionPage_css/PlaceBid.css'; // Import PlaceBid CSS

function AuctionDetails() {
  const { id } = useParams(); // Get the auction ID from the URL
  const [auction, setAuction] = useState(null); // State to store auction details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Track the current image index
  const [countdown, setCountdown] = useState(''); // State to store the countdown timer
  const [showCountdown, setShowCountdown] = useState(false); // State to track if the countdown should be shown
  const [auctionEnded, setAuctionEnded] = useState(false); // State to track if the auction has ended dynamically
  const { user } = useUser(); // Access the logged-in user from UserContext

  useEffect(() => {
    // Fetch auction details from the backend
    const fetchAuctionDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/auctions/${id}`);
        if (response.ok) {
          const result = await response.json();
          setAuction(result.auction); // Store the fetched auction details

          // Determine if the countdown should be shown
          if (!result.auction.has_ended) {
            setShowCountdown(true); // Show countdown if the auction has not ended
          } else {
            setAuctionEnded(true); // Mark the auction as ended if `has_ended` is true
          }
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

  useEffect(() => {
    // Start the countdown when auction data is loaded
    if (auction && !auction.has_ended) {
      const endDate = new Date(auction.end_date).getTime(); // Convert end date to timestamp
      const intervalId = setInterval(() => {
        const now = new Date().getTime();
        const timeLeft = endDate - now;

        if (timeLeft > 0) {
          // Calculate total hours, minutes, and seconds
          const totalSeconds = Math.floor(timeLeft / 1000);
          const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
          const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
          const seconds = String(totalSeconds % 60).padStart(2, '0');

          // Format the countdown as HH:MM:SS
          setCountdown(`${hours}:${minutes}:${seconds}`);

          // Show countdown only if less than 24 hours remain
          if (timeLeft < 24 * 60 * 60 * 1000) {
            setShowCountdown(true);
          } else {
            setShowCountdown(false);
          }
        } else {
          // Auction has ended
          setCountdown('Aukcija je završena!');
          setShowCountdown(false); // Stop showing the countdown
          setAuctionEnded(true); // Mark the auction as ended
          clearInterval(intervalId); // Stop the countdown
        }
      }, 1000); // Update every second
      return () => clearInterval(intervalId); // Cleanup interval on unmount
    }
  }, [auction]);

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
      {/* Add Category Information */}
      <p><strong>Kategorija:</strong> {auction.category_name || 'Nepoznato'}</p>
      <p><strong>Opis:</strong> {auction.description}</p>
      <p><strong>Trenutna cijena:</strong> ${auction.current_price}</p>
      <p><strong>Datum završetka:</strong> {new Date(auction.end_date).toLocaleString()}</p>
      {/* Show countdown timer only if less than 24 hours remain */}
      {(auction.has_ended || auctionEnded) ? (
        <p className="countdown-timer"><strong>Aukcija je završena!</strong></p>
      ) : (
        showCountdown && (
          <p className="countdown-timer"><strong>Završava:</strong> {countdown}</p>
        )
      )}
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
              alt={`${auction.title} - ${currentImageIndex + 1}`}
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
      {/* Conditional rendering of the PlaceBid component */}
      {user ? (
        <PlaceBid
          auctionId={auction.id}
          user={user} // Pass the logged-in user data
          onUpdate={() => window.location.reload()} // Refresh the page after a successful bid
        />
      ) : (
        <div className="place-bid">
          <h3>Postavi ponudu</h3>
          <p className="error">
            Morate se prijaviti ili registrirati kako biste postavili ponudu.
          </p>
          <p>
            <a href="/prijava">Prijavite se</a> ili{' '}
            <a href="/registracija">registrirajte se</a>.
          </p>
        </div>
      )}
    </div>
  );
}

export default AuctionDetails;