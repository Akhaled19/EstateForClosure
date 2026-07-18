from sqlalchemy import String, DataTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.db.postgres import Base 
import uuid

class Profile(Base):
    __tablename__ = "profiles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid = True), primary_key = True)
    email: Mapped[str] = mapped_column(String, nullable=True)
    full_name: Mapped[str] = mapped_column(String, ullable=True)
    created_at: Mapped[DataTime] = mapped_column(DataTime, server_default=func.now())
    