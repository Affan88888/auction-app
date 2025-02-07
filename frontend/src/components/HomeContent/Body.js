// src/components/Body.js
import React from 'react';
import './HomeContent_css/Body.css';

function Body() {
  const items = [
    { id: 1, title: "Laptop", description: "A high-performance laptop", startingBid: 500 },
    { id: 2, title: "Smartphone", description: "Latest model smartphone", startingBid: 300 },
    { id: 3, title: "Gaming Console", description: "Next-gen gaming console", startingBid: 400 },
  ];

  return (
    <main className="body">
      <h2>Featured Auction Items</h2>
      <div className="item-list">
        {items.map((item) => (
          <div key={item.id} className="item-card">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <p>Starting Bid: ${item.startingBid}</p>
            <button className="btn">Place Bid</button>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Body;