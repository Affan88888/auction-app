// src/components/Profile.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './css/Profile.css'; // Optional: Add CSS for styling
import { useUser } from '../UserContext'; // Import the useUser hook

function Profile() {
  const { user } = useUser(); // Get the user from the context
  const [profileData, setProfileData] = useState(null); // State to store profile data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Fetch the user's profile data from the backend
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: user.email }), // Send the user's email
        });
        if (response.ok) {
          const result = await response.json();
          setProfileData(result.user);
        } else {
          console.error('Error fetching profile:', await response.text());
        }
      } catch (error) {
        console.error('Error during profile fetch:', error);
      } finally {
        setLoading(false); // Hide loading state
      }
    };
    if (user) {
      fetchProfile();
    }
  }, [user]); // Run effect when the user changes

  if (loading) {
    return <div className="profile-container">Učitavanje profila...</div>;
  }

  if (!profileData) {
    return <div className="profile-container">Greška prilikom učitavanja profila.</div>;
  }

  return (
    <div className="profile-container">
      <h2>Moj profil</h2>
      <div className="profile-info">
        <p><strong>Korisničko ime:</strong> {profileData.username}</p>
        <p><strong>Email:</strong> {profileData.email}</p>
        <p><strong>Akaunt:</strong> {profileData.role}</p>
      </div>

      {/* Show "Napravi aukciju" button only for admin users */}
      {profileData.role === 'admin' && (
        <div className="profile-actions">
          <Link to="/admin-stranica" className="create-auction-button">
            Admin stranica
          </Link>
        </div>
      )}
    </div>
  );
}

export default Profile;