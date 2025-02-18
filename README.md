# College ERP System

A comprehensive Enterprise Resource Planning system for educational institutions.

## Tech Stack

### Frontend
- React.js
- Tailwind CSS / Material UI
- Redux Toolkit
- React Hook Form + Yup
- Axios
- JWT Authentication

### Backend
- Django
- Django REST Framework
- Knox Token Authentication
- Celery
- PostgreSQL

## Setup Instructions

### Backend Setup
```bash
cd backend
python -m venv env
source env/bin/activate  # For Windows: .\env\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Features
- User Authentication & Authorization
- Academic Management
- Faculty Management
- Student Management
- Examination System
- Fee Management
- Attendance System
- Document Management
