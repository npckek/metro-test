from typing import Annotated
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models.user import AdminUser
from app.core.security import verify_password, decode_access_token
from app.schemas.auth import UserInDB

# Схема OAuth2PasswordBearer указывает, где ожидать токен
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/token")

def authenticate_user(db: Session, email: str, password: str) -> AdminUser | None:
    """Проверяет учетные данные пользователя."""
    user = db.query(AdminUser).filter(AdminUser.email == email).first()
    if not user or not user.is_active:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

def get_user_from_token(db: Session, token: str) -> UserInDB:
    """Извлекает пользователя из JWT-токена."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Неверные учетные данные или истек срок действия токена",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # 1. Декодируем токен
    payload = decode_access_token(token)
    if not payload or "email" not in payload:
        raise credentials_exception

    email: str = payload.get("email")

    # 2. Ищем пользователя в БД по email из токена
    user = db.query(AdminUser).filter(AdminUser.email == email).first()
    if user is None:
        raise credentials_exception

    # 3. Возвращаем схему пользователя
    return UserInDB.model_validate(user)

def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)) -> UserInDB:
    """Зависимость, которая возвращает текущего активного пользователя."""
    user = get_user_from_token(db, token)
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Неактивный пользователь")
    return user

# Зависимость, требующая прав суперадмина (для защиты CRUD-роутов)
def get_current_superuser(current_user: Annotated[UserInDB, Depends(get_current_user)]):
    if not current_user.is_superuser:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Недостаточно прав")
    return current_user