"""
add ON DELETE CASCADE to item_interests.item_id

Revision ID: 7a3c9e5f2b16
Revises: 2d8f5c1e7a94
Create Date: 2026-09-10

"""
from alembic import op

revision = "7a3c9e5f2b16"
down_revision = "2d8f5c1e7a94"
branch_label = None
depends_on = None 

def upgrade() -> None:
    op.drop_constraint("item_interests_item_id_fkey", "item_interests", type_="foreignkey")
    op.create_foreign_key(
        "item_interests_item_id_fkey",
        "item_interests",
        "items",
        ["item_id"],
        ["id"],
        ondelete="CASCADE",
    )

def downgrade() -> None:
    op.drop_constraints("item_interests_item_id_fkey", "item_interests", type_="foreignkey")
    op.create_foreign_key(
        "item_interests_item_id_fkey",
        "item_interests",
        "items",
        ["item_id"],
        ["id"],
    )