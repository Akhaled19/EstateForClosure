"""
add share_token to profiles, owner_id to family_friend_users

Revision ID: 9c4d7e2a5f18
Revises: 8b3f1c6d2a90
Create Date: 2026-08-24
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "9c4d7e2a5f18"
down_revision = "8b3f1c6d2a90"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("profiles", sa.Column("share_token", sa.String(), nullable=True))
    op.create_unique_constraint("uq_profiles_share_token", "profiles", ["share_token"])

    op.add_column(
        "family_friend_users",
        sa.Column("owner_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("profiles.id"), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("family_friend_users", "owner_id")
    op.drop_constraint("uq_profiles_share_token", "profiles", type_="unique")
    op.drop_column("profiles", "share_token")