This project is a library management system designed to help librarians manage their book inventory, members, and transactions. The system includes essential functionality such as maintaining books, managing members, handling book transactions (borrowing/returning), and charging rent fees for book returns.
Features

The system includes the following features:

  Books Management:
        Librarians can add, update, delete, and search for books.
        Books have stock information (total and available quantities).
        Books can be searched by title or author.
![Screenshot 2024-09-19 at 01 10 53](https://github.com/user-attachments/assets/c006c770-7529-44a7-977f-960b0da31931)

  Members Management:
        Librarians can add, update, delete, and search for members.
        ![Screenshot 2024-09-19 at 01 11 24](https://github.com/user-attachments/assets/8a7c9552-34e9-4385-b071-17ee74e28d94)

  Transactions:
        Books can be issued to members.
        Books can be returned by members.
        A rental fee is charged for book returns, and outstanding debts are tracked.
![Screenshot 2024-09-19 at 01 11 38](https://github.com/user-attachments/assets/2ed67452-e57c-4936-91a4-6c334a973343)

 Rent Fee and Debt Management:
		Ensure that the member’s outstanding debt does not exceed KES. 500. 
If it does, the system will not allow the member to borrow more books.
![Screenshot 2024-09-19 at 01 14 13](https://github.com/user-attachments/assets/2a78ffeb-acd2-4212-a07f-20e26b2a07c7)


Use Cases

   	CRUD Operations on Books and Members:
    The librarian can:
        Add new books or members.
        Edit existing book or member details.
        Remove books or members from the system.
        Search for a book by name or author.

 	 Issue a Book to a Member:
    The librarian can:
        Issue a book to a member, decreasing the available stock.
        Ensure that the member has no outstanding debt exceeding KES. 500.

    Return a Book from a Member:
    The librarian can:
        Record the return of a book, increasing the available stock.
        Charge a rent fee upon return.

    Debt Management:
        Ensure that the member’s outstanding debt does not exceed KES. 500. If it does, the system will not allow the member to borrow more books.

Technologies Used

    Backend: Flask (Python)
        Handles the core functionality of the system such as managing books, members, and transactions.
        Provides RESTful APIs for the frontend to interact with.

    Frontend: React.js
        Provides the user interface for the librarian to interact with the system.

    Database: SQLAlchemy (SQLite or PostgreSQL)
        Stores book, member, and transaction data.
