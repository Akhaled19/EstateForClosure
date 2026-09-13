"""
create family_friend_users and item_interests tables

Revision ID: 8b3f1c6d2a90
Revises: 7e2b4a9f1c33
Create Date: 2026-08-24
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import ENUM as PGEnum

revision = "8b3f1c6d2a90"
down_revision = "7e2b4a9f1c33"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "family_friend_users",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("phone", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
    )

    op.execute("""
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'intereststatus') THEN
                CREATE TYPE intereststatus AS ENUM ('unclaimed', 'claimed');
            END IF;
        END$$;
    """)

    op.create_table(
        "item_interests",
        sa.Column("id", sa.String(), primary_key=True),
        sa.Column("item_id", sa.String(), sa.ForeignKey("items.id"), nullable=False),
        sa.Column(
            "family_friend_user_id",
            sa.String(),
            sa.ForeignKey("family_friend_users.id"),
            nullable=False,
        ),
        sa.Column(
            "status",
            PGEnum("unclaimed", "claimed", name="intereststatus", create_type=False),
            server_default="unclaimed",
        ),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now()),
        sa.Column("shared_with_family", sa.Boolean(), server_default=sa.false()),
        sa.UniqueConstraint("item_id", "family_friend_user_id", name="unique_item_family_friend"),
    )


def downgrade() -> None:
    op.drop_table("item_interests")
    op.execute("DROP TYPE IF EXISTS intereststatus")
    op.drop_table("family_friend_users")