// src/components/About.js
import React from 'react';
import './css/About.css'; // Optional: Add styles for the About page

function About() {
  return (
    <div className="about-page">
      <h2>O nama</h2>
      <p>
        Dobrodošli na AukcijeBH! Ova platforma omogućava korisnicima da sudjeluju u aukcijama i licitiraju na razne proizvode.
        Naš cilj je pružiti sigurno i jednostavno mjesto za kupovinu i prodaju putem aukcija.
      </p>
      <p>
        Kontaktirajte nas na <a href="mailto:support@aukcijebh.com">support@aukcijebh.com</a> ako imate bilo kakvih pitanja.
      </p>
    </div>
  );
}

export default About;