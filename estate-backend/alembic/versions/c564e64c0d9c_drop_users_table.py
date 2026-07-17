"""drop users table

Revision ID: c564e64c0d9c
Revises: ba7cb5110d7c
Create Date: 2026-07-09 

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


#revision identifiers, used by Alembic.
revision: str = 'c564e64c0d9c'
down_revision: Union[str, Sequence[str], None] = 'ba7cb5110d7c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.drop_constraint('items_user_id_fkey', 'items', type_='foreignkey')
    op.drop_table('users')


def downgrade() -> None:
    """Downgrade schema."""
    op.create_table(
       'users',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.Column('full_name', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
    )
    op.create_foreign_key('items_user_id_fkey', 'items', 'users', ['user_id'], ['id'])
