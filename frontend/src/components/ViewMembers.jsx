import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Container } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toastify

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
      .catch(error => {
        console.error('Error fetching members:', error);
        toast.error('Failed to fetch members'); // Show error toast on fetch failure
      });
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

  // Handle member deletion
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      fetch(`http://127.0.0.1:5000/delete-member/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => {
          if (data.message) {
            console.log(data.message);
            // Remove deleted member from the state
            setMembers(members.filter(member => member.id !== id));
            toast.success('Member deleted successfully'); // Show success toast
          } else {
            console.error('Error deleting member:', data.error);
            toast.error('Failed to delete member'); // Show error toast on failure
          }
        })
        .catch(error => {
          console.error('Error deleting member:', error);
          toast.error('Failed to delete member'); // Show error toast on catch
        });
    }
  };

  return (
    <Container className="mt-4">
      <ToastContainer /> {/* This container will render the toasts */}
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
                  <Button href={`/edit-member/${member.id}`} variant="success" className="mr-2">
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(member.id)} // Use handleDelete instead of href
                  >
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
