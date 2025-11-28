# 🧩 Customer Support Zone — React Ticket Management App

Customer Support Zone is a clean, efficient, and fully responsive ticket management application built using **React.js** and **React-Toastify**.  
This project is **My First React Project**.

The application allows users to view customer support tickets, track progress, mark tasks as completed, and maintain real-time status updates with a modern UI inspired by a Figma design.

---

## 🚀 Live Demo  
👉 *(Add your live project link here)*

## 📦 GitHub Repository  
👉 *[(https://github.com/mdtajrianrashid/Customer-Care-React-Project-A07)]*

---

# 📌 Features Overview

## 📝 Customer Tickets  
- Display all customer tickets in a **2-column grid layout**  
- Each card shows:  
  - Title  
  - Description  
  - Customer name  
  - Priority  
  - Created date  

## 🔄 Task Status Section  
- Clicking a ticket card moves it to the **In Progress** section  
- Displays only the tasks currently being worked on  
- Shows **Complete Button** for task resolution  

## ✔️ Completion Flow  
When clicking **Complete**:
- Task removed from In Progress  
- Task added to **Resolved List**  
- In Progress counter decreases  
- Resolved counter increases  
- Ticket removed from main ticket list  
- Toast notification appears  

## 🎨 Banner Section  
- Beautiful gradient background  
- Displays real-time:  
  - **In Progress Count**  
  - **Resolved Count**  

## 🔔 React-Toastify Integration  
- All alerts replaced with modern toast notifications  
- Smooth, user-friendly UX

## 🌟 Features

- ✔ Navbar (Logo + Menu + New Ticket Button)
- ✔ Gradient banner with real-time counts
- ✔ Ticket cards (2-column layout)
- ✔ In Progress task section
- ✔ Complete button logic
- ✔ Resolved list
- ✔ FULL toast notification system
- ✔ JSON data with 10–15 tickets
- ✔ Fully responsive layout
- ✔ Clean and modern UI

## 🧩 Additional Features  
- Fully responsive for mobile devices  
- Clean component structure  
- JSON-based mock ticket data (10–15 items)  
- Figma-inspired UI layout  

---

# 🏗️ Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React.js |
| Notifications | React-Toastify |
| Styling | CSS / Figma-inspired design |
| State Handling | React Hooks |
| Data Source | Local JSON Ticket Data |
| Build Tool | Vite / CRA |


---

# 📦 Dependencies

"dependencies": {
        "@fontsource/inter": "^5.2.8",
        "@tailwindcss/vite": "^4.1.13",
        "react": "^19.1.1",
        "react-dom": "^19.1.1",
        "react-toastify": "^11.0.5",
        "tailwindcss": "^4.1.13"
      }

# ⚙️ Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/mdtajrianrashid/Customer-Care-React-Project-A07
cd Customer-Care-React-Project-A07
npm install
npm run dev

The app will run on:
👉 http://localhost:5173

(or whichever port Vite shows)```

# 🎉 Thank You!

