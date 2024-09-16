import React, { useState } from 'react';

function AddBook() {
  const [bookData, setBookData] = useState({ title: '', author: '', isbn: '', publisher: '', page: '', stock: '' });

  const handleChange = (e) => {
    setBookData({ ...bookData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://127.0.0.1:5000/add_book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookData),
    })
      .then(res => res.json())
      .then(data => {
        console.log("Response from server:", data); // Added for debugging
        if (data.error) {
          alert(`Error: ${data.error}`);
        } else {
          alert(data.message);
        }
      })
      .catch(error => {
        console.error('Error adding book:', error);
        alert('Error adding book. Please try again.');
      });
  };
  
  return (
    <div>
      <h2>Add Book</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input type="text" className="form-control" name="title" onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Author</label>
          <input type="text" className="form-control" name="author" onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">ISBN</label>
          <input type="text" className="form-control" name="isbn" onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Publisher</label>
          <input type="text" className="form-control" name="publisher" onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Page</label>
          <input type="number" className="form-control" name="page" onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Stock</label>
          <input type="number" className="form-control" name="stock" onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary">Add Book</button>
      </form>
    </div>
  );
}

export default AddBook;
