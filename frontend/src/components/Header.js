// src/components/Header.js
import React from 'react';
import './css/Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faUserPlus, faSignInAlt, faHome } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom'; // Import Link for navigation

function Header() {
  return (
    <header className="header">
      {/* Logo and Title */}
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h1>AukcijeBH</h1>
      </Link>

      {/* Navigation Menu */}
      <nav>
        <ul>
          {/* Home Link */}
          <li>
            <Link to="/">
              <FontAwesomeIcon icon={faHome} /> Početna
            </Link>
          </li>

          {/* About Us Link */}
          <li>
            <Link to="/onama">
              <FontAwesomeIcon icon={faInfoCircle} /> O nama
            </Link>
          </li>

          {/* Registration Link */}
          <li>
            <Link to="/registracija">
              <FontAwesomeIcon icon={faUserPlus} /> Registracija
            </Link>
          </li>

          {/* Login Link */}
          <li>
            <Link to="/prijava">
              <FontAwesomeIcon icon={faSignInAlt} /> Prijava
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;