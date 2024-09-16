import React, { useState } from 'react';

function AddMember() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const isValidEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  };

  const isValidPhone = (phone) => {
    const phonePattern = /^\d{10}$/; // Assuming a 10-digit phone number format
    return phonePattern.test(phone);
  };

  const clearValidationMessages = () => {
    setErrors({
      name: '',
      email: '',
      phone: '',
      address: ''
    });
  };

  const validateForm = () => {
    clearValidationMessages();
    let isValid = true;
    const newErrors = { ...errors };

    if (formData.name.trim() === '') {
      newErrors.name = 'Name is required.';
      isValid = false;
    }

    if (formData.email.trim() === '') {
      newErrors.email = 'Email is required.';
      isValid = false;
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    if (formData.phone.trim() !== '' && !isValidPhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number.';
      isValid = false;
    }

    if (formData.address.trim() === '') {
      newErrors.address = 'Address is required.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      fetch('http://127.0.0.1:5000/add_member', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          alert('Member added successfully');
          setFormData({ name: '', email: '', phone: '', address: '' }); // Reset the form
        } else {
          alert('Error adding member');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  };
  

  return (
    <div className="container mt-5">
      <div className="bg-white p-4 rounded shadow w-50 mx-auto">
        <h1 className="h3 mb-4">Add Member</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name:</label>
            <input
              type="text"
              name="name"
              id="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="text-danger">{errors.name}</span>}
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              type="text"
              name="email"
              id="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="text-danger">{errors.email}</span>}
          </div>

          <div className="mb-3">
            <label htmlFor="phone" className="form-label">Phone:</label>
            <input
              type="text"
              name="phone"
              id="phone"
              className="form-control"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <span className="text-danger">{errors.phone}</span>}
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label">Address:</label>
            <textarea
              name="address"
              id="address"
              className="form-control"
              value={formData.address}
              onChange={handleChange}
            ></textarea>
            {errors.address && <span className="text-danger">{errors.address}</span>}
          </div>

          <button type="submit" className="btn btn-primary">ADD</button>
        </form>
      </div>
    </div>
  );
}

export default AddMember;
