"""add fk items user_id to profiles

Revision ID: 86db5c222c6e
Revises: c564e64c0d9c
Create Date: 2026-07-09

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '86db5c222c6e'
down_revision: Union[str, Sequence[str], None] = 'c564e64c0d9c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.alter_column(
        'items',
        'user_id',
        existing_type=sa.String(),
        type_=postgresql.UUID(as_uuid=True),
        postgresql_using='user_id::uuid',
    )
    op.create_foreign_key(
        'items_user_id_fkey',
        'items',
        'profiles',
        ['user_id'],
        ['id'],
        source_schema='public',
        referent_schema='public',
        ondelete='RESTRICT',
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint('items_user_id_fkey', 'items', type_='foreignkey', schema='public')
    op.alter_column(
        'items',
        'user_id',
        existing_type=postgresql.UUID(as_uuid=True),
        type_=sa.String(),
    )