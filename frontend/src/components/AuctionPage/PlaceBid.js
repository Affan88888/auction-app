// src/components/PlaceBid.js
import React, { useState } from 'react';

function PlaceBid({ auctionId, user, onUpdate }) {
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePlaceBid = async () => {
    if (!bidAmount || isNaN(bidAmount)) {
      setError('Unesite važeći iznos za ponudu.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/place-bid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auction_id: auctionId,
          user_id: user.id, // Assuming you have the logged-in user's ID
          bid_amount: parseFloat(bidAmount),
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccess(result.message);
        setError('');
        setBidAmount('');
        onUpdate(); // Trigger a callback to update the UI (e.g., refresh the auction details)
      } else {
        setError(result.error || 'Došlo je do greške prilikom postavljanja ponude.');
        setSuccess('');
      }
    } catch (error) {
      console.error('Error placing bid:', error);
      setError('Došlo je do greške prilikom postavljanja ponude.');
      setSuccess('');
    }
  };

  return (
    <div className="place-bid">
      <h3>Postavi ponudu</h3>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <input
        type="number"
        placeholder="Unesite iznos ponude"
        value={bidAmount}
        onChange={(e) => setBidAmount(e.target.value)}
      />
      <button onClick={handlePlaceBid} disabled={!bidAmount}>
        Postavi ponudu
      </button>
    </div>
  );
}

export default PlaceBid;