from fastapi import FastAPI
from app.controllers import users, patients, medications, procedures, medical_records, employees

app = FastAPI(title="MedManager API")

app.include_router(users.router)
app.include_router(patients.router)
app.include_router(medications.router)
app.include_router(procedures.router)
app.include_router(medical_records.router)
app.include_router(employees.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to MedManager API"}
