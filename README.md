# Al-Manarah — Mosque Management System

**Al-Manarah** ("The Lighthouse / The Minaret") is a complete, full-stack mosque management
system built to help mosque committees run their day-to-day administration in one place:
congregation records, donations & expenses, events, announcements, and daily prayer timings.

- **Backend:** Django 5 + Django REST Framework + SQLite + JWT authentication
- **Frontend:** React 18 (Vite) + Tailwind CSS + Recharts + Lucide icons
- **Design:** A custom "night teal & brass gold" theme with an arch-motif signature element
  inspired by mihrab architecture, paired with Amiri (display) and Work Sans (body) type.

---

## ✨ Features

| Module | What it does |
|---|---|
| **Dashboard** | Live stats (balance, monthly donations/expenses, members, events), a 6-month donations-vs-expenses trend chart, a donation-by-category breakdown, today's prayer times, upcoming events and latest announcements. |
| **Members** | Full congregation registry — contact info, membership type (regular/family/lifetime/honorary), status, family size, search & filter. |
| **Donations** | Record donations by donor, category (Zakat, Sadaqah, Construction Fund, etc.), payment method, and receipt number. |
| **Expenses** | Track mosque expenditure by category (utilities, salaries, maintenance, etc.), vendor, and approver. |
| **Events** | Schedule Jummah khutbahs, Eid celebrations, lectures, Nikah ceremonies, fundraisers, Ramadan programs, and classes. |
| **Announcements** | Publish notices with priority levels (low/normal/high/urgent) and pinning. |
| **Prayer Timings** | Manage daily adhan & iqamah times for all five prayers plus Jummah khutbah/iqamah. |
| **Roles** | Super Admin, Admin, Imam, Treasurer, Staff — with permission classes restricting sensitive actions (e.g. only Admin/Treasurer roles can edit finances). |

---

## 📁 Project Structure

```
al-manarah/
├── backend/                 # Django REST API
│   ├── config/               # Project settings & root urls
│   ├── accounts/              # Custom user model, JWT auth, roles
│   ├── members/                # Congregation members + committee
│   ├── finance/                 # Donations & expenses
│   ├── events/                   # Events/programs
│   ├── announcements/             # Notices
│   ├── prayer/                     # Prayer timings
│   ├── dashboard/                   # Aggregated stats + seed_data command
│   ├── manage.py
│   └── requirements.txt
└── frontend/                # React (Vite) SPA
    ├── src/
    │   ├── api/client.js       # Axios instance + JWT auto-refresh
    │   ├── context/AuthContext.jsx
    │   ├── layouts/DashboardLayout.jsx
    │   ├── components/          # Modal, PageHeader, Badge, StatCard
    │   └── pages/                 # Login, Dashboard, Members, Donations,
    │                                Expenses, Events, Announcements, PrayerTimes
    └── package.json
```

---

## 🚀 Getting Started

### 1. Backend (Django + SQLite)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

python manage.py migrate
python manage.py seed_data      # creates demo users, members, donations, events, etc.
python manage.py runserver      # runs on http://127.0.0.1:8000
```

**Demo login credentials (created by `seed_data`):**

| Username | Password | Role |
|---|---|---|
| `admin` | `admin12345` | Super Admin |
| `imam` | `imam12345` | Imam |
| `treasurer` | `treasurer12345` | Treasurer |

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev                      # runs on http://localhost:5173
```

The frontend expects the API at `http://127.0.0.1:8000/api` by default — this is set in
`frontend/.env` via `VITE_API_URL`. Change it there if your backend runs elsewhere.

### 3. Production build

```bash
cd frontend
npm run build      # outputs static files to frontend/dist/
```

Serve `frontend/dist/` with any static host (Nginx, Vercel, Netlify, etc.), and deploy the
Django backend with a production server (Gunicorn/Daphne behind Nginx) and `DEBUG=False`.

---

## 🔐 Security notes before going to production

- Set a real `SECRET_KEY` and `DEBUG = False` in `backend/config/settings.py`.
- Restrict `CORS_ALLOW_ALL_ORIGINS` to your actual frontend domain.
- Swap SQLite for PostgreSQL for multi-user production traffic.
- Put `MEDIA_ROOT` uploads (member photos, receipts) behind proper storage (e.g. S3) in production.

---

## 🎨 Design system

- **Colors:** Night teal (`#0E2E29`) for structure/navigation, brass gold (`#B8892B`) as the
  single accent, ivory (`#FAF7F0`) background, sage green for positive/secondary data.
- **Type:** Amiri (serif, Arabic-inspired) for headings, Work Sans for body text, JetBrains
  Mono for numeric/receipt data.
- **Signature element:** The "arch-top" card shape (used on the login card and stat cards)
  echoes a mihrab/minaret arch, and a faint 8-point geometric star pattern sits behind key
  surfaces — a nod to traditional Islamic geometric ornamentation without being literal.

---

Built with Django REST Framework, React, and Tailwind CSS.
<img width="1899" height="833" alt="image" src="https://github.com/user-attachments/assets/94071a77-6953-40ac-89b1-da82e2a50ee1" />
<img width="1900" height="829" alt="image" src="https://github.com/user-attachments/assets/494b1bbe-64bc-4323-ad6b-907521c0d69b" /><img width="1902" height="493" alt="image" src="https://github.com/user-attachments/assets/92fe16aa-190b-4634-b06c-eb17b05e8a0f" />
<img width="1919" height="879" alt="image" src="https://github.com/user-attachments/assets/69df6e3e-0a24-4e78-b90b-8aa20f73a2ea" />
<img width="1919" height="868" alt="image" src="https://github.com/user-attachments/assets/3f8f4ef0-1046-4e21-b7ce-e8db74e17f9f" />

