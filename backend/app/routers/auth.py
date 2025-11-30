from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.db import get_db
from app.core.auth_utils import authenticate_user
from app.core.security import create_access_token
from app.schemas.auth import TokenRequest, Token
from datetime import timedelta
from app.core.security import ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/token", response_model=Token, summary="Вход администратора (получение JWT)")
def login_for_access_token(
    form_data: TokenRequest,
    db: Session = Depends(get_db)
):
    # 1. Аутентификация
    user = authenticate_user(db, form_data.email, form_data.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный email или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # 2. Создание токена
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"email": user.email, "id": user.id},
        expires_delta=access_token_expires
    )

    # 3. Возврат токена
    return Token(access_token=access_token, expires_in_minutes=ACCESS_TOKEN_EXPIRE_MINUTES)