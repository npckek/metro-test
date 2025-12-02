import os

from app.core.db import SessionLocal
from app.core.security import get_password_hash
from app.models.user import AdminUser


def create_initial_superuser():
    """Создает учетную запись суперадмина, если она не существует."""
    db = SessionLocal()
    admin_email = os.getenv("ADMIN_EMAIL")
    admin_password = os.getenv("ADMIN_PASSWORD")

    if not admin_email or not admin_password:
        print(
            "WARNING: ADMIN_EMAIL or ADMIN_PASSWORD not set in .env. Skipping superuser creation."
        )
        db.close()
        return

    existing_user = db.query(AdminUser).filter(AdminUser.email == admin_email).first()

    if not existing_user:
        hashed_password = get_password_hash(admin_password)

        superuser = AdminUser(
            email=admin_email,
            hashed_password=hashed_password,
            is_active=True,
            is_superuser=True,
        )

        db.add(superuser)
        db.commit()
        print(f"INFO: Initial superuser created with email: {admin_email}")
    else:
        print(f"INFO: Superuser with email {admin_email} already exists.")

    db.close()
