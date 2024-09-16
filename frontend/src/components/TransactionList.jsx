import React, { useState, useEffect } from 'react';

function TransactionsList() {
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = (search = '') => {
    setLoading(true);

    fetch('http://127.0.0.1:5000/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ search }),
    })
      .then((response) => response.json())
      .then((data) => {
        setTransactions(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching transactions:', error);
        setLoading(false);
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTransactions(searchQuery);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center h3 mb-4">Transactions List</h1>

      {/* Search Form */}
      <form className="mb-4 text-center" onSubmit={handleSearch}>
        <input
          type="text"
          name="search"
          className="form-control d-inline-block w-50"
          placeholder="Search by member name or transaction ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="btn btn-primary ml-2">
          Search
        </button>
      </form>

      {/* Transactions Table */}
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="thead-light">
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
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center">Loading...</td>
              </tr>
            ) : transactions.length > 0 ? (
              transactions.map(({ trans, member, book }, index) => {
                const returnDate = trans.return_date ? new Date(trans.return_date).toLocaleDateString() : <span className="text-danger">Not returned</span>;
            
                return (
                  <tr key={trans.id} className={index % 2 === 0 ? 'bg-light' : ''}>
                    <td>{trans.id}</td>
                    <td>
                      <a href={`/view_book/${book.id}`} className="text-success">
                        {book.title}
                      </a>
                    </td>
                    <td>
                      <a href={`/view_member/${member.id}`} className="text-primary">
                        {member.name}
                      </a>
                    </td>
                    <td>{new Date(trans.issue_date).toLocaleDateString()}</td>
                    <td>{returnDate}</td>
                    <td>{trans.rent_fee} KES</td>
                    <td>
                      <a href={`/returnbook/${trans.id}`} className="btn btn-success">
                        Manage
                      </a>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center">No transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransactionsList;
