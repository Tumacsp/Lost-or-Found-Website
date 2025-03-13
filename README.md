# Lost-or-Found-Website

โครงงานเว็บไซต์ "Lost or Found Website" มีวัตถุประสงค์หลักเพื่อเป็นศูนย์กลางในการแจ้งตามหาของหาย คนหาย หรือสัตว์เลี้ยงหาย ผ่านระบบออนไลน์ที่มีรูปแบบคล้ายใบค่าหัวจากเรื่อง One Piece โดยผู้ใช้สามารถกำหนดสถานะของสิ่งที่ต้องการตามหา (เช่น ต้องการพบตัว หรือพบได้ทั้งในสภาพสมบูรณ์และไม่สมบูรณ์) พร้อมทั้งตั้งค่าหัว (ค่าตอบแทน) จำนวนเงินที่ต้องการได้

Project วิชา CLIENT-SIDE WEB DEVELOPMENT (2/2024) รหัส 06016429 ITKMITL

## Pre Setup

- Python 3.x
- PostgreSQL (สำหรับการใช้งาน psycopg2)
- pip (สำหรับติดตั้ง dependencies)
- Node.js และ npm

## Frontend Dependencies

Libraries หลักที่ใช้ใน React:

- **axios**: สำหรับทำ HTTP requests
- **react-router-dom**: สำหรับการจัดการเส้นทาง (routing) ในแอปพลิเคชัน React
- **tailwindcss**: CSS framework สำหรับการออกแบบ UI
- **tailwindcss-animate, class-variance-authority, clsx, tailwind-merge, lucide-react**: ส่วนขยายของ Tailwind สำหรับ animations และ components
- **recharts**: สำหรับสร้างกราฟและชาร์ต
- **leaflet, react-leaflet**: สำหรับแสดงแผนที่แบบโต้ตอบได้

## Backend Dependencies

ไฟล์ requirements.txt ประกอบด้วย:

- asgiref==3.8.1
- Django==5.1.4
- django-cors-headers==4.6.0
- djangorestframework==3.15.2
- djangorestframework-simplejwt==5.3.1
- pillow==11.1.0
- psycopg2==2.9.10
- PyJWT==2.10.1
- python-decouple==3.8
- sqlparse==0.5.3
- tzdata==2024.2

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

### 3. ติดตั้ง Backend Dependencies
เข้าสู่โฟลเดอร์ backend แล้วรันคำสั่งต่อไปนี้เพื่อติดตั้ง Python dependencies ทั้งหมด:

```bash
pip install -r requirements.txt
```

### 4. ติดตั้ง Frontend Dependencies
เปิด Terminal หรือ Command Prompt อีกหนึ่งหน้าต่าง แล้วเข้าสู่โฟลเดอร์ frontend เพื่อติดตั้ง Node.js dependencies:
```bash
cd frontend
npm install
```

## สร้างไฟล์ .env ใน folder frontend

```bash
# longdo map api key
REACT_APP_LONGDO_MAP_KEY=
```


## สร้างไฟล์ .env ใน folder backend

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

### 1. Run the Frontend (ต้องอยู่ใน Folder frontend)

```bash
cd frontend
npm run build
npm run start
```

### 2. Run the Backend (ต้องอยู่ใน Folder backend)

```bash
cd backend
myvenv\Scripts\activate.bat # ถ้ายังไม่ได้ activate
python manage.py runserver
```

### 3. ข้อมูล User เผื่อทดสอบ (สำหรับอาจารย์)

```bash
•	User (Password: Japan1234)
1.	alice@example.com
2.	bob@example.com
3.	charlie@example.com
4.	david@example.com
5.	banexample@example.com
6.	banexample2@example.com
•	Staff : staff@example.com (Password: Japan1234)
•	Admin : User: Admin, Password: 1234
•	*ปล. Admin Login ที่: http://localhost:8000/admin
```
