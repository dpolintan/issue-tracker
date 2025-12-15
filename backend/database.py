from typing import Generator
from sqlalchemy.orm import declarative_base, Session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "password")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "joby")

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

engine = create_engine(DATABASE_URL, echo=True)

Base = declarative_base()

SessionLocal = sessionmaker(bind=engine)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()