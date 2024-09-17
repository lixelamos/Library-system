import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ViewMember() {
  const { memberId } = useParams();  // Get memberId from URL parameters
  const [member, setMember] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [debt, setDebt] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch member and transactions data based on the provided memberId
    fetch(`http://127.0.0.1:5000/member/${memberId}`)
      .then(response => response.json())
      .then(data => {
        setMember(data.member);  // Set the member data
        setTransactions(data.transactions);  // Set the transactions data
        setDebt(data.debt);  // Set the member debt
        setLoading(false);  // Loading finished
      })
      .catch(error => {
        console.error("Error fetching member details:", error);
        setLoading(false);
      });
  }, [memberId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-3xl font-semibold mb-4">Member Details</h1>

      {/* Member Details */}
      {member ? (
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">{member.id}: {member.name}</h2>
          <p className="text-gray-600">{member.address}</p>
          <p className="text-gray-600">{member.phone}</p>
          <p className="text-gray-600">{member.email}</p>
          <p className="text-gray-600">Outstanding Debt: {debt}</p>
        </div>
      ) : (
        <p>No member details found.</p>
      )}

      {/* Transactions */}
      <div className="bg-white mt-4 p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Transactions</h2>
        {transactions.length > 0 ? (
          <table className="table table-bordered bg-white">
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
              {transactions.map(trans => (
                <tr key={trans.id}>
                  <td>
                    <a className="text-green-500" href={`/returnbook/${trans.id}`}>
                      {trans.id}
                    </a>
                  </td>
                  <td>{new Date(trans.issue_date).toLocaleDateString()}</td>
                  <td>
                    {trans.return_date ? new Date(trans.return_date).toLocaleDateString() : 'Not returned yet'}
                  </td>
                  <td>{trans.rent_fee}</td>
                  <td>
                    <a className="btn btn-success" href={`/returnbook/${trans.id}`}>
                      Manage
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No transactions found for this member.</p>
        )}
      </div>
    </div>
  );
}

export default ViewMember;
