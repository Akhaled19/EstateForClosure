"""
revert owner_id on family_friend_users, add unique phone + owner link table

Revision ID: 4f1a8c3d9e27
Revises: 9c4d7e2a5f18
Create Date: 2026-08-25
"""

from alembic import op
import sqlalchemy as sa 
from sqlalchemy.dialects import postgresql 

revision = "4f1a8c3d9e27"
down_revision = "9c4d7e2a5f18"
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.drop_column("family_friend_users", "owner_id")
    op.create_unique_constraint("uq_family_friend_users_phone", "family_friend_users", ["phone"])

    op.create_table(
        "family_friend_owner_links",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column(
            "family_friend_user_id",
            sa.String(),
            sa.ForeignKey("family_friend_users.id"),
            nullable=False,
        ),
        sa.Column(
            "owner_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("profiles.id"),
            nullable=False,
        ),
        sa.Column("first_visited_at", sa.DateTime(), server_default=sa.func.now()),
        sa.UniqueConstraint("family_friend_user_id", "owner_id", name="unique_visitor_owner"),
    )

def downgrade() -> None:
    op.drop_table("family_friend_owner_links")
    op.drop_constraint("uq_family_friend_users_phone", "family_friend_users", type_="unique")
    op.add_column(
        "family_friend_users",
        sa.Column("owner_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("profiles.id"), nullable=True),
    )