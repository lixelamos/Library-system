import React, { useState, useEffect } from 'react';

function ViewMember({ memberId }) {
  const [member, setMember] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [debt, setDebt] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch member and transactions data based on the provided memberId
    fetch(`http://127.0.0.1:5000/member/${memberId}`)
      .then(response => response.json())
      .then(data => {
        setMember(data.member);
        setTransactions(data.transactions);
        setDebt(data.debt);
        setLoading(false);
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

      {member ? (
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">{member.name}</h2>
          <p className="text-gray-600">{member.address}</p>
          <p className="text-gray-600">{member.phone}</p>
          <p className="text-gray-600">{member.email}</p>
          <p className="text-gray-600">Outstanding Debt: {debt}</p>
        </div>
      ) : (
        <p>No member details found.</p>
      )}

      <div className="bg-white mt-4 p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Transactions</h2>
        {transactions.length > 0 ? (
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="border px-4 py-2">Id</th>
                <th className="border px-4 py-2">Issue Date</th>
                <th className="border px-4 py-2">Return Date</th>
                <th className="border px-4 py-2">Rent Fee</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(trans => (
                <tr key={trans.id}>
                  <td className="border px-4 py-2">
                    <a className="text-green-500" href={`/returnbook/${trans.id}`}>
                      {trans.id}
                    </a>
                  </td>
                  <td className="border px-4 py-2">{new Date(trans.issue_date).toLocaleDateString()}</td>
                  <td className="border px-4 py-2">
                    {trans.return_date ? new Date(trans.return_date).toLocaleDateString() : 'Not returned yet'}
                  </td>
                  <td className="border px-4 py-2">{trans.rent_fee}</td>
                  <td className="py-2 px-4 border border-gray-200">
                    <a className="ml-2 px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600" href={`/returnbook/${trans.id}`}>
                      Manage
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">No transactions found for this member.</p>
        )}
      </div>
    </div>
  );
}

export default ViewMember;
