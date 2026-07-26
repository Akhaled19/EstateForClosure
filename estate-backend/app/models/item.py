from sqlalchemy import String, Float, DateTime, ForeignKey, func, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.db.postgres import Base
import uuid, enum

class ItemStatus(str, enum.Enum):
    draft = "draft"
    listed = "listed"
    sold = "sold"
    shipped = "shipped"


class ItemCondition(str, enum.Enum):
    new = "New"
    like_new = "Like New"
    good = "Good"
    fair = "Fair"
    poor = "Poor"

class Item(Base):
    __tablename__ = "items"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=True)
    status: Mapped[ItemStatus] = mapped_column(Enum(ItemStatus), default=ItemStatus.draft)
    image_url: Mapped[str] = mapped_column(String, nullable=True)
    asking_price: Mapped[float] = mapped_column(Float, nullable=True)
    sold_price: Mapped[float] = mapped_column(Float, nullable=True)
    ebay_listing_id: Mapped[str] = mapped_column(String, nullable=True)
    mongo_metadata_id: Mapped[str] = mapped_column(String, nullable=True)  # ref to MongoDB doc
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
    description: Mapped[str] = mapped_column(String, nullable=True)
    category: Mapped[str] = mapped_column(String, nullable=True)
    condition: Mapped[ItemCondition] = mapped_column(Enum(ItemCondition), nullable=True)
    brand: Mapped[str] = mapped_column(String, nullable=True)
    dimensions: Mapped[str] = mapped_column(String, nullable=True)