from passlib.context import CryptContext # type: ignore

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    """Возвращает хеш пароля."""
    safe_password = password.encode('utf-8')[:72]
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Проверяет соответствие открытого пароля хешу."""
    safe_password = plain_password.encode('utf-8')[:72]
    return pwd_context.verify(plain_password, hashed_password)