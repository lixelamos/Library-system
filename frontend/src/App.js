import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Books from './components/Books';
import ViewMembers from './components/ViewMembers';
import AddBook from './components/AddBook';
import AddMember from './components/AddMember';
import TransactionList from './components/TransactionList';
import Navbar from './components/NavBar';
import ViewBook from './components/ViewBook';
import IssueBook from './components/IssueBook';
import ImportBooks from './components/ImportBooks';
import ViewBooks from './components/ViewBooks';
import ViewMember from './components/ViewMember';
import ReturnBook from './components/ReturnBook';
import StockUpdate from './components/StockUpdate';
import EditBook from './components/EditBook';
import EditMember from './components/EditMember';

function App() {
  return (
    <Router>
      <div className="d-flex">
        <Navbar />
        <div className="content p-4" style={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/books" element={<Books />} />
            <Route path="/add-book" element={<AddBook />} />
            <Route path="/view-members" element={<ViewMembers />} />
            <Route path="/add-member" element={<AddMember />} />
            <Route path="/transactions" element={<TransactionList />} />
            <Route path="/view-book" element={<ViewBook />} />
            <Route path="/issue-book" element={<IssueBook />} />
            <Route path="/view-member" element={<ViewMember />} />
            <Route path="/import-books" element={<ImportBooks />} />
            <Route path="/view-books" element={<ViewBooks />} />
            <Route path="/returnbook/:transactionId" element={<ReturnBook />} />            <Route path="/stock-update" element={<StockUpdate />} />
            <Route path="/edit-book/:id" element={<EditBook />} />
            <Route path="/view-book/:id" element={<ViewBook />} />
            <Route path="/edit-member/:id" element={<EditMember />} />
            <Route path="/view_member/:id" element={<ViewMember />} />
            <Route path="/returnbook" element={<ReturnBook />} />

            


            



            


          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
