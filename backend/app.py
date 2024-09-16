from flask import Flask, render_template, request, redirect, flash, url_for, jsonify
from flask_migrate import Migrate
from models import db, Book, Member, Transaction, Stock, Charges
import datetime
import requests
from sqlalchemy import desc
from sqlalchemy.exc import IntegrityError
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///library.db'
app.config['SECRET_KEY'] = 'af9d4e10d142994285d0c1f861a70925'
db.init_app(app)
migrate = Migrate(app, db)

@app.route('/')
def index():
    borrowed_books = db.session.query(Transaction).filter(Transaction.return_date == None).count()
    total_books = Book.query.count()
    total_members = Member.query.count()
    total_rent_current_month = calculate_total_rent_current_month()
    recent_transactions = db.session.query(Transaction, Book).join(Book).order_by(Transaction.issue_date.desc()).limit(5).all()

    return render_template('index.html', borrowed_books=borrowed_books, total_books=total_books, total_members=total_members, recent_transactions=recent_transactions, total_rent_current_month=total_rent_current_month)

def calculate_total_rent_current_month():
    current_month = datetime.datetime.now().month
    current_year = datetime.datetime.now().year
    start_date = datetime.datetime(current_year, current_month, 1)
    end_date = datetime.datetime(current_year, current_month + 1, 1) - datetime.timedelta(days=1)

    total_rent = db.session.query(db.func.sum(Transaction.rent_fee)).filter(Transaction.issue_date >= start_date, Transaction.issue_date <= end_date).scalar()

    return total_rent if total_rent else 0

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

@app.route('/view_books', methods=['POST'])
def book_list():
    data = request.get_json()
    title = data.get('searcht')
    author = data.get('searcha')

    if title and author:
        books = db.session.query(Book, Stock).join(Stock).filter(Book.title.like(f'%{title}%'), Book.author.like(f'%{author}%')).all()
    elif title:
        books = db.session.query(Book, Stock).join(Stock).filter(Book.title.like(f'%{title}%')).all()
    elif author:
        books = db.session.query(Book, Stock).join(Stock).filter(Book.author.like(f'%{author}%')).all()
    else:
        books = db.session.query(Book, Stock).join(Stock).all()

    return jsonify([{'title': book.title, 'author': book.author, 'stock': stock.total_quantity} for book, stock in books])

@app.route('/view_members', methods=['POST'])
def member_list():
    data = request.get_json()
    search = data.get('search')

    if search:
        members = db.session.query(Member).filter(Member.name.like(f'%{search}%')).all()
    else:
        members = db.session.query(Member).all()

    return jsonify([{'name': member.name, 'email': member.email} for member in members])

@app.route('/edit_book/<int:id>', methods=['POST'])
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

@app.route('/edit_member/<int:id>', methods=['POST'])
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

@app.route('/delete_member/<int:id>', methods=['POST'])
def delete_member(id):
    try:
        member = Member.query.get(id)
        db.session.delete(member)
        db.session.commit()
        return jsonify({'message': 'Member deleted successfully!'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/delete_book/<int:id>', methods=['POST'])
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

@app.route('/issuebook', methods=['POST'])
def issue_book():
    data = request.get_json()
    memberid = data.get('memberid')
    title = data.get('title')

    book = db.session.query(Book, Stock).join(Stock).filter(Book.title.like(f'%{title}%')).first() or db.session.query(Book, Stock).join(Stock).filter(Book.id == title).first()
    member = db.session.query(Member).get(memberid)
    debt = calculate_dbt(member)

    return jsonify({'book': book.title, 'member': member.name, 'debt': debt})

@app.route('/issuebookconfirm', methods=['POST'])
def issue_book_confirm():
    data = request.get_json()
    memberid = data.get('memberid')
    bookid = data.get('bookid')

    stock = db.session.query(Stock).filter_by(book_id=bookid).first()

    if stock.available_quantity <= 0:
        return jsonify({'error': 'Book is not available for issuance.'}), 400

    new_transaction = Transaction(book_id=bookid, member_id=memberid, issue_date=datetime.date.today())
    stock.available_quantity -= 1
    stock.borrowed_quantity += 1
    stock.total_borrowed += 1

    db.session.add(new_transaction)
    db.session.commit()

    return jsonify({'message': 'Transaction added successfully!'}), 201

@app.route('/transactions', methods=['POST'])
def view_borrowings():
    data = request.get_json()
    search = data.get('search')

    if search:
        transactions = db.session.query(Transaction, Member, Book).join(Book).join(Member).filter(Member.name.like(f'%{search}%')).all()
    else:
        transactions = db.session.query(Transaction, Member, Book).join(Book).join(Member).all()

    return jsonify([{'book': book.title, 'member': member.name, 'transaction_id': trans.id} for trans, member, book in transactions])

@app.route('/returnbookconfirm', methods=['POST'])
def return_book_confirm():
    data = request.get_json()
    id = data.get('id')

    trans, member = db.session.query(Transaction, Member).join(Member).filter(Transaction.id == id).first()
    stock = Stock.query.filter_by(book_id=trans.book_id).first()
    charge = Charges.query.first()

    rent_days = (datetime.date.today() - trans.issue_date.date()).days
    rent_fee = rent_days * charge.rentfee

    if stock:
        stock.available_quantity += 1
        stock.borrowed_quantity -= 1

        trans.return_date = datetime.date.today()
        trans.rent_fee = rent_fee

        member_debt = calculate_dbt(member) + rent_fee
        if member_debt >= 500:
            return jsonify({'error': f'{member.name} has an outstanding debt of KES {member_debt}.'}), 400

        db.session.commit()
        return jsonify({'message': f'{member.name} returned the book successfully. Rent fee: KES {rent_fee}'}), 200
    else:
        return jsonify({'error': 'Error updating stock information'}), 500
    
    


API_BASE_URL = "https://frappe.io/api/method/frappe-library"
@app.route('/import_book', methods=['GET', 'POST'])
def imp():
    if request.method == 'POST':
        title = request.form.get('title', default='', type=str)
        num_books = request.form.get('num_books', default=20, type=int)
        num_pages = (num_books + 19) // 20
        all_books = []
        for page in range(1, num_pages + 1):
            url = f"{API_BASE_URL}?page={page}&title={title}"
            response = requests.get(url)
            data = response.json()
            all_books.extend(data.get('message', []))  
        return render_template('imp.html', data=all_books[:num_books], title=title, num_books=num_books)


    return render_template('imp.html', data=[], title='', num_books=20)
@app.route('/save_all_books', methods=['POST'])
def save_all_books():
    data = request.get_json()

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
            stock = book_data['stock']

            try:
                db.session.add(book)
                stock = Stock(book_id=book_id, total_quantity=stock, available_quantity=stock)
                db.session.add(stock)
                db.session.commit()
            except IntegrityError as e:
                db.session.rollback()
                print(f"Error adding book with ID {book_id}: {str(e)}")
        else:
            print(f"Book with ID {book_id} already exists, skipping.")

    return jsonify({'message': 'Books added successfully!'}), 201

@app.route('/stockupdate/<int:id>', methods=['POST'])
def stock_update(id):
    stock, book = db.session.query(Stock, Book).join(Book).filter(Stock.book_id == id).first()
    data = request.get_json()
    qty = int(data.get('qty'))

    if qty > stock.total_quantity:
        stock.available_quantity += qty
        stock.total_quantity += qty
    else:
        stock.available_quantity -= qty
        stock.total_quantity -= qty

    db.session.commit()
    return jsonify({'message': 'Stock updated successfully!'}), 200
