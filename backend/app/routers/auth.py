from datetime import timedelta

from app.core.auth_utils import authenticate_user, get_current_user
from app.core.db import get_db
from app.core.security import ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token
from app.schemas.auth import TokenRequest, UserInDB
from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post(
    "/token",
    status_code=status.HTTP_200_OK,
    summary="Вход администратора (получение JWT)",
)
def login_for_access_token(
    form_data: TokenRequest, response: Response, db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.email, form_data.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный email или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"email": user.email, "id": user.id}, expires_delta=access_token_expires
    )

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=int(access_token_expires.total_seconds()),
    )

    return {"message": "Успешный вход"}


@router.post("/logout", summary="Выход администратора (удаление JWT)")
def logout_admin(response: Response):
    """Удаляет JWT-токен из куки."""
    response.delete_cookie(key="access_token")
    return {"message": "Успешный выход"}


@router.get("/status", summary="Проверить статус аутентификации")
def check_auth_status(current_user: UserInDB = Depends(get_current_user)):
    """Возвращает статус 200 OK, если пользователь аутентифицирован.
    Если кука невалидна, get_current_user выбросит 401."""
    return {"is_authenticated": True, "email": current_user.email}
