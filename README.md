# 🗄️ e-Malkhana – Digital Evidence Management System

A full-stack web application that simulates a **real police e-Malkhana workflow** for managing seized properties and evidence.  
Built as part of **NIT Jamshedpur Web Team Inductions 2k26**.

---

## 📌 Problem Statement

**Digital e-Malkhana for Police Evidence Management**

The system digitizes the traditional Malkhana process used in police stations to manage seized property, ensuring:

- Proper case registration  
- Secure evidence tracking  
- Chain of custody logging  
- Disposal management  
- Transparency & accountability  

---

## 🚀 Features Implemented

### 🔐 Authentication & Authorization
- Username & password based login
- Role-based access:
  - **ADMIN**
  - **USER**
- Secured using **NextAuth (Credentials Provider)**
- **Username: admin**
- **Password: admin123**
- Role: ADMIN


---

### 📊 Dashboard
- Total cases count
- Pending cases
- Disposed cases
- Quick navigation to case management
- Admin-only user management

---

### 📁 Case Management
- Create new cases with:
  - Police Station Name
  - Investigating Officer Name & ID
  - Crime Number & Year
  - Date of FIR & Seizure
  - Act & Law
  - Sections of Law
- View case summary and status
- Search & filter cases by:
  - Crime number
  - Year
  - Officer name
  - Case status

---

### 📦 Property Management
- Add one or more properties per case
- Each property includes:
  - Category
  - Belonging To (Accused / Complainant / Unknown)
  - Nature of Property
  - Quantity & Unit
  - Storage Location
  - Description
  - Image upload
- **Automatic QR Code generation** per property
- Property status tracking (In Custody / Disposed)

---

### 🔄 Chain of Custody (Part-II)
- Tracks every movement of property:
  - From Location / Officer
  - To Location / Officer
  - Purpose (Court, FSL, Storage, Analysis, Transfer)
  - Date & Time
  - Remarks
- Chronological custody log for legal integrity

---

### 🗑️ Disposal of Property (Part-III)
- Admin-only disposal workflow
- Disposal types:
  - Returned
  - Destroyed
  - Auctioned
  - Court Custody
- Captures:
  - Court order reference
  - Disposal date
  - Remarks
- Auto-updates property and case status

---

### 👥 User Management (Admin Only)
- Create new users (Admin / User)
- Assign officer details
- Secure password storage (bcrypt)
- Role-based access enforcement

---

### 🧾 Reports & QR Code
- QR code scan to view property details
- Printable QR page
- Case & property details view
- Ready for future PDF report extension

---

## 🛠️ Tech Stack

### Frontend
- **Next.js (App Router)**
- React
- Tailwind CSS

### Backend
- Next.js API Routes
- **NextAuth (Credentials Provider)**
- MongoDB + Mongoose

### Utilities
- bcryptjs (password hashing)
- QR Code generation
- UploadThing (image uploads)

---

## 📂 Project Structure (Simplified)

app/
├─ (auth)/
│ └─ login/
├─ dashboard/
├─ cases/
│ ├─ new/
│ ├─ [caseId]/
│ │ ├─ properties/
│ │ │ ├─ new/
│ │ │ ├─ [propertyId]/
│ │ │ │ ├─ custody/
│ │ │ │ ├─ disposal/
│ │ │ │ └─ qr/
├─ users/
│ └─ new/
├─ api/
│ ├─ auth/
│ ├─ cases/
│ ├─ properties/
│ ├─ custody/
│ ├─ disposal/
├─ components/
├─ lib/
└─ models/


---

## ⚙️ Environment Variables

Create a `.env.local` file:

```env
MONGODB_URI=mongodb://localhost:27017/e-malkhana
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000


