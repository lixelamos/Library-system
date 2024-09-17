import React, { useState, useEffect } from 'react';
import { Table, Button, Form, FormControl, Container, Row, Col, Alert } from 'react-bootstrap';

function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');

  // Fetch transactions when the component mounts
  useEffect(() => {
    fetchTransactions(); // Initial fetch with GET method
  }, []);

  const fetchTransactions = async (search = '') => {
    try {
      const method = search ? 'POST' : 'GET'; // Use POST for search, GET for fetching all
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
      };

      // Only add body when searching (i.e., when searchQuery is present)
      if (search) {
        options.body = JSON.stringify({ search });
      }

      const response = await fetch('http://127.0.0.1:5000/transactions', options);
      const data = await response.json();
      setTransactions(data);
      if (data.length === 0) {
        setMessage('No transactions found');
      } else {
        setMessage(''); // Clear any previous message if data is found
      }
    } catch (error) {
      setMessage('Error fetching transactions');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTransactions(searchQuery); // Trigger search with the query
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Transactions List</h1>

      {/* Search Form */}
      <Form onSubmit={handleSearch} className="mb-4 text-center">
        <Row className="justify-content-center">
          <Col md={6}>
            <FormControl
              type="text"
              placeholder="Search by member name or transaction ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Col>
          <Col md="auto">
            <Button type="submit" variant="primary">Search</Button>
          </Col>
        </Row>
      </Form>

      {message && <Alert variant="info" className="text-center">{message}</Alert>}

      {/* Transactions Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Book</th>
            <th>Member</th>
            <th>Issue Date</th>
            <th>Return Date</th>
            <th>Rent Fee</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length > 0 ? (
            transactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.trans.id}</td>
                <td>
                  <a href={`/view_book/${transaction.book.id}`} className="text-success">
                    {transaction.book.title}
                  </a>
                </td>
                <td>
                  <a href={`/view_member/${transaction.member.id}`} className="text-primary">
                    {transaction.member.name}
                  </a>
                </td>
                <td>{new Date(transaction.trans.issue_date).toLocaleDateString()}</td>
                <td>
                  {transaction.trans.return_date ? (
                    new Date(transaction.trans.return_date).toLocaleDateString()
                  ) : (
                    <span className="text-danger">Not returned</span>
                  )}
                </td>
                <td>{transaction.trans.rent_fee} KES</td>
                <td>
                  <Button variant="success" href={`/returnbook/${transaction.trans.id}`}>
                    Manage
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No transactions found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}

export default TransactionList;
