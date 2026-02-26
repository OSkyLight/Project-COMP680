# Backend Setup and Run Guide

## 1. Prerequisites

You must install:

- Python 3.9 or higher
- Git
- (Optional) VSCode

Check Python version:

python --version

---

## 2. Clone the Repository

Using GitHub Desktop (recommended)
OR

Using command line:

git clone https://github.com/OskyLight/Project-COMP680.git
cd Project-COMP680

---

## 3. Navigate to Backend Folder

cd back-end

---

## 4. Create Virtual Environment

Windows:

python -m venv .venv

Mac/Linux:

python3 -m venv .venv

---

## 5. Activate Virtual Environment

Windows (PowerShell):

.venv\Scripts\activate

Mac/Linux:

source .venv/bin/activate

You should see:

(.venv)

in your terminal.

---

## 6. Install Dependencies

pip install -r requirements.txt

This installs:

- fastapi
- uvicorn
- sqlalchemy
- pydantic

---

## 7. Run the Server

python -m uvicorn app.main:app --reload

If successful, you will see:

Uvicorn running on http://127.0.0.1:8000

---

## 8. Test API

Open browser:

http://127.0.0.1:8000/docs

Swagger UI will appear.

You can test:

- Create student
- Create courses
- Create offerings
- Call /plan

---

## 9. Database Location

SQLite file:

back-end/app.db

It is auto-generated.

---

## 10. Common Errors

Error: "uvicorn not recognized"
→ Use:
python -m uvicorn app.main:app --reload

Error: Module not found
→ Make sure virtual environment is activated.

Error: Port already in use
→ Stop previous server or change port:
python -m uvicorn app.main:app --reload --port 8001