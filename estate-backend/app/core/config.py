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
    EBAY_APP_ID: str
    EBAY_DEV_ID: str
    EBAY_CERT_ID: str
    EBAY_RU_NAME: str
    EBAY_ENVIRONMENT: str
    EBAY_USER_TOKEN: str
    EBAY_REFRESH_TOKEN: str
    EBAY_PAYMENT_POLICY_ID: str
    EBAY_FULFILLMENT_POLICY_ID: str
    EBAY_RETURN_POLICY_ID: str

    class Config:
        env_file = ".env"

settings = Settings()

