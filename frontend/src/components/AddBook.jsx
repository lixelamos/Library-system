import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        console.log("Response from server:", data); // Debugging
        if (data.error) {
          toast.error(`Error: ${data.error}`);
        } else {
          toast.success(data.message);
          setBookData({ title: '', author: '', isbn: '', publisher: '', page: '', stock: '' }); // Clear form
        }
      })
      .catch(error => {
        console.error('Error adding book:', error);
        toast.error('Error adding book. Please try again.');
      });
  };
  
  return (
    <div>
      <h2>Add Book</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={bookData.title}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Author</label>
          <input
            type="text"
            className="form-control"
            name="author"
            value={bookData.author}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">ISBN</label>
          <input
            type="text"
            className="form-control"
            name="isbn"
            value={bookData.isbn}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Publisher</label>
          <input
            type="text"
            className="form-control"
            name="publisher"
            value={bookData.publisher}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Page</label>
          <input
            type="number"
            className="form-control"
            name="page"
            value={bookData.page}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Stock</label>
          <input
            type="number"
            className="form-control"
            name="stock"
            value={bookData.stock}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Book</button>
      </form>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}

export default AddBook;
