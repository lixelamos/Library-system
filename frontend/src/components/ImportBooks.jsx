import React, { useState } from 'react';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

const API_BASE_URL = 'http://localhost:5000/proxy_import_books'; // Your Flask proxy URL
const SAVE_BOOKS_URL = 'http://localhost:5000/save_all_books'; // Your Flask save books endpoint

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

    fetch(`${API_BASE_URL}?title=${title}&limit=${numBooks}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Add an `id` if it's missing
        const updatedBooks = data.message.map((book, index) => ({
          ...book,
          id: book.id || index + 1, // Use existing id or generate one based on index
          numPages: book.num_pages || 0,  // Ensure field matches backend's 'num_pages'
          stock: 0  // Initialize stock with a default value of 0
        }));
    
        setBooks(updatedBooks);
        setLoading(false);

        if (!data.message || data.message.length === 0) {
          setMessage('No books found. Try a different search term.');
        }
      })
      .catch((error) => {
        setLoading(false);
        setMessage('Error fetching books.');
        console.error('Error fetching books:', error);
      });
  };

  // Function to delete a book
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/delete-book/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
  
        // Remove the deleted book from the state
        setBooks(books.filter(book => book.id !== id));
      } else {
        const errorData = await response.json();
        console.error('Error deleting book:', errorData.error);
      }
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };
  
  // Function to handle stock change
  const handleStockChange = (e, index) => {
    const updatedBooks = [...books];
    updatedBooks[index].stock = parseInt(e.target.value, 10);
    setBooks(updatedBooks);
  };

  // Save all books to the backend
  function saveAllBooks() {
    fetch(SAVE_BOOKS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(books),
    })
      .then((response) => response.json())
      .then((result) => {
        setMessage('Books saved successfully!');
        console.log(result);
      })
      .catch((error) => {
        setMessage('Error saving books.');
        console.error('Error:', error);
      });
  }

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
                <th>Stock</th> {/* Added Stock Column */}
                <th>Actions</th> {/* Added Actions Column */}
              </tr>
            </thead>
            <tbody>
              {books.map((book, index) => (
                <tr key={index}>
                  <td>{book.id}</td> {/* Ensure each book has an id */}
                  <td>{book.title}</td>
                  <td>{book.authors}</td>
                  <td>{book.isbn}</td>
                  <td>{book.publisher}</td>
                  <td>{book.numPages}</td>
                  <td>
                    {/* Add an input field for stock */}
                    <input
                      type="number"
                      name="stock"
                      value={book.stock || 0}
                      min="0"
                      onChange={(e) => handleStockChange(e, index)}
                    />
                  </td>
                  <td>
                  <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(book.id)}
                >
                  Delete
                </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn btn-success mt-3" onClick={saveAllBooks}>
            Save All Books
          </button>
        </div>
      )}
    </div>
  );
}

export default ImportBooks;
