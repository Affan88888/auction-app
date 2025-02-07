// src/components/Login.js
import React, { useState } from 'react';
import './css/Login.css'; // Optional: Add CSS for styling
import { Link } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid.';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required.';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      // Form is valid, proceed with login logic (e.g., API call)
      alert('Login successful!');
      console.log('Logged In User:', formData);
      // Reset form after successful submission
      setFormData({ email: '', password: '' });
      setErrors({});
    } else {
      // Display validation errors
      setErrors(validationErrors);
    }
  };

  return (
    <div className="login-container">
      <h2>Prijava</h2>
      <form onSubmit={handleSubmit}>
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
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn-login">
          Prijavi se
        </button>
      </form>

      {/* Link to Registration Page */}
      <p>
        Nemate nalog?{' '}
        <Link to="/registracija" className="link">
          Registrujte se
        </Link>
      </p>
    </div>
  );
}

export default Login;