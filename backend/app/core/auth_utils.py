from typing import Annotated
from fastapi import Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.models.user import AdminUser
from app.core.security import verify_password, decode_access_token
from app.schemas.auth import UserInDB


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

    payload = decode_access_token(token)
    if not payload or "email" not in payload:
        raise credentials_exception

    email: str = payload.get("email")

    user = db.query(AdminUser).filter(AdminUser.email == email).first()
    if user is None:
        raise credentials_exception

    return UserInDB.model_validate(user)

def get_token_from_cookie(request: Request) -> str:
    """Извлекает токен из HTTP-Only куки."""
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Требуется аутентификация (токен отсутствует в куках)",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return token

def get_current_user(token: Annotated[str, Depends(get_token_from_cookie)], db: Session = Depends(get_db)) -> UserInDB:
    """Зависимость, которая возвращает текущего активного пользователя."""
    user = get_user_from_token(db, token)
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Неактивный пользователь")
    return user

def get_current_superuser(current_user: Annotated[UserInDB, Depends(get_current_user)]):
    if not current_user.is_superuser:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Недостаточно прав")
    return current_user