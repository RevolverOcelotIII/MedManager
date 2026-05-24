from datetime import date
from app.core.database import SessionLocal
from app.models.employee import Role, Employee
from app.models.user import User
from app.core.security import pwd_context

def seed_data():
    db_session = SessionLocal()
    # 1. Create Roles
    roles = ['admin', 'doctor', 'nurse']
    for role_name in roles:
        if not db_session.query(Role).filter(Role.name == role_name).first():
            db_session.add(Role(name=role_name))

    db_session.commit()

    # 2. Create Default Admin Employee if not exists
    admin_role = db_session.query(Role).filter(Role.name == 'admin').first()
    admin_cpf = "000.000.000-00"
    
    admin_employee = db_session.query(Employee).filter(Employee.cpf == admin_cpf).first()
    if not admin_employee:
        admin_employee = Employee(
            full_name="System Administrator",
            cpf=admin_cpf,
            birth_date=date(1980, 1, 1),
            role_id=admin_role.id
        )
        db_session.add(admin_employee)
        db_session.commit()
        db_session.refresh(admin_employee)

    # 3. Create Default Admin User if not exists
    if not db_session.query(User).filter(User.email == "admin@medmanager.com").first():
        admin_user = User(
            email="admin@medmanager.com",
            hashed_password=pwd_context.hash("admin123"),
            employee_id=admin_employee.id
        )
        db_session.add(admin_user)
        db_session.commit()
        
    db_session.close()

if __name__ == "__main__":
    print("Seeding database...")
    seed_data()
    print("Done!")
