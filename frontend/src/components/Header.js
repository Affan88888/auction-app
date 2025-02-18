// src/components/Header.js
import React from 'react';
import './css/Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faUserPlus, faSignInAlt, faHome, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useUser } from '../UserContext';

function Header() {
  const { user, logout } = useUser(); // Get the user and logout function from the context

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
            <Link to="/o-nama">
              <FontAwesomeIcon icon={faInfoCircle} /> O nama
            </Link>
          </li>

          {/* Conditional Rendering Based on Login Status */}
          {user ? (
            <>
              {/* Display Username */}
              <li>
                <span className="welcome-message">
                  <strong>Dobrodošli, {user.username}!</strong>
                </span>
              </li>

              {/* Your Profile Link */}
              <li>
                <Link to="/moj-profil" className="styled-link">
                  <FontAwesomeIcon icon={faUser} /> Moj profil
                </Link>
              </li>

              {/* Logout Link */}
              <li>
                <button onClick={logout} className="logout-button">
                  <FontAwesomeIcon icon={faSignOutAlt} /> Odjava
                </button>
              </li>
            </>
          ) : (
            <>
              {/* Registration Link */}
              <li>
                <Link to="/registracija" className="styled-link">
                  <FontAwesomeIcon icon={faUserPlus} /> Registracija
                </Link>
              </li>

              {/* Login Link */}
              <li>
                <Link to="/prijava" className="styled-link">
                  <FontAwesomeIcon icon={faSignInAlt} /> Prijava
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;