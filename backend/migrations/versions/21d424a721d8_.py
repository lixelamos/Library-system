"""empty message

Revision ID: 21d424a721d8
Revises: 
Create Date: 2024-09-13 20:36:46.131137

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '21d424a721d8'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('book',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=200), nullable=False),
    sa.Column('author', sa.String(length=200), nullable=True),
    sa.Column('isbn', sa.String(length=20), nullable=True),
    sa.Column('publisher', sa.String(length=100), nullable=True),
    sa.Column('page', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('charges',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('rentfee', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('member',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=100), nullable=False),
    sa.Column('email', sa.String(length=100), nullable=True),
    sa.Column('phone', sa.String(length=15), nullable=True),
    sa.Column('address', sa.String(length=200), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('stock',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('book_id', sa.Integer(), nullable=False),
    sa.Column('total_quantity', sa.Integer(), nullable=True),
    sa.Column('available_quantity', sa.Integer(), nullable=True),
    sa.Column('borrowed_quantity', sa.Integer(), nullable=True),
    sa.Column('total_borrowed', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['book_id'], ['book.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('transaction',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('member_id', sa.Integer(), nullable=False),
    sa.Column('book_id', sa.Integer(), nullable=False),
    sa.Column('issue_date', sa.DateTime(), nullable=False),
    sa.Column('return_date', sa.DateTime(), nullable=True),
    sa.Column('rent_fee', sa.Float(), nullable=True),
    sa.ForeignKeyConstraint(['book_id'], ['book.id'], ),
    sa.ForeignKeyConstraint(['member_id'], ['member.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('transaction')
    op.drop_table('stock')
    op.drop_table('member')
    op.drop_table('charges')
    op.drop_table('book')
    # ### end Alembic commands ###
