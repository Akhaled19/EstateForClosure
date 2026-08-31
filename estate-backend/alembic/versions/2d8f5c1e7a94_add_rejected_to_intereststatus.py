"""
add rejected status to intereststatus enum

Revision ID: 2d8f5c1e7a94
Revises: 6e9b2f4a1d83
Create Date: 2026-08-28
"""
from alembic import op

revision = "2d8f5c1e7a94"
down_revision = "6e9b2f4a1d83"
branch_labels = None
depends_on = None


def upgrade() -> None:
    with op.get_context().autocommit_block():
        op.execute("ALTER TYPE intereststatus ADD VALUE IF NOT EXISTS 'rejected'")


def downgrade() -> None:
    # Postgres has no direct "remove enum value" operation.
    # flag manually if a true rollback is required.
    pass