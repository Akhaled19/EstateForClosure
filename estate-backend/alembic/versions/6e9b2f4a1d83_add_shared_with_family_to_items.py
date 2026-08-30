"""
move shared_with_family from item_interests to items

Revision ID: 6e9b2f4a1d83
Revises: 4f1a8c3d9e27
Create Date: 2026-08-27
"""

from alembic import op 
import sqlalchemy as sa 

revision = "6e9b2f4a1d83"
down_revision = "4f1a8c3d9e27"
branch_labels = None 
depends_on = None

def upgrade() -> None:
    op.add_column("items", sa.Column("shared_with_family", sa.Boolean(), server_default=sa.false(), nullable=False))
    op.drop_column("item_interests", "shared_with_family")


def downgrade() -> None:
    op.add_column("item_interests", sa.Column("shared_with_family", sa.Boolean(), server_default=sa.false()))
    op.drop_column("items", "shared_with_family")