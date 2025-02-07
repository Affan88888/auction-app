// src/components/Register.js
import React, { useState } from 'react';
import './css/Register.css';
import { Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // To indicate loading state during submission
  const [successMessage, setSuccessMessage] = useState(''); // To display success message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Korisničko ime je obavezno.';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email je obavezan.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email je nevažeći..';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Lozinka je obavezna.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Lozinka mora imati najmanje 6 znakova.';
    }
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Potvrdite lozinku.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Lozinke se ne podudaraju.';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      try {
        setLoading(true); // Show loading state
        const response = await fetch('http://localhost:5000/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Registration Successful:', result);
          setSuccessMessage('Registracija uspješna! Možete se prijaviti.');
          setFormData({ username: '', email: '', password: '', confirmPassword: '' });
          setErrors({});
        } else {
          const error = await response.json();
          alert(`Greška prilikom registracije: ${error.message}`);
        }
      } catch (error) {
        console.error('Error during registration:', error);
        alert('Došlo je do greške prilikom registracije. Molimo pokušajte kasnije.');
      } finally {
        setLoading(false); // Hide loading state
      }
    } else {
      setErrors(validationErrors); // Display validation errors
    }
  };

  return (
    <div className="register-container">
      <h2>Registracija</h2>
      {successMessage && <p className="success">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        {/* Username Field */}
        <div className="form-group">
          <label htmlFor="username">Korisničko ime:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Unesite korisničko ime"
            disabled={loading}
          />
          {errors.username && <span className="error">{errors.username}</span>}
        </div>

        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Unesite email"
            disabled={loading}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label htmlFor="password">Lozinka:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Unesite lozinku"
            disabled={loading}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        {/* Confirm Password Field */}
        <div className="form-group">
          <label htmlFor="confirmPassword">Potvrdite lozinku:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Ponovite lozinku"
            disabled={loading}
          />
          {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn-register" disabled={loading}>
          {loading ? 'Učitavanje...' : 'Registruj se'}
        </button>
      </form>

      {/* Back to Login Link */}
      <p>
        Već imate nalog?{' '}
        <Link to="/prijava" className="link">
          Prijavite se
        </Link>
      </p>
    </div>
  );
}

export default Register;