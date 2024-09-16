import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaBook, FaUserFriends, FaExchangeAlt, FaPlusSquare, FaBookReader, FaDownload } from 'react-icons/fa'; // Example icons from react-icons

function Navbar() {
  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-light" style={{ width: '250px', height: '100vh' }}>
      <Link to="/" className="navbar-brand mb-3">
        <strong>Library Management System</strong>
      </Link>
      <hr />
      
      <ul className="nav nav-pills flex-column mb-auto">
        {/* Homes Section */}
        <li className="nav-item mb-3">
          <span className="nav-header text-uppercase" style={{ fontSize: '12px', fontWeight: 'bold', color: '#6c757d' }}>Homes</span>
          <Link className="nav-link" to="/">
            <FaHome className="me-2" /> Dashboard
          </Link>
        </li>

        {/* Book Section */}
        <li className="nav-item mb-3">
          <span className="nav-header text-uppercase" style={{ fontSize: '12px', fontWeight: 'bold', color: '#6c757d' }}>Book</span>
          <Link className="nav-link" to="/books">
            <FaBook className="me-2" /> Books
          </Link>
          <Link className="nav-link" to="/add-book">
            <FaPlusSquare className="me-2" /> Add Book
          </Link>
          <Link className="nav-link" to="/Import-Books">
            <FaDownload className="me-2" /> Import Books
          </Link>
          <Link className="nav-link" to="/Issue-Book">
            <FaBookReader className="me-2" /> Issue Book
          </Link>
        </li>

        {/* Members Section */}
        <li className="nav-item mb-3">
          <span className="nav-header text-uppercase" style={{ fontSize: '12px', fontWeight: 'bold', color: '#6c757d' }}>Members</span>
          <Link className="nav-link" to="/View-Members">
            <FaUserFriends className="me-2" /> Members
          </Link>
          <Link className="nav-link" to="/add-member">
            <FaPlusSquare className="me-2" /> Add Member
          </Link>
        </li>

        {/* Transactions Section */}
        <li className="nav-item mb-3">
          <span className="nav-header text-uppercase" style={{ fontSize: '12px', fontWeight: 'bold', color: '#6c757d' }}>Transaction</span>
          <Link className="nav-link" to="/transactions">
            <FaExchangeAlt className="me-2" /> Transactions
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
