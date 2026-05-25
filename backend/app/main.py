import os
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.controllers import users, patients, medications, procedures, medical_records, employees, auth

app = FastAPI(title="MedManager API")

front_url = os.getenv("FRONT_URL", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[front_url],
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

@app.get("/")
def read_root():
    return {"message": "Welcome to MedManager API"}
