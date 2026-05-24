from app.core.database import SessionLocal
from app.models.user import Role, User
from app.core.security import pwd_context

def seed_data():
    db = SessionLocal()
    # 1. Create Roles
    roles = ['admin', 'doctor', 'nurse']
    for role_name in roles:
        if not db.query(Role).filter(Role.name == role_name).first():
            db.add(Role(name=role_name))

    db.commit()

    # 2. Create Default Admin if not exists
    admin_role = db.query(Role).filter(Role.name == 'admin').first()
    if not db.query(User).filter(User.email == "admin@medmanager.com").first():
        admin_user = User(
            full_name="System Admin",
            email="admin@medmanager.com",
            hashed_password=pwd_context.hash("admin123"),
            role_id=admin_role.id
        )
        db.add(admin_user)
        db.commit()
    db.close()

if __name__ == "__main__":
    print("Seeding database...")
    seed_data()
    print("Done!")
