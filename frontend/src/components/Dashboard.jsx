import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';

function Dashboard() {
  const [stats, setStats] = useState({
    borrowed_books: 0,
    total_books: 0,
    total_members: 0,
    total_transactions: 0,
    total_rent_current_month: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);

  // Fetching statistics and recent transactions
  useEffect(() => {
    // Fetching statistics and recent transactions
    fetch('http://127.0.0.1:5000/')
      .then((res) => res.json())
      .then((data) => {
        setStats({
          borrowed_books: data.borrowed_books || 0,
          total_books: data.total_books || 0,
          total_members: data.total_members || 0,
          total_transactions: data.total_transactions || 0,
          total_rent_current_month: data.total_rent_current_month || 0,
        });
      })
      .catch((error) => console.error('Error fetching dashboard data:', error));
  
    // Fetching recent transactions
    fetch('http://127.0.0.1:5000/transactions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Transactions:", data); // Add this line to inspect the response structure
        setRecentTransactions(data);
      })
      .catch((error) => console.error('Error fetching transactions:', error));
  }, []);
  

  return (
    <Container fluid className="mt-4">
      {/* Displaying statistics */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-white bg-primary mb-3">
            <Card.Body>
              <Card.Title>Borrowed Books</Card.Title>
              <Card.Text>{stats.borrowed_books}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-white bg-success mb-3">
            <Card.Body>
              <Card.Title>Total Books</Card.Title>
              <Card.Text>{stats.total_books}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-white bg-warning mb-3">
            <Card.Body>
              <Card.Title>Total Members</Card.Title>
              <Card.Text>{stats.total_members}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-white bg-info mb-3">
            <Card.Body>
              <Card.Title>Total Rent (This Month)</Card.Title>
              <Card.Text>{stats.total_rent_current_month} KES</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Displaying recent transactions */}
      <h4 className="mt-4">Recent Transactions</h4>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Book Title</th>
            <th>Rent Fee</th>
            <th>Issue Date</th>
          </tr>
        </thead>
        <tbody>
  {recentTransactions.length > 0 ? (
    recentTransactions.map((transaction, index) => (
      <tr key={index}>
        {/* Access the transaction id from the `trans` object */}
        <td>{transaction.trans.id}</td>
        
        {/* Access the book title from the `book` object */}
        <td>{transaction.book.title}</td>
        
        {/* Access the rent fee from the `trans` object */}
        <td>KES {transaction.trans.rent_fee}</td>
        
        {/* Access and format the issue date from the `trans` object */}
        <td>
          {isNaN(Date.parse(transaction.trans.issue_date))
            ? 'Invalid Date'
            : new Date(transaction.trans.issue_date).toLocaleDateString()}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="4" className="text-center">No transactions found</td>
    </tr>
  )}
</tbody>


      </Table>
    </Container>
  );
}

export default Dashboard;
