import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Components
function Home() {
  return (
    <div className="home">
      <h1>Welcome to the Auction Website</h1>
      <p>Browse items and place bids!</p>
      <Link to="/items" className="btn btn-primary">
        View Items
      </Link>
    </div>
  );
}

function ItemsList() {
  const items = [
    { id: 1, title: "Laptop", description: "A high-performance laptop", startingBid: 500 },
    { id: 2, title: "Smartphone", description: "Latest model smartphone", startingBid: 300 },
    { id: 3, title: "Gaming Console", description: "Next-gen gaming console", startingBid: 400 },
  ];

  return (
    <div className="items-list">
      <h2>Available Items for Auction</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id} className="item-card">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <p>Starting Bid: ${item.startingBid}</p>
            <button className="btn btn-secondary">Place Bid</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <h2>Auction Website</h2>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/items">Items</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/items" element={<ItemsList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;