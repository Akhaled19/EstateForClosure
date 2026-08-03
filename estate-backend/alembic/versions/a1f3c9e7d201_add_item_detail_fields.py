#adds item detail fields (description, category, condition, brand, dimensions)

from alembic import op
import sqlalchemy as sa 
from sqlalchemy.dialects import postgresql

revision = "a1f3c9e7d201"
down_revision = "86db5c222c6e"
branch_labels = None
depends_on = None 

item_condition = postgresql.ENUM(
    "New", "Like New", "Good", "Poor", name="itemcondition"
)

def upgrade() -> None:
    item_condition.create(op.get_bind(), checkfirst=True)

    op.add_column("items", sa.Column("description", sa.String(), nullable=True))
    op.add_column("items", sa.Column("category", sa.String(), nullable=True))
    op.add_column(
        "items",
        sa.Column(
            "condition",
            sa.Enum("New", "Like New", "Good", "Fair", "Poor", name="itemcondition"),
            nullable=True,
        ),
    )
    op.add_column("items", sa.Column("brand", sa.String(), nullable=True))
    op.add_column("items", sa.Column("dimensions", sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column("items", "dimensions")
    op.drop_column("items", "brand")
    op.drop_column("items", "condition")
    op.drop_column("items", "category")
    op.drop_column("items", "description")
 
    item_condition.drop(op.get_bind(), checkfirst=True)