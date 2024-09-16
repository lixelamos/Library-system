import React, { useState } from 'react';

function IssueBook() {
  const [formData, setFormData] = useState({ mk: '', bk: '' });
  const [member, setMember] = useState(null);
  const [book, setBook] = useState(null);
  const [debt, setDebt] = useState(0);
  const [message, setMessage] = useState('');

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
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        setMember(data.member);
        setBook(data.book);
        setDebt(data.debt);
        setMessage('');
      })
      .catch((error) => {
        console.error('Error:', error);
        setMessage('Failed to fetch member or book data');
      });
  };

  // Issue book confirmation
  const issueBook = () => {
    if (debt > 500) {
      setMessage('Debt is more than 500! Please review before confirming.');
    } else {
      fetch('http://127.0.0.1:5000/issuebookconfirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberid: member.id,
          bookid: book.Book.id,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          alert('Book issued successfully!');
        })
        .catch((error) => {
          console.error('Error:', error);
          setMessage('Failed to issue book.');
        });
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-2xl font-bold mb-4">Issue Book</h1>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex space-x-4">
          <div className="w-1/2">
            <label className="block mb-2">Search Member by ID or Name:</label>
            <input
              type="text"
              name="mk"
              value={formData.mk}
              onChange={handleChange}
              className="w-full border rounded p-2 mb-2"
              required
            />
          </div>
          <div className="w-1/2">
            <label className="block mb-2">Search Book by BookId or Title:</label>
            <input
              type="text"
              name="bk"
              value={formData.bk}
              onChange={handleChange}
              className="w-full border rounded p-2 mb-2"
              required
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      {/* Member Details */}
      {member && (
        <div className="mb-4">
          <h2 className="text-3xl font-semibold mb-4">Member Details</h2>
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-xl mb-2">{member.name}</h3>
            <p>{member.address}</p>
            <p>{member.phone}</p>
            <p>{member.email}</p>
            <p>
              Outstanding Debt: {debt > 500 ? (
                <span className="text-red-500">{debt}</span>
              ) : (
                <span className="text-green-500">{debt}</span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Book Details */}
      {book && (
        <div className="mb-4">
          <h2 className="text-3xl font-semibold mb-4">View Book Details</h2>
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-xl mb-2">
              {book.Book.id} : {book.Book.title}
            </h3>
            <p>{book.Book.author}</p>
            <p>{book.Book.isbn}</p>
            <p>{book.Book.publisher}</p>
            <p>Page Count: {book.Book.page}</p>
          </div>
          <div className="bg-white mt-4 p-6 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">Stock Details</h2>
            <p>Total Quantity: {book.Stock.total_quantity}</p>
            <p>Available Quantity: {book.Stock.available_quantity}</p>
            <p>Borrowed Quantity: {book.Stock.borrowed_quantity}</p>
            <p>Total Borrowed: {book.Stock.total_borrowed}</p>
          </div>
        </div>
      )}

      {/* Confirm Issue */}
      {member && book && (
        <div className="mb-4">
          <button
            type="button"
            className="btn btn-success"
            onClick={issueBook}
          >
            Confirm
          </button>
        </div>
      )}

      {/* Error / Success Message */}
      {message && <p className="text-red-500">{message}</p>}
    </div>
  );
}

export default IssueBook;
