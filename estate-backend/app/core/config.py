from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_ENV: str = "development"
    DATABASE_URL: str
    MONGO_URI: str
    MONGO_DB: str = "estate_db"
    REDIS_URL: str
    SUPABASE_URL: str
    SUPABASE_PUBLISHABLE_KEY: str
    SUPABASE_SECRET_KEY: str
    ANTHROPIC_API_KEY: str 

    class Config:
        env_file = ".env"

settings = Settings()
