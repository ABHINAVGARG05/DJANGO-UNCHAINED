from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    streamlit_model_url: str = "http://localhost:8501"
    api_version: str = "v1"
    environment: str = "development"

    class Config:
        env_file = ".env" 