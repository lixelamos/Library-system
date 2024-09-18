from flask import Flask, request, jsonify
from flask_migrate import Migrate
from models import db, Book, Member, Transaction, Stock, Charges
import requests
import datetime
from sqlalchemy.exc import IntegrityError
from sqlalchemy import desc  # Add this import for ordering
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///library.db'
app.config['SECRET_KEY'] = 'af9d4e10d142994285d0c1f861a70925'
db.init_app(app)
migrate = Migrate(app, db)

# Index route to return summary data
@app.route('/')
def index():
    borrowed_books = db.session.query(Transaction).filter(Transaction.return_date == None).count()
    total_books = Book.query.count()
    total_members = Member.query.count()
    total_rent_current_month = calculate_total_rent_current_month()

    return jsonify({
        'borrowed_books': borrowed_books,
        'total_books': total_books,
        'total_members': total_members,
        'total_rent_current_month': total_rent_current_month
    })

# Helper function to calculate rent
def calculate_total_rent_current_month():
    current_month = datetime.datetime.now().month
    current_year = datetime.datetime.now().year
    start_date = datetime.datetime(current_year, current_month, 1)
    end_date = datetime.datetime(current_year, current_month + 1, 1) - datetime.timedelta(days=1)

    total_rent = db.session.query(db.func.sum(Transaction.rent_fee)).filter(Transaction.issue_date >= start_date, Transaction.issue_date <= end_date).scalar()

    return total_rent if total_rent else 0

# Add a new book
@app.route('/add_book', methods=['POST'])
def add_book():
    data = request.get_json()
    title = data.get('title')
    author = data.get('author')
    isbn = data.get('isbn')
    publisher = data.get('publisher')
    page = data.get('page')
    stock = data.get('stock')

    if not title or not author or not isbn or not publisher or not page or not stock:
        return jsonify({'error': 'All fields are required'}), 400

    new_book = Book(title=title, author=author, isbn=isbn, publisher=publisher, page=page)
    db.session.add(new_book)
    db.session.flush()

    new_stock = Stock(book_id=new_book.id, total_quantity=stock, available_quantity=stock)
    db.session.add(new_stock)
    db.session.commit()

    return jsonify({'message': 'Book added successfully!'}), 201

# Add a new member
@app.route('/add_member', methods=['POST'])
def add_member():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')
    address = data.get('address')

    if not name or not email or not phone or not address:
        return jsonify({'error': 'All fields are required'}), 400

    new_member = Member(name=name, email=email, phone=phone, address=address)
    db.session.add(new_member)
    db.session.commit()

    return jsonify({'message': 'Member added successfully!'}), 201

# View all books or search books
@app.route('/view_books', methods=['GET', 'POST'])
def book_list():
    data = request.get_json() if request.method == 'POST' else {}
    title = data.get('searcht', '')
    author = data.get('searcha', '')

    query = db.session.query(Book, Stock).join(Stock)
    
    if title:
        query = query.filter(Book.title.ilike(f'%{title}%'))
    
    if author:
        query = query.filter(Book.author.ilike(f'%{author}%'))
    
    books = query.all()
    
    return jsonify([{
        'id': book.id,
        'title': book.title,
        'author': book.author,
        'isbn': book.isbn,
        'publisher': book.publisher,
        'page': book.page,
        'stock': {
            'total_quantity': stock.total_quantity,
            'available_quantity': stock.available_quantity,
        }
    } for book, stock in books])
@app.route('/view_book/<int:id>', methods=['GET'])
def view_book(id):
    book = Book.query.get(id)
    stock = Stock.query.filter_by(book_id=id).first()
    transactions = Transaction.query.filter_by(book_id=id).all()

    if not book:
        return jsonify({'error': 'Book not found'}), 404

    return jsonify({
        'book': {
            'id': book.id,
            'title': book.title,
            'author': book.author,
            'isbn': book.isbn,
            'publisher': book.publisher,
            'page': book.page,
        },
        'stock': {
            'total_quantity': stock.total_quantity if stock else 0,
            'available_quantity': stock.available_quantity if stock else 0
        },
        'transactions': [
            {
                'id': trans.id,
                'issue_date': trans.issue_date,
                'return_date': trans.return_date
            } for trans in transactions
        ]
    }), 200


