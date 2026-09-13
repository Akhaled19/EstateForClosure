from sqlalchemy import String, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.db.postgres import Base
import uuid


class FamilyFriendOwnerLink(Base):
    __tablename__ = "family_friend_owner_links"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    family_friend_user_id: Mapped[str] = mapped_column(String, ForeignKey("family_friend_users.id"), nullable=False)
    owner_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=False)
    first_visited_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now())