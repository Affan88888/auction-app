// src/components/Header.js
import React from 'react';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserPlus, faSignInAlt } from '@fortawesome/free-solid-svg-icons';

function Header() {
  return (
    <header className="header">
      <h1>Auction Website</h1>
      <nav>
        <ul>
          <li>
            <a href="/">
              <FontAwesomeIcon icon={faUser} /> Moje aukcije
            </a>
          </li>
          <li>
            <a href="/register">
              <FontAwesomeIcon icon={faUserPlus} /> Registracija
            </a>
          </li>
          <li>
            <a href="/login">
              <FontAwesomeIcon icon={faSignInAlt} /> Prijava
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;