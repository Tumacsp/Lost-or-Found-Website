# Lost-or-Found-Website
Project ของ วิชา CLIENT-SIDE WEB DEVELOPMENT (2/2024) รหัส 06016429 ITKMITL

## Pre Setup
- Python 3.x
- PostgreSQL (สำหรับการใช้งาน psycopg2)
- pip (สำหรับติดตั้ง dependencies)

## Setup Instructions

### 1. Create a virtual environment (Windows)
```bash
cd backend
py -m venv myvenv
```

### 2. Activate virtual environment (Windows)
เมื่อสร้าง virtual environment เรียบร้อยแล้ว ให้ทำการ activate เพื่อเริ่มใช้งาน:
```bash
myvenv\Scripts\activate.bat
```

# Run the Website
วิธีการเปิดโปรเจคให้ทำงานได้

## Run the Frontend
ต้องอยู่ใน Folder frontend
```bash
npm start
```
## Run the Backend
ต้องอยู่ใน Folder backend
```bash
python manage.py runserver
```
