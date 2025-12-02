import os
from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt  # type: ignore
from passlib.context import CryptContext  # type: ignore

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    """Возвращает хеш пароля."""
    return pwd_context.hash(password)  # type: ignore[no-any-return]


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Проверяет соответствие открытого пароля хешу."""
    return pwd_context.verify(plain_password, hashed_password)  # type: ignore[no-any-return]


SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """Создает JWT-токен доступа."""
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode.update({"exp": expire, "sub": "access"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt  # type: ignore[no-any-return]


def decode_access_token(token: str) -> dict[str, Any]:
    """Декодирует JWT-токен."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload  # type: ignore[no-any-return]
    except JWTError:
        return {}
