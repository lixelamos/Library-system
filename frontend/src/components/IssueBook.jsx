import React, { useState } from 'react';
import { Form, Button, Alert, Container, Row, Col, Card, Toast } from 'react-bootstrap';

function IssueBook() {
  const [formData, setFormData] = useState({ mk: '', bk: '' });
  const [member, setMember] = useState(null);
  const [book, setBook] = useState(null);
  const [debt, setDebt] = useState(0);
  const [message, setMessage] = useState('');
  const [showToast, setShowToast] = useState(false); // State for controlling toast visibility
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState(''); // Variant for toast ('success' or 'danger')

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fetch the member and book data
  const handleSearch = (e) => {
    e.preventDefault();
    fetch('http://127.0.0.1:5000/issuebook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        memberid: formData.mk,
        title: formData.bk,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setMessage(data.error);
          setToastMessage(data.error);
          setToastVariant('danger');
          setShowToast(true); // Show toast
        } else {
          setMember(data.member);
          setBook(data.book);
          setDebt(data.debt);
          setMessage('');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setMessage('Failed to fetch member or book data');
        setToastMessage('Failed to fetch member or book data');
        setToastVariant('danger');
        setShowToast(true); // Show toast
      });
  };

  // Issue book confirmation
  const issueBook = () => {
    if (debt > 500) {
      setMessage('Debt is more than 500! Please review before confirming.');
      setToastMessage('Debt is more than 500! Please review before confirming.');
      setToastVariant('danger');
      setShowToast(true); // Show toast
    } else if (member?.id && book?.id) {
      fetch('http://127.0.0.1:5000/issuebookconfirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberid: member.id,
          bookid: book.id,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            setMessage(data.error);
            setToastMessage(data.error);
            setToastVariant('danger');
            setShowToast(true); // Show toast
          } else {
            setToastMessage('Book issued successfully!');
            setToastVariant('success');
            setShowToast(true); // Show success toast
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          setMessage('Failed to issue book.');
          setToastMessage('Failed to issue book.');
          setToastVariant('danger');
          setShowToast(true); // Show toast
        });
    } else {
      setMessage('Member or book data is missing!');
      setToastMessage('Member or book data is missing!');
      setToastVariant('danger');
      setShowToast(true); // Show toast
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Issue Book</h1>

      <Form onSubmit={handleSearch} className="mb-4">
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Search Member by ID or Name:</Form.Label>
              <Form.Control
                type="text"
                name="mk"
                value={formData.mk}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Search Book by BookId or Title:</Form.Label>
              <Form.Control
                type="text"
                name="bk"
                value={formData.bk}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Button type="submit" variant="primary">Search</Button>
      </Form>

      {/* Toast for notifications */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}
        bg={toastVariant}
        delay={3000}
        autohide
      >
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>

      {/* Member Details */}
      {member && (
        <Card className="mb-4">
          <Card.Body>
            <Card.Title className="text-center">Member Details</Card.Title>
            <Card.Text><strong>Name:</strong> {member.name}</Card.Text>
            <Card.Text><strong>Address:</strong> {member.address}</Card.Text>
            <Card.Text><strong>Phone:</strong> {member.phone}</Card.Text>
            <Card.Text><strong>Email:</strong> {member.email}</Card.Text>
            <Card.Text>
              <strong>Outstanding Debt:</strong>{' '}
              {debt > 500 ? <span className="text-danger">{debt}</span> : <span className="text-success">{debt}</span>}
            </Card.Text>
          </Card.Body>
        </Card>
      )}

      {/* Book Details */}
      {book && (
        <Card className="mb-4">
          <Card.Body>
            <Card.Title className="text-center">Book Details</Card.Title>
            <Card.Text><strong>Book ID:</strong> {book?.id || 'N/A'}</Card.Text>
            <Card.Text><strong>Title:</strong> {book?.title || 'N/A'}</Card.Text>
            <Card.Text><strong>Author:</strong> {book?.author || 'N/A'}</Card.Text>
            <Card.Text><strong>ISBN:</strong> {book?.isbn || 'N/A'}</Card.Text>
            <Card.Text><strong>Publisher:</strong> {book?.publisher || 'N/A'}</Card.Text>
            <Card.Text><strong>Page Count:</strong> {book?.page || 'N/A'}</Card.Text>
          </Card.Body>
        </Card>
      )}

      {/* Stock Details */}
      {book && (
        <Card className="mb-4">
          <Card.Body>
            <Card.Title className="text-center">Stock Details</Card.Title>
            <Card.Text><strong>Total Quantity:</strong> {book?.total_quantity || 'N/A'}</Card.Text>
            <Card.Text><strong>Available Quantity:</strong> {book?.available_quantity || 'N/A'}</Card.Text>
            <Card.Text><strong>Borrowed Quantity:</strong> {book?.borrowed_quantity || '6'}</Card.Text>
            <Card.Text><strong>Total Borrowed:</strong> {book?.total_borrowed || '5'}</Card.Text>
          </Card.Body>
        </Card>
      )}

      {/* Confirm Issue */}
      {member && book && (
        <div className="text-center">
          <Button
            variant="success"
            onClick={issueBook}
          >
            Confirm
          </Button>
        </div>
      )}
    </Container>
  );
}

export default IssueBook;
