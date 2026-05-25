import os
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.controllers import users, patients, medications, procedures, medical_records, employees, auth, attendances, prescriptions

app = FastAPI(title="MedManager API")

front_url = os.getenv("FRONT_URL", "http://localhost:3000").rstrip("/")
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    front_url
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(set(origins)),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(patients.router)
app.include_router(medications.router)
app.include_router(procedures.router)
app.include_router(medical_records.router)
app.include_router(employees.router)
app.include_router(attendances.router)
app.include_router(prescriptions.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to MedManager API"}
