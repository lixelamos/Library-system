import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Table, InputGroup, FormControl, Form } from 'react-bootstrap';

function ViewBooks() {
  const [books, setBooks] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchAuthor, setSearchAuthor] = useState('');

  // Fetch books when the component mounts or after search
  useEffect(() => {
    fetchBooks(); // Fetch all books initially
  }, []);

  const fetchBooks = async (title = '', author = '') => {
    try {
      const method = title || author ? 'POST' : 'GET'; // Use POST for search, GET for fetching all
      const response = await fetch('http://127.0.0.1:5000/view_books', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method === 'POST' ? JSON.stringify({ searcht: title, searcha: author }) : null,
      });
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks(searchTitle, searchAuthor);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
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
          const errorText = await response.text();
          console.error('Error deleting book:', errorText);
        }
      } catch (error) {
        console.error('Error deleting book:', error);
      }
    }
  };
  
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Book List</h1>

      {/* Search Form */}
      <Form onSubmit={handleSearch} className="mb-4">
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Search by Title"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
          <FormControl
            placeholder="Search by Author"
            value={searchAuthor}
            onChange={(e) => setSearchAuthor(e.target.value)}
          />
          <Button type="submit" variant="primary">
            Search
          </Button>
        </InputGroup>
      </Form>

      {/* Book List Table */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Book Id</th>
            <th>Title</th>
            <th>Author</th>
            <th>ISBN</th>
            <th>Publisher</th>
            <th>Stock</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {books.length > 0 ? (
            books.map((book, index) => (
              <tr key={index}>
                <td>{book.id}</td> {/* Access directly from book */}
                <td>
                  <Link to={`/view-book/${book.id}`} className="text-primary">
                    {book.title}
                  </Link>
                </td>
                <td>{book.author}</td>
                <td>{book.isbn}</td>
                <td>{book.publisher}</td>
                <td>
                  {book.stock ? `Total: ${book.stock.total_quantity}, Available: ${book.stock.available_quantity}` : 'No stock information'}
                </td>
                <td>
                  <Link to={`/edit-book/${book.id}`} className="btn btn-success me-2">
                    Edit
                  </Link>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(book.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No books found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default ViewBooks;
