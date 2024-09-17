import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card } from 'react-bootstrap';


function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    page: '',
    stock: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch book details for the given id
    fetch(`http://127.0.0.1:5000/books/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.book) {
          setBook({
            title: data.book.title,
            author: data.book.author,
            isbn: data.book.isbn,
            publisher: data.book.publisher,
            page: data.book.page,
            stock: data.stock.total_quantity,
          });
        }
      })
      .catch((error) => console.error('Error fetching book details:', error));
  }, [id]);

  const handleChange = (e) => {
    setBook({
      ...book,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit updated book details
    fetch(`http://127.0.0.1:5000/edit-book/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(book),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setMessage('Book updated successfully!');
          navigate('/view-books');
        } else {
          setMessage('Failed to update book.');
        }
      })
      .catch((error) => {
        console.error('Error updating book:', error);
        setMessage('Error updating book.');
      });
  };

  return (
    <Container className="mt-5">
      <Card className="p-4">
        <h1 className="mb-4">Edit Book</h1>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title:</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={book.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Author:</Form.Label>
            <Form.Control
              type="text"
              name="author"
              value={book.author}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>ISBN:</Form.Label>
            <Form.Control
              type="text"
              name="isbn"
              value={book.isbn}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Publisher:</Form.Label>
            <Form.Control
              type="text"
              name="publisher"
              value={book.publisher}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Page:</Form.Label>
            <Form.Control
              type="number"
              name="page"
              value={book.page}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Stock:</Form.Label>
            <Form.Control
              type="number"
              name="stock"
              value={book.stock}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" onClick={() => window.confirm('Are you sure?')}>
            Confirm
          </Button>
        </Form>

        {message && <div className="mt-3 alert alert-info">{message}</div>}
      </Card>
    </Container>
  );
}

export default EditBook;
