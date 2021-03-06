"""empty message

Revision ID: 8243795beca9
Revises: None
Create Date: 2016-06-08 00:17:27.637598

"""

# revision identifiers, used by Alembic.
revision = '8243795beca9'
down_revision = None

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.add_column('users', sa.Column('sms_number', sa.Integer(), nullable=True))
    op.create_unique_constraint(None, 'users', ['sms_number'])
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'users', type_='unique')
    op.drop_column('users', 'sms_number')
    ### end Alembic commands ###
