from pydantic import BaseModel


class TokenRequest(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in_minutes: int = 30


class UserInDB(BaseModel):
    email: str
    is_active: bool
    is_superuser: bool

    class Config:
        from_attributes = True
