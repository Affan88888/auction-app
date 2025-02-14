// src/components/NapraviAukciju.js
import React, { useState } from 'react';
import { useUser } from '../UserContext'; // Import the useUser hook
import { useNavigate } from 'react-router-dom'; // For redirection
import './css/NapraviAukciju.css'; // Optional: Add CSS for styling

function NapraviAukciju() {
  const { user } = useUser(); // Get the user from the context
  const navigate = useNavigate(); // For redirection
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startingPrice: '',
    endDate: '',
    images: [], // Store selected files
  });

  // Redirect non-admin users away from this page
  if (user?.role !== 'admin') {
    navigate('/'); // Redirect to home page or show an error page
    return null; // Prevent rendering anything
  }

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      images: Array.from(e.target.files), // Convert FileList to array
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData(); // Use FormData to send files
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('startingPrice', formData.startingPrice);
      formDataToSend.append('endDate', formData.endDate);

      // Append images to FormData
      formData.images.forEach((file, index) => {
        formDataToSend.append('images', file);
      });

      const response = await fetch('http://localhost:5000/api/create-auction', {
        method: 'POST',
        body: formDataToSend, // Send FormData instead of JSON
      });

      if (response.ok) {
        alert('Aukcija uspješno kreirana!');
        setFormData({
          title: '',
          description: '',
          startingPrice: '',
          endDate: '',
          images: [],
        });
      } else {
        alert('Došlo je do greške prilikom kreiranja aukcije.');
      }
    } catch (error) {
      console.error('Error creating auction:', error);
      alert('Došlo je do greške prilikom kreiranja aukcije.');
    }
  };

  return (
    <div className="create-auction-container">
      <h2>Kreiraj novu aukciju</h2>
      <form onSubmit={handleSubmit} className="create-auction-form" encType="multipart/form-data">
        <label>
          Naslov:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Opis:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </label>
        <label>
          Početna cijena:
          <input
            type="number"
            name="startingPrice"
            value={formData.startingPrice}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Datum završetka:
          <input
            type="datetime-local"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Slike proizvoda:
          <input
            type="file"
            name="images"
            multiple // Allow multiple file uploads
            onChange={handleFileChange}
          />
        </label>
        <button type="submit" className="submit-button">
          Kreiraj aukciju
        </button>
      </form>
    </div>
  );
}

export default NapraviAukciju;