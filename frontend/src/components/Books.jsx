import React, { useEffect, useState } from 'react';

function Books() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/view_books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(error => console.error('Error fetching books:', error));
  }, []);

  return (
    <div>
      <h2>Books List</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, index) => (
            <tr key={index}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Books;
