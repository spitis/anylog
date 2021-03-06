"""empty message

Revision ID: 08973d51946e
Revises: 8243795beca9
Create Date: 2016-06-08 14:33:32.638590

"""

# revision identifiers, used by Alembic.
revision = '08973d51946e'
down_revision = '8243795beca9'

from alembic import op
import sqlalchemy as sa


def upgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('users', 'sms_number',
               existing_type=sa.INTEGER(),
               type_=sa.BIGINT(),
               existing_nullable=True)
    ### end Alembic commands ###


def downgrade():
    ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('users', 'sms_number',
               existing_type=sa.BIGINT(),
               type_=sa.INTEGER(),
               existing_nullable=True)
    ### end Alembic commands ###
