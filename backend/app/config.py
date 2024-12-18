from pydantic_settings import BaseSettings
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    TEMP_UPLOAD_DIR: str = os.getenv("TEMP_UPLOAD_DIR", "temp_files")

    class Config:
        env_file = ".env"

settings = Settings() 