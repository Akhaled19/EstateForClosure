#make items.image_url not nullable
#revision ID: 7e2b4a9f1c33
#Revises: a1f3c9e7d201

from alembic import op
import sqlalchemy as sa 

revision = "7e2b4a9f1c33"
down_revision = "a1f3c9e7d201"
branch_labels = None 
depends_on = None 

def upgrade() -> None:
    op.alter_column("items", "image_url", existing_type= sa.String(), nullable=False)


def downgrade() -> None:
    op.alter_column("items", "image_url", existing_type= sa.String(), nullable=True)


