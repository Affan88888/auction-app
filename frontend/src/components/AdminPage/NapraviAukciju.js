import React, { useState, useEffect } from 'react';
import { useUser } from '../../UserContext'; // Import the useUser hook
import { useNavigate } from 'react-router-dom'; // For redirection
import './AdminPage_css/NapraviAukciju.css'; // Import CSS for styling
import ActiveAuctions from './AktivneAukcije'; // Import the ActiveAuctions component

function NapraviAukciju() {
  const { user } = useUser(); // Get the user from the context
  const navigate = useNavigate(); // For redirection
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startingPrice: '',
    endDate: '',
    images: [], // Store selected files
    categoryId: '', // Store the selected category ID
  });
  const [newAuction, setNewAuction] = useState(null); // State to track the newly created auction
  const [mainImageIndex, setMainImageIndex] = useState(0); // Default to the first image (index 0)
  const [categories, setCategories] = useState([]); // State to store available categories

    // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/categories');
        const result = await response.json();
        if (result.categories) {
          setCategories(result.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

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
    const files = Array.from(e.target.files); // Convert FileList to array
    setFormData((prevData) => ({
      ...prevData,
      images: files,
    }));
    setMainImageIndex(0); // Reset main image selection to the first image
  };

  // Handle selecting the main image
  const handleMainImageSelect = (index) => {
    setMainImageIndex(index);
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
      formDataToSend.append('categoryId', formData.categoryId); // Append the selected category ID
      // Append images to FormData
      formData.images.forEach((file, index) => {
        formDataToSend.append('images', file);
      });
      // Append the main image index (default to 0 if none is selected)
      formDataToSend.append('main_image_index', mainImageIndex);

      const response = await fetch('http://localhost:5000/api/create-auction', {
        method: 'POST',
        body: formDataToSend, // Send FormData instead of JSON
      });

      if (response.ok) {
        const result = await response.json();
        const createdAuction = {
          id: result.auction_id,
          title: formData.title,
          description: formData.description,
          starting_price: formData.startingPrice,
          end_date: formData.endDate,
        };
        setNewAuction(createdAuction); // Track the newly created auction
        alert('Aukcija uspješno kreirana!');
        setFormData({
          title: '',
          description: '',
          startingPrice: '',
          endDate: '',
          images: [],
          categoryId: '', // Reset category selection
        });
        setMainImageIndex(0); // Reset main image selection
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
        {/* Category Dropdown */}
        <label>
          Kategorija:
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">Odaberite kategoriju</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
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
        {/* Image previews */}
        {formData.images.length > 0 && (
          <div className="image-preview-box">
            <div className="image-preview-scroll">
              {formData.images.map((file, index) => (
                <div key={index} className="image-preview-item">
                  <img
                    src={URL.createObjectURL(file)} // Create a preview URL for the image
                    alt={`Preview ${index}`}
                    className="image-preview"
                  />
                  <label>
                    <input
                      type="radio"
                      name="main-image"
                      checked={mainImageIndex === index}
                      onChange={() => handleMainImageSelect(index)}
                    />
                    Postavi kao glavnu sliku
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
        <button type="submit" className="submit-button">
          Kreiraj aukciju
        </button>
      </form>
      {/* Render the ActiveAuctions component and pass the new auction */}
      <ActiveAuctions addNewAuction={newAuction} />
    </div>
  );
}

export default NapraviAukciju;