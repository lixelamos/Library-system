import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'; // Import useParams to get id

function ViewBook() {
  const { id } = useParams(); // Extract the id from the URL parameters
  const [book, setBook] = useState(null);
  const [stock, setStock] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Fetch data from the API when the component is mounted
    fetch(`http://127.0.0.1:5000/view_book/${id}`) // Use the id in the URL
      .then(response => response.json())
      .then(data => {
        setBook(data.book);
        setStock(data.stock);
        setTransactions(data.transactions);
      })
      .catch(error => {
        console.error('Error fetching book details:', error);
      });
  }, [id]); // Add `id` as a dependency to refetch data when it changes

  if (!book || !stock) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="h3 mb-4">View Book Details</h1>
      
      {/* Book Details */}
      <div className="card mb-4">
        <div className="card-body">
          <h2 className="h5 card-title">{book.title}</h2>
          <p className="card-text">Author: {book.author}</p>
          <p className="card-text">ISBN: {book.isbn}</p>
          <p className="card-text">Publisher: {book.publisher}</p>
          <p className="card-text">Page Count: {book.page}</p>
        </div>
      </div>

      {/* Stock Details */}
      <div className="card mb-4">
        <div className="card-body">
          <h2 className="h5 card-title">Stock Details</h2>
          <p className="card-text">Total Quantity: {stock.total_quantity}</p>
          <p className="card-text">
            Available Quantity: {stock.available_quantity || 'Out of Stock'}
          </p>
          <p className="card-text">Borrowed Quantity: {stock.borrowed_quantity}</p>
          <p className="card-text">Total Borrowed: {stock.total_borrowed}</p>
        </div>
      </div>

      {/* Transactions */}
      <div className="card">
        <div className="card-body">
          <h2 className="h5 card-title">Transactions</h2>
          {transactions.length > 0 ? (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Member ID</th>
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
        <Link to={`/view_member/${trans.member_id}`} className="text-primary">
          {trans.member_id ? trans.member_id : "No member data"} {/* Ensure trans.member_id is accessed */}
        </Link>
      </td>
      <td>{new Date(trans.issue_date).toLocaleDateString()}</td>
      <td>
        {trans.return_date
          ? new Date(trans.return_date).toLocaleDateString()
          : 'Not returned yet'}
      </td>
      <td>{trans.rent_fee ? trans.rent_fee : "No rent fee"}</td> {/* Ensure rent_fee is displayed */}
      <td>
        <Link to={`/returnbook/${trans.id}`} className="btn btn-success">
          Manage
        </Link>
      </td>
    </tr>
  ))}
</tbody>

            </table>
          ) : (
            <p className="card-text">No transactions found for this book.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewBook;
