# Apex Home Furnishings

An immersive, full-stack e-commerce platform built to provide a seamless online furniture shopping experience. This project covers everything from complex state management to multi-step checkouts and secure routing.

🌐 **Live Demo:** [https://apex-home-stores.vercel.app](https://apex-home-stores.vercel.app)

---

## 🚀 Features

### **Phase 1: Foundation & Navigation**
* **Dynamic Client-Side Routing:** Implemented using `react-router-dom` with shared layout architectures (`Navbar`, `Footer`, `Outlet`) for seamless, zero-refresh page transitions.

### **Phase 2: Browsing & Discovery**
* **Category Showcases:** Dedicated, dynamic category views displaying tailored product grids filtered via URL parameters (`useParams`).
* **Rich Product Detail Views:** Interactive product pages complete with responsive image galleries, comprehensive specifications, and instant add-to-basket actions.
* **Debounced Live Search:** Multi-criteria search functionality utilizing URL search parameters (`useSearchParams`) and controlled inputs to query matching products efficiently.

### **Phase 3: Core Cart & Checkout Architecture**
* **Global State Management:** High-performance shopping cart powered by React Context API (`CartContext`) combined with `useReducer` to manage complex state transitions like `ADD`, `REMOVE`, and `UPDATE_QTY` seamlessly.
* **Persistent Shopping Sessions:** Automatic cart persistence utilizing `localStorage` through `useEffect` synchronization, ensuring customer selections survive page refreshes.
* **3-Step Linear Checkout Pipeline:** A highly optimized `CheckoutPage` utilizing unified step-state rendering:
  * *Step 1 (Welcome):* Guest vs. registered user conditional routing with controlled forms.
  * *Step 2 (Delivery):* Detailed address collection fortified with strict form validations and `useRef` focus management.
  * *Step 3 (Review & Pay):* Complete async order-processing layout.

### **Phase 4: User Accounts & Trust Indicators**
* **Authentication & Guarded Routes:** Secure user authentication flows utilizing custom `useAuth` hooks and higher-order Protected Route wrappers to guard private views.
* **Comprehensive Client Dashboards:** Custom user spaces displaying detailed order histories and account parameters.
* **Robust Boundary Handling:** Custom catch-all error handling (`404 Not Found`) to catch invalid routing anomalies gracefully.

---

## 🛠️ Tech Stack & Tools

* **Frontend Library:** React.js (Vite)
* **Routing:** React Router DOM v6
* **State Management:** React Context API + `useReducer` (Custom Hook Architecture)
* **Database & Backend:** Node.js, Express, and MongoDB
* **Styling:** Custom CSS / Tailwind CSS

---

## 📂 Architecture & Directory Structure

The project code is modularized according to scalable React enterprise standards:


src/
├── assets/          # Project images, branding vectors, and localized icons
├── components/      # Global UI Components (Navbar, Footer, ProductCard, etc.)
├── context/         # Central State Engines (CartContext.jsx, AuthContext.jsx)
├── data/            # Localized data schemas and fallback structures
├── hooks/           # Abstracted Custom Hooks (useCart.js, useAuth.js)
├── pages/           # High-Level Views (HomePage, ProductPage, CheckoutPage, etc.)
├── App.jsx          # Route Definitions & Root Layout Configuration
└── main.jsx         # Application entry point wrapped in Context Providers

```

---

## 🏁 Getting Started

To get a local copy up and running, follow these simple development setup steps:

### Prerequisites

* Node.js installed on your machine
* npm or yarn package manager

### Installation & Local Setup

1. **Clone the Repository:**
```bash
git clone [https://github.com/Ebitimiebelike/apex-home-furnishings.git](https://github.com/Ebitimiebelike/ApexHomeStores.git)
cd ApexHomeStores

```


2. **Install Dependencies:**
```bash
npm install

```


3. **Run the Development Server:**
```bash
npm run dev

```


*The application should now be running locally at `http://localhost:5173` (or your configured Vite port).*

---

## 🧠 Key Learnings & Architecture Gains

Building this platform served as a deep dive into advanced full-stack React design patterns:

* Transitioned from standard local state management to a predictable, action-driven global store using the **Context API + useReducer** pattern.


* Mastered performance optimization techniques such as **input debouncing** for real-time item queries.


* Crafted strict **form validations and layout management** to handle multi-view checkout checkouts flawlessly.


* Created clean, highly reusable presentation interfaces by abstracting core side-effects into specialized **Custom Hooks**.
