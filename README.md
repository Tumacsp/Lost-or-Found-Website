# Lost-or-Found-Website
Project ของ วิชา CLIENT-SIDE WEB DEVELOPMENT (2/2024) รหัส 06016429 ITKMITL

## Pre Setup
- Python 3.x
- PostgreSQL (สำหรับการใช้งาน psycopg2)
- pip (สำหรับติดตั้ง dependencies)

## Setup Instructions

### 1. Create Django a virtual environment (Windows)
```bash
cd backend
py -m venv myvenv
```

### 2. Activate Django virtual environment (Windows)
เมื่อสร้าง virtual environment เรียบร้อยแล้ว ให้ทำการ activate เพื่อเริ่มใช้งาน:
```bash
myvenv\Scripts\activate.bat
```

### 3. pip install
```bash
pip install django psycopg2 python-decouple djangorestframework django-cors-headers djangorestframework-simplejwt Pillow
```

### 4. เข้า folder frontend โดยเปิด cmd อีกตัวขึ้นมา
```bash
cd frontend
npm install axios react-router-dom
npm install -D tailwindcss postcss autoprefixer
npm install tailwindcss-animate class-variance-authority clsx tailwind-merge lucide-react
```


## สร้างไฟล์ .env
```bash
# database config
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=

# email sender
EMAIL_BACKEND = ''
EMAIL_HOST = ''
EMAIL_PORT = 
EMAIL_USE_TLS = 
EMAIL_HOST_USER = ''
EMAIL_HOST_PASSWORD = ''
```

## How to Run the Website

### 1. Run the Frontend ต้องอยู่ใน Folder frontend
```bash
cd frontend
npm start
```

### 2. Run the Backend ต้องอยู่ใน Folder backend
```bash
cd backend
py -m venv myvenv
python manage.py runserver
```
