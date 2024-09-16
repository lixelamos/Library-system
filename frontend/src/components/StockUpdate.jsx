import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button } from 'react-bootstrap';

function StockUpdate() {
  const { id } = useParams(); // Get the book ID from the URL
  const [book, setBook] = useState(null); // Holds book details
  const [stock, setStock] = useState(0); // Holds current stock
  const [loading, setLoading] = useState(true); // Show loading state
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Fetch book and stock details
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/books/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setBook(data.book);
        setStock(data.stock.total_quantity); // Set the current stock quantity
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching book details:', error);
        setLoading(false);
      });
  }, [id]);

  // Handle stock update
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://127.0.0.1:5000/stockupdate/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ qty: stock }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setMessage('Stock updated successfully!');
          navigate('/books'); // Navigate back to the book list or details page
        } else {
          setMessage('Failed to update stock.');
        }
      })
      .catch((error) => {
        console.error('Error updating stock:', error);
        setMessage('Failed to update stock.');
      });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container className="mt-5">
      <Card className="p-4">
        <h1 className="mb-4">Update Stock</h1>
        {book && <h3>{book.id}: {book.title}</h3>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Stock:</Form.Label>
            <Form.Control
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Update
          </Button>
        </Form>

        {message && <div className="mt-3 alert alert-info">{message}</div>}
      </Card>
    </Container>
  );
}

export default StockUpdate;
