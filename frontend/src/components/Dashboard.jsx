import React, { useEffect, useState } from 'react';

function Dashboard() {
  const [stats, setStats] = useState({ borrowed_books: 0, total_books: 0, total_members: 0, total_rent_current_month: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/')
      .then(res => res.json())
      .then(data => {
        setStats({
          borrowed_books: data.borrowed_books,
          total_books: data.total_books,
          total_members: data.total_members,
          total_rent_current_month: data.total_rent_current_month
        });
        setRecentTransactions(data.recent_transactions);
      })
      .catch(error => console.error('Error fetching dashboard data:', error));
  }, []);

  return (
    <div className="dashboard">
      <h2 className="mb-4">Dashboard</h2>
      <div className="row">
        <div className="col-md-3">
          <div className="card text-white bg-primary mb-3">
            <div className="card-body">
              <h5 className="card-title">Borrowed Books</h5>
              <p className="card-text">{stats.borrowed_books}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-success mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Books</h5>
              <p className="card-text">{stats.total_books}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-warning mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Members</h5>
              <p className="card-text">{stats.total_members}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-info mb-3">
            <div className="card-body">
              <h5 className="card-title">Total Rent (This Month)</h5>
              <p className="card-text">{stats.total_rent_current_month} KES</p>
            </div>
          </div>
        </div>
      </div>

      <h4>Recent Transactions</h4>
      <ul className="list-group">
        {recentTransactions.map((transaction, index) => (
          <li key={index} className="list-group-item">
            {transaction.Book.title} - {transaction.Transaction.issue_date}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
