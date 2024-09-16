import React, { useState } from 'react';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

const API_BASE_URL = 'https://frappe.io/api/method/frappe-library';

function ImportBooks() {
  const [title, setTitle] = useState('');
  const [numBooks, setNumBooks] = useState(1);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch books when the form is submitted
  const fetchBooks = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
  
    fetch(`${API_BASE_URL}?title=${title}&limit=${numBooks}`, { mode: 'no-cors' })
  
      .then((response) => {
        console.log('API Response:', response); // Check response status and headers
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Received non-JSON response');
        }
  
        return response.json();
      })
      .then((data) => {
        console.log('Fetched Data:', data); // Log the fetched data
        setBooks(data.message || []);
        setLoading(false);
        if (!data.message || data.message.length === 0) {
          setMessage('No books found. Try a different search term.');
        }
      })
      .catch((error) => {
        console.error('Error fetching books:', error.message || error);
        setLoading(false);
        setMessage('Error fetching books.');
      });
  };
  
  

  return (
    <div className="container mt-5">
      <h1 className="h3 mb-4">
        <LibraryBooksIcon /> Import Books
      </h1>
      <form onSubmit={fetchBooks} className="mb-4">
        <div className="input-group mb-3">
          <input
            type="text"
            name="title"
            value={title}
            placeholder="Search by book title"
            className="form-control"
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="number"
            name="numBooks"
            value={numBooks}
            min="1"
            placeholder="Number of books"
            className="form-control"
            onChange={(e) => setNumBooks(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>
      </form>

      {message && <div className="alert alert-info">{message}</div>}

      {books.length > 0 && (
        <div>
          <table className="table table-bordered bg-white">
            <thead>
              <tr>
                <th>Book ID</th>
                <th>Title</th>
                <th>Authors</th>
                <th>ISBN</th>
                <th>Publisher</th>
                <th>Num Pages</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, index) => (
                <tr key={index}>
                  <td>{book.bookID}</td>
                  <td>{book.title}</td>
                  <td>{book.authors}</td>
                  <td>{book.isbn}</td>
                  <td>{book.publisher}</td>
                  <td>{book.num_pages}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ImportBooks;
