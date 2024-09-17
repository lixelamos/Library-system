import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Container, Card } from 'react-bootstrap';

function ReturnBook() {
  const { transactionId } = useParams(); // Using the correct param from URL
  const [transaction, setTransaction] = useState(null); // To store the transaction details
  const [rent, setRent] = useState(0); // To store rent information
  const navigate = useNavigate(); // For redirection after confirmation

  // Fetch transaction details
  useEffect(() => {
    fetch(`http://127.0.0.1:5000/returnbook/${transactionId}`) // Update the API endpoint if needed
      .then((response) => response.json())
      .then((data) => {
        setTransaction(data.transaction); // Set transaction data
        setRent(data.rent); // Set rent data
      })
      .catch((error) => console.error('Error fetching transaction:', error)); // Handle errors
  }, [transactionId]);

  // Handle the return of the book
  const handleReturnBook = () => {
    if (window.confirm('Are you sure you want to confirm the return?')) {
      fetch(`http://127.0.0.1:5000/returnbookconfirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: transactionId }), // Pass transaction ID
      })
        .then((response) => response.json())
        .then(() => {
          alert('Book return confirmed.'); // Show success message
          navigate('/transactions'); // Redirect to transactions list
        })
        .catch((error) => console.error('Error returning book:', error)); // Handle errors
    }
  };

  // Show loading state if transaction is not yet fetched
  if (!transaction) return <div>Loading...</div>;

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">Return Book</h1>

      {/* Transaction Details */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Transaction Details</Card.Title>
          <p><strong>Book Borrow Date:</strong> {new Date(transaction.issue_date).toLocaleDateString()}</p>
          <p>
            <strong>Book Returned Date:</strong>{' '}
            {transaction.return_date ? new Date(transaction.return_date).toLocaleDateString() : 'Not returned yet'}
          </p>
          <p className="text-lg"><strong>Rent Fee:</strong> {rent} KES</p>
        </Card.Body>
      </Card>

      {/* Book Details */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Book Details</Card.Title>
          <p><strong>ID:</strong> {transaction.book.id}</p>
          <p><strong>Title:</strong> {transaction.book.title}</p>
          <p><strong>Author:</strong> {transaction.book.author}</p>
          <p><strong>ISBN:</strong> {transaction.book.isbn}</p>
          <p><strong>Publisher:</strong> {transaction.book.publisher}</p>
          <p><strong>Page Count:</strong> {transaction.book.page}</p>
        </Card.Body>
      </Card>

      {/* Member Details */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Member Details</Card.Title>
          <p><strong>Name:</strong> {transaction.member.name}</p>
          <p><strong>Address:</strong> {transaction.member.address}</p>
          <p><strong>Phone:</strong> {transaction.member.phone}</p>
          <p><strong>Email:</strong> {transaction.member.email}</p>
        </Card.Body>
      </Card>

      {/* Return Button */}
      {!transaction.return_date && (
        <div className="text-center">
          <Button variant="success" onClick={handleReturnBook}>
            Confirm Return
          </Button>
        </div>
      )}
    </Container>
  );
}

export default ReturnBook;
