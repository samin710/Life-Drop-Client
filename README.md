# 🩸 LifeDrop – A Blood Donation & Funding Platform

<!--![TradePort Screenshot](https://your-image-url.com)--> <!-- Replace this with your screenshot URL -->

## 🔗 Live Website  
👉 [LifeDrop Live](https://lifedrop-e46b4.web.app/)

---

## 🖇️ Server Link 
👉 [Server Link](https://github.com/Programming-Hero-Web-Course4/b11a12-server-side-samin710)

---

## 🧠 Overview

***LifeDrop*** is a full-stack web application built to streamline the process of blood donation and organizational funding. It connects donors, recipients, volunteers, and admins on a unified platform to manage and monitor donation requests, funding, blogs, and user roles efficiently.

---

## 🔥 Tech Stack
- Frontend: React.js, Tailwind CSS, DaisyUI, React Router, Axios, Lucide, React Icons, Jodit Editor

- Backend: Express.js, MongoDB (native driver), Stripe

- Authentication: Firebase Auth + JWT

- State & Data: React Query, React Hook Form

- Security: Protected routes, secrue API calls with token authorization

---

## 🚀 Key Features

🔴 Blood Donation System
- Donation Request Form: Users can request blood by providing patient info, hospital details, blood group, and preferred time.

- Request Management: Donors and admins can view, edit, accept, cancel, or mark donation requests as completed.

- My Requests Dashboard: Donors can see and manage their donation history in a filterable and paginated table.

💵 Funding Integration
- Give Fund Button: Users can donate funds to the organization via a secure Stripe Elements-based checkout form.

- Funding History: All funding transactions (with donor name, amount, date, and transaction ID) are shown in a table with pagination.

- Total Funds Display: Admin can view total raised funds on the dashboard.

📝 Blog System
- Blog Listing: All published blogs are visible on a dedicated Blogs page with search functionality.

- Blog Details: Each blog opens in a dedicated details page with full content and related metadata.

📊 Admin Dashboard
- Statistics Cards: Shows total donation requests, users, and total funds.

- Donation Charts: Displays donation activity over time and breakdowns by blood group.

- User Management: Admin can block/unblock users and assign roles (volunteer, donor, admin).

🧑‍🤝‍🧑 User Management
- Authentication: Firebase authentication with JWT-secured routes.

- Role-Based Access: Dashboard access and actions are controlled based on user roles (admin, donor, volunteer).

- Profile System: Users can view and update their profiles.

🌗 Theming
- Dark/Light Mode Toggle: Fully responsive theme toggle across all devices.
---

## 📦 Dependencies

```json
{
    "@headlessui/react": "^2.2.4",
    "@stripe/react-stripe-js": "^3.7.0",
    "@stripe/stripe-js": "^7.4.0",
    "@tailwindcss/vite": "^4.1.11",
    "@tanstack/react-query": "^5.81.5",
    "axios": "^1.10.0",
    "date-fns": "^4.1.0",
    "firebase": "^11.10.0",
    "jodit-react": "^5.2.19",
    "lucide-react": "^0.525.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-hook-form": "^7.60.0",
    "react-icons": "^5.5.0",
    "react-router": "^7.6.3",
    "react-router-hash-link": "^2.4.3",
    "recharts": "^3.1.0",
    "sweetalert2": "^11.22.2",
    "tailwindcss": "^4.1.11"
}
```
---

## 🛠 How to Run This Project Locally
1. Clone the repository
2. Install dependencies: npm install
3. Create a .env file in the root directory and add your Firebase configuration (replace placeholders)
4. npm run dev
