from datetime import date
from app.core.database import SessionLocal
from app.models.employee import Role, Employee, EmploymentType
from app.models.patient import Sex
from app.models.user import User
from app.core.security import pwd_context
from decimal import Decimal

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
            social_name="Admin",
            cpf=admin_cpf,
            rg="00.000.000-0",
            birth_date=date(1980, 1, 1),
            sex=Sex.OTHER,
            marital_status="Single",
            nationality="System",
            phone="(00) 00000-0000",
            hire_date=date(2020, 1, 1),
            employment_type=EmploymentType.FULL_TIME,
            salary=Decimal("5000.00"),
            active=True,
            role_id=admin_role.id
        )
        db_session.add(admin_employee)
        db_session.commit()
        db_session.refresh(admin_employee)

    # 3. Create Sample Doctor and Nurse
    doctor_role = db_session.query(Role).filter(Role.name == 'doctor').first()
    doctor_cpf = "111.111.111-11"
    if not db_session.query(Employee).filter(Employee.cpf == doctor_cpf).first():
        doctor_employee = Employee(
            full_name="Dr. Gregory House",
            cpf=doctor_cpf,
            birth_date=date(1959, 6, 11),
            sex=Sex.MALE,
            phone="(11) 99999-1111",
            hire_date=date(2010, 5, 15),
            employment_type=EmploymentType.CONTRACTOR,
            salary=Decimal("15000.00"),
            active=True,
            role_id=doctor_role.id
        )
        db_session.add(doctor_employee)

    nurse_role = db_session.query(Role).filter(Role.name == 'nurse').first()
    nurse_cpf = "222.222.222-22"
    if not db_session.query(Employee).filter(Employee.cpf == nurse_cpf).first():
        nurse_employee = Employee(
            full_name="Florence Nightingale",
            cpf=nurse_cpf,
            birth_date=date(1985, 5, 12),
            sex=Sex.FEMALE,
            phone="(11) 98888-2222",
            hire_date=date(2015, 8, 1),
            employment_type=EmploymentType.FULL_TIME,
            salary=Decimal("6000.00"),
            active=True,
            role_id=nurse_role.id
        )
        db_session.add(nurse_employee)

    db_session.commit()

    # 4. Create Default Admin User if not exists
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
