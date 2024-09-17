import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button } from 'react-bootstrap';

function StockUpdate() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [stock, setStock] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Fetch book and stock details (GET method)
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/stockupdate/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setBook(data.book_id);  // Set the book details
          setStock(data.total_quantity); // Set the current stock
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching book details:', error);
        setLoading(false);
      });
  }, [id]);

  // Handle stock update (POST method)
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
        if (data.message) {
          setMessage('Stock updated successfully!');
          navigate('/view-books');
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
        {book && <h3>Book ID: {book}</h3>}

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
