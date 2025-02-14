// src/components/ActiveAuctions.js
import React, { useEffect, useState } from 'react';
import './css/ActiveAuctions.css'; // Optional: Add CSS for styling

function ActiveAuctions() {
  const [auctions, setAuctions] = useState([]); // State to store active auctions
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Fetch active auctions from the backend
    const fetchAuctions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auctions');
        if (response.ok) {
          const result = await response.json();
          setAuctions(result.auctions); // Store the fetched auctions
        } else {
          setError('Greška prilikom učitavanja aktivnih aukcija.');
        }
      } catch (err) {
        setError('Došlo je do greške prilikom učitavanja aktivnih aukcija.');
        console.error('Error fetching active auctions:', err);
      } finally {
        setLoading(false); // Hide loading state
      }
    };

    fetchAuctions();
  }, []); // Run effect only once on component mount

  // Handle deleting an auction
  const handleDelete = async (auctionId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/auctions/${auctionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Aukcija uspješno izbrisana!');
        // Remove the deleted auction from the state
        setAuctions((prevAuctions) => prevAuctions.filter((auction) => auction.id !== auctionId));
      } else {
        alert('Došlo je do greške prilikom brisanja aukcije.');
      }
    } catch (error) {
      console.error('Error deleting auction:', error);
      alert('Došlo je do greške prilikom brisanja aukcije.');
    }
  };

  if (loading) {
    return <div className="active-auctions">Učitavanje aktivnih aukcija...</div>;
  }

  if (error) {
    return <div className="active-auctions">{error}</div>;
  }

  return (
    <div className="active-auctions">
      <h3>Aktivne Aukcije</h3>
      <table className="auctions-table">
        <thead>
          <tr>
            <th>Naslov</th>
            <th>Opis</th>
            <th>Početna cijena</th>
            <th>Datum završetka</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          {auctions.length > 0 ? (
            auctions.map((auction) => (
              <tr key={auction.id}>
                <td>{auction.title}</td>
                <td>{auction.description}</td>
                <td>${auction.starting_price}</td>
                <td>{new Date(auction.end_date).toLocaleString()}</td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(auction.id)}
                  >
                    Izbriši
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Nema aktivnih aukcija.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ActiveAuctions;