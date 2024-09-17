import React, { useState, useEffect } from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ReturnBook = () => {
  const { transactionId } = useParams(); // Get transaction ID from the URL
  const [transaction, setTransaction] = useState(null); // Holds transaction data
  const [book, setBook] = useState(null); // Holds book details
  const [member, setMember] = useState(null); // Holds member details
  const [rent, setRent] = useState(0); // Holds rent fee
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch the transaction details from the API when the component mounts
  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        console.log("Fetching transaction details for ID:", transactionId);
        const response = await axios.get(`http://127.0.0.1:5000/returnbook/${transactionId}`);
        
        console.log("API Response:", response.data);
        setTransaction(response.data.trans); // Set transaction data from the API response
        setBook(response.data.book); // Set book details
        setMember(response.data.member); // Set member details
        setRent(response.data.rent); // Set rent fee
        setLoading(false); // Stop loading
      } catch (error) {
        console.error('Error fetching transaction details:', error);
        setError('Failed to fetch transaction details.');
        toast.error('Failed to fetch transaction details!'); // Show error toast
        setLoading(false); // Stop loading in case of error
      }
    };

    fetchTransactionDetails();
  }, [transactionId]);

  // Handle the form submission for book return confirmation
  const handleReturnConfirm = () => {
    const isConfirmed = window.confirm('Are you sure you want to confirm this return?');
    if (isConfirmed && transaction) {
        axios.post('http://127.0.0.1:5000/returnbookconfirm', { id: transaction.id })
  .then(() => {
    console.log('Book returned successfully!');
  })
  .catch((error) => {
    console.log('Axios Error:', error); // This will show detailed error info
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

  // Check if transaction, book, and member data are available
  if (!transaction || !book || !member) {
    return (
      <Container className="mt-5">
        <h2>No transaction data available.</h2>
      </Container>
    );
  }

  // Render the transaction details, book details, and member details
  return (
    <Container className="mt-5">
      <ToastContainer /> {/* Add the ToastContainer */}
      <h1 className="mb-4">Return Book</h1>

      {/* Transaction Details */}
      <Card className="mt-4 shadow">
        <Card.Body>
          <Card.Title>Transaction Details</Card.Title>
          <Card.Text>Book Borrow Date: {new Date(transaction.issue_date).toLocaleDateString()}</Card.Text>
          <Card.Text>Book Returned Date: {transaction.return_date ? new Date(transaction.return_date).toLocaleDateString() : 'Not returned yet'}</Card.Text>
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
      {!transaction.return_date && (
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