# View all members or search members
@app.route('/view_members', methods=['GET', 'POST'])
def member_list():
    data = request.get_json() if request.method == 'POST' else {}
    search = data.get('search', '')

    query = db.session.query(Member)
    if search:
        query = query.filter(Member.name.like(f'%{search}%'))

    members = query.all()
    return jsonify([{
        'id': member.id,
        'name': member.name,
        'email': member.email,
        'phone': member.phone,
        'address': member.address,
    } for member in members])

# Edit book details
@app.route('/edit_book/<int:id>', methods=['GET','POST'])
def edit_book(id):
    book = Book.query.get(id)
    stock = Stock.query.get(book.id)
    data = request.get_json()

    try:
        book.title = data.get('title')
        book.author = data.get('author')
        book.isbn = data.get('isbn')
        book.publisher = data.get('publisher')
        book.page = data.get('page')
        stock.total_quantity = data.get('stock')

        db.session.commit()
        return jsonify({'message': 'Book updated successfully!'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Edit member details
@app.route('/edit_member/<int:id>', methods=['GET','POST'])
def edit_member(id):
    member = Member.query.get(id)
    data = request.get_json()

    try:
        member.name = data.get('name')
        member.phone = data.get('phone')
        member.email = data.get('email')
        member.address = data.get('address')
        db.session.commit()

        return jsonify({'message': 'Member updated successfully!'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# Delete member
@app.route('/delete_member/<int:id>', methods=['GET','POST'])
def delete_member(id):
    try:
        member = Member.query.get(id)
        db.session.delete(member)
        db.session.commit()
        return jsonify({'message': 'Member deleted successfully!'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Delete book
@app.route('/delete_book/<int:id>', methods=['GET','POST'])
def delete_book(id):
    try:
        book = Book.query.get(id)
        stock = Stock.query.get(book.id)
        db.session.delete(book)
        db.session.delete(stock)
        db.session.commit()
        return jsonify({'message': 'Book deleted successfully!'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# View a member and their transactions
@app.route('/view_member/<int:id>', methods=['GET'])
def view_member(id):
    member = Member.query.get(id)
    if not member:
        return jsonify({'error': 'Member not found'}), 404
    
    transactions = Transaction.query.filter_by(member_id=member.id).all()
    debt = calculate_dbt(member)

    return jsonify({
        'member': {
            'id': member.id,
            'name': member.name,
            'email': member.email,
            'phone': member.phone,
            'address': member.address,
        },
        'transactions': [{
            'id': trans.id,
            'issue_date': trans.issue_date,
            'return_date': trans.return_date,
            'rent_fee': trans.rent_fee
        } for trans in transactions],
        'debt': debt
    })

# Calculate debt function
def calculate_dbt(member):
    dbt = 0
    charge = db.session.query(Charges).first()
    transactions = db.session.query(Transaction).filter_by(member_id=member.id, return_date=None).all()

    for transaction in transactions:
        days_difference = (datetime.date.today() - transaction.issue_date.date()).days
        if days_difference > 0:
            dbt += days_difference * charge.rentfee
    return dbt

# Issue book to a member
@app.route('/issuebook', methods=['GET', 'POST'])
def issue_book():
    data = request.get_json()
    memberid = data.get('memberid')
    title = data.get('title')

    # Query for the book
    book = db.session.query(Book, Stock).join(Stock).filter(Book.title.like(f'%{title}%')).first()

    if not book:
        return jsonify({'error': 'Book not found'}), 404

    # Query for the member
    member = db.session.query(Member).get(memberid)

    if not member:
        return jsonify({'error': 'Member not found'}), 404

    debt = calculate_dbt(member)

    # Adjust the structure of the response
    return jsonify({
        'book': {
            'id': book.Book.id,
            'title': book.Book.title,
            'author': book.Book.author,
            'isbn': book.Book.isbn,
            'publisher': book.Book.publisher,
            'page': book.Book.page,
            'total_quantity': book.Stock.total_quantity,
            'available_quantity': book.Stock.available_quantity,
            'borrowed_quantity': book.Stock.borrowed_quantity,
            'total_borrowed': book.Stock.total_borrowed
        },
        'member': {
            'id': member.id,
            'name': member.name,
            'address': member.address,
            'phone': member.phone,
            'email': member.email
        },
        'debt': debt
    })

# Confirm book issuance
@app.route('/issuebookconfirm', methods=['GET','POST'])
def issue_book_confirm():
    data = request.get_json()
    memberid = data.get('memberid')
    bookid = data.get('bookid')

    stock = db.session.query(Stock).filter_by(book_id=bookid).first()
    if stock.available_quantity <= 0:
        return jsonify({'error': 'Book not available'}), 400

    new_transaction = Transaction(book_id=bookid, member_id=memberid, issue_date=datetime.date.today())
    stock.available_quantity -= 1
    db.session.add(new_transaction)
    db.session.commit()

    return jsonify({'message': 'Book issued successfully!'}), 201

# Return a book
@app.route('/returnbook/<int:id>', methods=['GET'])
def return_book(id):
    # Fetch transaction
    transaction = Transaction.query.get(id)
    
    if not transaction:
        return jsonify({'error': 'Transaction not found'}), 404

    # Assuming Transaction has relationships to Book and Member
    book = Book.query.get(transaction.book_id)
    member = Member.query.get(transaction.member_id)

    rent_days = (datetime.date.today() - transaction.issue_date.date()).days
    rent_fee = rent_days * 10  # Rent fee per day

    # Return all necessary data to the frontend
    return jsonify({
        'trans': {
            'id': transaction.id,
            'issue_date': transaction.issue_date,
            'return_date': transaction.return_date,
            'rent_fee': transaction.rent_fee
        },
        'book': {
            'id': book.id,
            'title': book.title,
            'author': book.author,
            'isbn': book.isbn,
            'publisher': book.publisher,
            'page': book.page
        },
        'member': {
            'id': member.id,
            'name': member.name,
            'email': member.email,
            'phone': member.phone,
            'address': member.address
        },
        'rent': rent_fee
    }), 200

# Confirm book return
@app.route('/returnbookconfirm', methods=['POST'])
def return_book_confirm():
    print("POST request received at /returnbookconfirm")
    data = request.get_json()
    trans_id = data.get('id')

    # Fetch the transaction record by its ID
    trans = Transaction.query.get(trans_id)
    if not trans:
        return jsonify({'message': 'Transaction not found!'}), 404

    # Fetch the stock information for the book being returned
    stock = Stock.query.filter_by(book_id=trans.book_id).first()
    if not stock:
        return jsonify({'message': 'Book stock not found!'}), 404

    # Fetch the charges information (e.g., rent fee per day)
    charge = Charges.query.first()
    if not charge:
        return jsonify({'message': 'Charges information not found!'}), 404

    # Calculate the rent fee based on the number of days the book was borrowed
    rent_days = (datetime.date.today() - trans.issue_date.date()).days
    rent_fee = rent_days * charge.rentfee

    # Fetch the member who borrowed the book
    member = Member.query.get(trans.member_id)
    if not member:
        return jsonify({'message': 'Member not found!'}), 404

    # Calculate the member's total outstanding debt, including this transaction
    current_debt = db.session.query(db.func.sum(Transaction.rent_fee)).filter(
        Transaction.member_id == member.id,
        Transaction.return_date == None  # Only consider unreturned books
    ).scalar() or 0  # Use 0 if no debt found

    new_total_debt = current_debt + rent_fee

    # Check if the member's debt exceeds KES 500
    if new_total_debt > 500:
        return jsonify({
            'message': f'Return denied! Member\'s total debt would exceed 500 KES. Current debt is {current_debt} KES.',
            'current_debt': current_debt,
            'new_total_debt': new_total_debt
        }), 400

    # Update the stock and transaction details if debt is within the limit
    stock.available_quantity += 1  # Increase the available quantity in stock
    trans.return_date = datetime.date.today()  # Mark the book as returned
    trans.rent_fee = rent_fee  # Update the transaction with the rent fee

    db.session.commit()  # Commit the changes to the database

    return jsonify({
        'message': 'Book returned successfully!',
        'rent_fee': rent_fee,
        'total_debt': new_total_debt
    }), 200
@app.route('/transactions', methods=['GET', 'POST'])
def view_borrowings():
    transactions = db.session.query(Transaction, Member, Book).join(Book).join(Member).order_by(desc(Transaction.return_date.is_(None))).all()

    if request.method == "POST":
        data = request.get_json()
        search = data.get('search', '')

        if search:
            transactions = db.session.query(Transaction, Member, Book).join(Book).join(Member).filter(
                (Member.name.ilike(f'%{search}%')) | (Transaction.id == search)
            ).order_by(desc(Transaction.return_date.is_(None))).all()
        else:
            transactions = db.session.query(Transaction, Member, Book).join(Book).join(Member).order_by(desc(Transaction.return_date.is_(None))).all()

    return jsonify([{
        'trans': {
            'id': transaction.Transaction.id,
            'issue_date': transaction.Transaction.issue_date,
            'return_date': transaction.Transaction.return_date,
            'rent_fee': transaction.Transaction.rent_fee
        },
        'book': {
            'id': transaction.Book.id,
            'title': transaction.Book.title
        },
        'member': {
            'id': transaction.Member.id,
            'name': transaction.Member.name
        }
    } for transaction in transactions])
API_BASE_URL = "https://frappe.io/api/method/frappe-library"


@app.route('/proxy_import_books', methods=['GET'])
def proxy_import_books():
    title = request.args.get('title')
    limit = request.args.get('limit')
    try:
        response = requests.get(f'{API_BASE_URL}?title={title}&limit={limit}')
        response.raise_for_status()  # Raise an error for bad responses
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500  # Return a 500 error with the exception message
@app.route('/save_all_books', methods=['POST'])
def save_all_books():
    data = request.json

    added_books = []
    skipped_books = []
    errors = []

    for book_data in data:
        book_id = book_data['id']
        existing_book = Book.query.get(book_id)

        if existing_book is None:
            book = Book(
                id=book_id,
                title=book_data['title'],
                author=book_data['authors'],
                isbn=book_data['isbn'],
                publisher=book_data['publisher'],
                page=book_data['numPages']
            )
            st = book_data['stock']

            try:
                db.session.add(book)
                stock = Stock(book_id=book_id, total_quantity=st, available_quantity=st)
                db.session.add(stock)
                db.session.commit()
                added_books.append(book_id)
            except IntegrityError as e:
                db.session.rollback()  
                errors.append(f"Error adding book with ID {book_id}: {str(e)}")
        else:
            skipped_books.append(book_id)

    return jsonify({
        "message": "Books processed successfully",
        "added_books": added_books,
        "skipped_books": skipped_books,
        "errors": errors
    })

# Update stock quantity
@app.route('/stockupdate/<int:id>', methods=['GET','POST'])
def stock_update(id):
    stock = Stock.query.filter_by(book_id=id).first()
    data = request.get_json()
    qty = int(data.get('qty'))

    if qty > stock.total_quantity:
        stock.available_quantity += (qty - stock.total_quantity)
        stock.total_quantity = qty
    else:
        stock.available_quantity -= (stock.total_quantity - qty)
        stock.total_quantity = qty

    db.session.commit()
    return jsonify({'message': 'Stock updated successfully!'}), 200

if __name__ == '__main__':
    app.run(debug=True)