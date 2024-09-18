import React, { useEffect, useState } from 'react';
import { Container, Card, Table, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewMember = () => {
  const { id } = useParams(); // Get the member ID from the URL
  const [member, setMember] = useState(null); // Holds member details
  const [transactions, setTransactions] = useState([]); // Holds member transactions
  const [debt, setDebt] = useState(0); // Holds the outstanding debt
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch the member details and transactions from the API when the component mounts
  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/view_member/${id}`);
        const { member, transactions, debt } = response.data;
        
        setMember(member);
        setTransactions(transactions);
        setDebt(debt);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching member details:', error);
        setError('Failed to fetch member details.');
        setLoading(false);
        toast.error('Failed to fetch member details.');
      }
    };

    fetchMemberDetails();
  }, [id]);

  if (loading) {
    return <Container className="mt-5"><h2>Loading...</h2></Container>;
  }

  if (error) {
    return <Container className="mt-5"><h2>{error}</h2></Container>;
  }

  return (
    <Container className="mt-5">
      <ToastContainer />
      <h1 className="mb-4">Member Details</h1>

      {/* Member Details */}
      <Card className="mb-4 shadow">
        <Card.Body>
          <Card.Title>{member.name}</Card.Title>
          <Card.Text>Address: {member.address}</Card.Text>
          <Card.Text>Phone: {member.phone}</Card.Text>
          <Card.Text>Email: {member.email}</Card.Text>
          <Card.Text>Outstanding Debt: {debt} KES</Card.Text>
        </Card.Body>
      </Card>

      {/* Transactions */}
      <Card className="shadow">
        <Card.Body>
          <Card.Title>Transactions</Card.Title>
          {transactions.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Issue Date</th>
                  <th>Return Date</th>
                  <th>Rent Fee</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((trans) => (
                  <tr key={trans.id}>
                    <td>
                      <a href={`/returnbook/${trans.id}`} className="text-success">
                        {trans.id}
                      </a>
                    </td>
                    <td>{new Date(trans.issue_date).toLocaleDateString()}</td>
                    <td>{trans.return_date ? new Date(trans.return_date).toLocaleDateString() : 'Not returned yet'}</td>
                    <td>{trans.rent_fee}</td>
                    <td>
                      <Button variant="success" href={`/returnbook/${trans.id}`}>
                        Manage
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-muted">No transactions found for this member.</p>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ViewMember;