# 🔐 PolyLab Platform

### A Secure Cryptography-Focused Learning & Assignment Management System

PolyLab is a **full-stack, security-hardened academic platform** for managing classrooms, assignments, submissions, grading, and cryptography-related computations. It features **role-based access control**, **CSRF-protected authentication**, and an integrated **GF(2ᵐ) polynomial arithmetic engine**, making it ideal for cryptography coursework.

---

## 🚀 Key Features

### 🔐 Security & Authentication
- CSRF-safe login using a **double-submit cookie** pattern  
- HttpOnly + Secure cookies  
- Strict session validation  
- Rate limiting & request throttling  
- Secure file upload & serving  
- Role-based access (Student • Instructor • Admin)

---

### 🧮 GF(2ᵐ) Polynomial Calculator
Includes a full finite-field arithmetic engine for:
- Addition / subtraction  
- Multiplication  
- Modular reduction  
- AES Rijndael GF(2⁸) operations  
- Step-by-step visual explanations  

---

### 🏫 Classroom Management
- Instructor-created classrooms  
- Students join using a unique join-code  
- Upload course materials  
- Assignments with deadlines  
- Built-in polynomial exercise templates  

---

### 📥 Assignment & Submission System
- File or text submissions  
- Inline preview for instructors  
- Student & instructor submission review pages  
- Auto time conversion to **Asia/Beirut**  
- Grade submission interface  

---

## Deployed platform
➡️ To explore the live platform, visit the deployed site here: https://polylab-website.onrender.com  

---

## 🛠️ Tech Stack

### Backend
- **FastAPI** (Python)  
- PostgreSQL  
- Secure authentication & session middleware  
- File validation & streaming

### Frontend
- **React + TypeScript**  
- Tailwind CSS  
- Role-aware routing  
- Context-based authentication state  

### Deployment
- Fully Dockerized (Backend + Frontend)  
- Multi-stage Dockerfile  
- Deployment on **Render** with:
  - Auto builds  
  - Environment variables  
  - HTTPS  
  - Containerized service runtime  

---

## 📦 Installation Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/ghada49/PolyLab-Polynomial-Arithmetic
cd PolyLab-Polynomial-Arithmetic
```

---

## 2️⃣ Backend Setup (Local)
```bash
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r Backend/requirements.txt
uvicorn Backend.main:app --reload --host 0.0.0.0 --port 8000
```
Backend docs:
- Health: http://127.0.0.1:8000/health
- Swagger: http://127.0.0.1:8000/docs
---

## 3️⃣ Frontend Setup (Local)
```bash
cd Frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173

```

---

## 👤 User Roles & Account Workflow

### Default Student Role

All new accounts created via Sign Up are automatically assigned the student role.

Students can:

- Use the GF(2ᵐ) calculator
- Join classrooms using a join code
- View assignments and upload submissions
- Request instructor access

### Instructor Request Workflow

Students who want instructor privileges can submit a request with:
- Proof document (certificate, university ID, etc.)
- A short justification message

The request appears in the Admin Dashboard where an admin may approve or reject it.

If approved, the user’s role updates to instructor automatically.

### Admin Account

An admin account is auto-created on backend startup if missing.

Default credentials (configurable in .env):

```
ADMIN_EMAIL=admin@polylab.app
ADMIN_PASSWORD=AdminPass123!
```
Admin is responsible for reviewing instructor requests and approving or rejecting them.







