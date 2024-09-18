import React, { useState, useEffect } from 'react';
import { Container, Card, Button } from 'react-bootstrap'; // Import Bootstrap components
import axios from 'axios'; // Axios for API requests
import { useParams, useNavigate } from 'react-router-dom'; // Get URL parameters and navigate
import { ToastContainer, toast } from 'react-toastify'; // Toast notifications
import 'react-toastify/dist/ReactToastify.css'; // Toastify styles
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap styles

const ReturnBook = () => {
  const { transactionId } = useParams(); // Extract transactionId from URL parameters
  const navigate = useNavigate(); // Hook for navigation
  const [transaction, setTransaction] = useState(null); // Holds transaction data
  const [rent, setRent] = useState(0); // Holds rent fee
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch the transaction details from the API when the component mounts
  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/returnbook/${transactionId}`);
        console.log("API Response:", response.data); // Log the API response
        setTransaction(response.data);  // Set transaction, book, and member data
        setRent(response.data.rent); // Set rent fee
        setLoading(false); // Stop loading
      } catch (error) {
        console.error("Error fetching transaction details:", error);
        setError('Failed to fetch transaction details.');
        setLoading(false); // Stop loading on error
      }
    };

    fetchTransactionDetails();
  }, [transactionId]);

  // Handle form submission for book return confirmation
  const handleReturnConfirm = () => {
    const isConfirmed = window.confirm('Are you sure you want to confirm this return?');
    
    if (isConfirmed && transaction) {
      console.log("Transaction ID:", transaction.id); // Check if transaction ID is correctly captured
  
      axios.post('http://127.0.0.1:5000/return_book_confirm', { id: transaction.trans.id }, {
        headers: {
          'Content-Type': 'application/json' // Ensure correct Content-Type is set
        }
      })
      .then((response) => {
        toast.success(response.data.message); 
        console.log(response.data);

        setTimeout(() => {
          navigate('/transactions'); 
        }, 2000);
      })
      .catch((error) => {
        console.error('Error confirming book return:', error);
        toast.error('Failed to confirm the book return.Amount exceed 500'); 
      });
    }
  };

  // Handle loading state
  if (loading) {
    return (
      <Container className="mt-5">
        <h2>Loading...</h2>
      </Container>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Container className="mt-5">
        <h2>{error}</h2>
      </Container>
    );
  }

  // Check if transaction data is available
  if (!transaction) {
    return (
      <Container className="mt-5">
        <h2>No transaction data available.</h2>
      </Container>
    );
  }

  // Destructure the transaction data for easier access
  const { trans, book, member } = transaction;

  return (
    <Container className="mt-5">
      <ToastContainer /> {/* Toastify container for notifications */}
      <h1 className="mb-4">Return Book</h1>

      {/* Transaction Details */}
      <Card className="mt-4 shadow">
        <Card.Body>
          <Card.Title>Transaction Details</Card.Title>
          <Card.Text>Book Borrow Date: {new Date(trans.issue_date).toLocaleDateString()}</Card.Text>
          <Card.Text>
            Book Returned Date:{' '}
            {trans.return_date ? new Date(trans.return_date).toLocaleDateString() : 'Not returned yet'}
          </Card.Text>
          <Card.Text>Rent Fee: {rent} KES</Card.Text>
        </Card.Body>
      </Card>

      {/* Book Details */}
      <Card className="mb-4 mt-4 shadow">
        <Card.Body>
          <Card.Title>{book.id} : {book.title}</Card.Title>
          <Card.Text>Author: {book.author}</Card.Text>
          <Card.Text>ISBN: {book.isbn}</Card.Text>
          <Card.Text>Publisher: {book.publisher}</Card.Text>
          <Card.Text>Page Count: {book.page}</Card.Text>
        </Card.Body>
      </Card>

      {/* Member Details */}
      <Card className="mb-4 mt-4 shadow">
        <Card.Body>
          <Card.Title>{member.name}</Card.Title>
          <Card.Text>Address: {member.address}</Card.Text>
          <Card.Text>Phone: {member.phone}</Card.Text>
          <Card.Text>Email: {member.email}</Card.Text>
        </Card.Body>
      </Card>

      {/* Confirm Return Button */}
      {!trans.return_date && (
        <div className="text-center">
          <Button variant="success" onClick={handleReturnConfirm}>
            Confirm Return
          </Button>
        </div>
      )}
    </Container>
  );
};

export default ReturnBook;
