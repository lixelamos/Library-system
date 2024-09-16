import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Container } from 'react-bootstrap';

function ViewMembers() {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch members from the backend
  const fetchMembers = (search = '') => {
    fetch('http://127.0.0.1:5000/view_members', {
      method: search ? 'POST' : 'GET',
      headers: { 'Content-Type': 'application/json' },
      body: search ? JSON.stringify({ search }) : null,
    })
      .then(response => response.json())
      .then(data => {
        setMembers(data);
      })
      .catch(error => console.error('Error fetching members:', error));
  };

  // Fetch all members on component mount
  useEffect(() => {
    fetchMembers();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchMembers(searchTerm);
  };

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">Member List</h1>

      {/* Search Form */}
      <Form onSubmit={handleSearch} className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search by Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-2"
        />
        <Button type="submit" variant="primary">
          Search
        </Button>
      </Form>

      {/* Members Table */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Member ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {members.length > 0 ? (
            members.map(member => (
              <tr key={member.id}>
                <td>{member.id}</td>
                <td>
                  <a href={`/view_member/${member.id}`} className="text-primary">
                    {member.name}
                  </a>
                </td>
                <td>{member.email}</td>
                <td>{member.phone}</td>
                <td>{member.address}</td>
                <td>
                  <Button href={`/edit_member/${member.id}`} variant="success" className="mr-2">
                    Edit
                  </Button>
                  <Button href={`/delete_member/${member.id}`} variant="danger" onClick={() => window.confirm('Are you sure?')}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No members found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
}

export default ViewMembers;
