from sqlalchemy import String, Float, DateTime, ForeignKey, func, Enum, Boolean, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from app.db.postgres import Base
import uuid, enum
from sqlalchemy.dialects.postgresql import UUID

class InterestStatus(str, enum.Enum):
    unclaimed = "unclaimed"
    claimed = "claimed"


class ItemInterest(Base):
    __tablename__ = "item_interests"

    __table_args__ = (
        UniqueConstraint('item_id', 'family_friend_user_id', name='unique_item_family_friend'),
    )

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    item_id: Mapped[str] = mapped_column(String, ForeignKey("items.id"), nullable=False)
    family_friend_user_id: Mapped[str] = mapped_column(String, ForeignKey("family_friend_users.id"), nullable=False)
    status: Mapped[InterestStatus] = mapped_column(Enum(InterestStatus), default=InterestStatus.unclaimed)
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())