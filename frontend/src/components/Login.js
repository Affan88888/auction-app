// src/components/Login.js
import React, { useState } from 'react';
import './css/Login.css'; // Optional: Add CSS for styling
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext'; // Import the useUser hook

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // To indicate loading state
  const navigate = useNavigate(); // To redirect after successful login
  const { login } = useUser(); // Use the login function from the context

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
      newErrors.email = 'Email je obavezan.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email je nevažeći.';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Lozinka je obavezna.';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length === 0) {
      try {
        setLoading(true); // Show loading state
        const response = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Login Successful:', result);

          // Update the global user state
          login(result.user);

          alert('Prijava uspješna!');
          navigate('/'); // Redirect to the home page after successful login
        } else {
          const error = await response.json();
          alert(`Greška prilikom prijave: ${error.message}`);
        }
      } catch (error) {
        console.error('Error during login:', error);
        alert('Došlo je do greške prilikom prijave. Molimo pokušajte kasnije.');
      } finally {
        setLoading(false); // Hide loading state
      }
    } else {
      setErrors(validationErrors); // Display validation errors
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

        {/* Submit Button */}
        <button type="submit" className="btn-login" disabled={loading}>
          {loading ? 'Učitavanje...' : 'Prijavi se'}
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