Here is the complete, raw markdown text for your `README.md` file. You can copy everything inside the block below and paste it directly into your file:

```markdown
# Apex Home Furnishings

An immersive, full-stack e-commerce platform built to provide a seamless online furniture shopping experience[cite: 1]. This project covers everything from complex state management to multi-step checkouts and secure routing[cite: 1].

🌐 **Live Demo:** [https://apex-home-stores.vercel.app](https://apex-home-stores.vercel.app)

---

## 🚀 Features

### **Phase 1: Foundation & Navigation**
* **Dynamic Client-Side Routing:** Implemented using `react-router-dom` with shared layout architectures (`Navbar`, `Footer`, `Outlet`) for seamless, zero-refresh page transitions[cite: 1].

### **Phase 2: Browsing & Discovery**
* **Category Showcases:** Dedicated, dynamic category views displaying tailored product grids filtered via URL parameters (`useParams`)[cite: 1].
* **Rich Product Detail Views:** Interactive product pages complete with responsive image galleries, comprehensive specifications, and instant add-to-basket actions[cite: 1].
* **Debounced Live Search:** Multi-criteria search functionality utilizing URL search parameters (`useSearchParams`) and controlled inputs to query matching products efficiently[cite: 1].

### **Phase 3: Core Cart & Checkout Architecture**
* **Global State Management:** High-performance shopping cart powered by React Context API (`CartContext`) combined with `useReducer` to manage complex state transitions like `ADD`, `REMOVE`, and `UPDATE_QTY` seamlessly[cite: 1].
* **Persistent Shopping Sessions:** Automatic cart persistence utilizing `localStorage` through `useEffect` synchronization, ensuring customer selections survive page refreshes[cite: 1].
* **3-Step Linear Checkout Pipeline:** A highly optimized `CheckoutPage` utilizing unified step-state rendering[cite: 1]:
  * *Step 1 (Welcome):* Guest vs. registered user conditional routing with controlled forms[cite: 1].
  * *Step 2 (Delivery):* Detailed address collection fortified with strict form validations and `useRef` focus management[cite: 1].
  * *Step 3 (Review & Pay):* Complete async order-processing layout[cite: 1].

### **Phase 4: User Accounts & Trust Indicators**
* **Authentication & Guarded Routes:** Secure user authentication flows utilizing custom `useAuth` hooks and higher-order Protected Route wrappers to guard private views[cite: 1].
* **Comprehensive Client Dashboards:** Custom user spaces displaying detailed order histories and account parameters[cite: 1].
* **Robust Boundary Handling:** Custom catch-all error handling (`404 Not Found`) to catch invalid routing anomalies gracefully[cite: 1].

---

## 🛠️ Tech Stack & Tools

* **Frontend Library:** React.js (Vite)[cite: 1]
* **Routing:** React Router DOM v6[cite: 1]
* **State Management:** React Context API + `useReducer` (Custom Hook Architecture)[cite: 1]
* **Database & Backend:** Node.js, Express, and MongoDB
* **Styling:** Custom CSS / Tailwind CSS[cite: 1]

---

## 📂 Architecture & Directory Structure

The project code is modularized according to scalable React enterprise standards[cite: 1]:

```text
src/
├── assets/          # Project images, branding vectors, and localized icons[cite: 1]
├── components/      # Global UI Components (Navbar, Footer, ProductCard, etc.)[cite: 1]
├── context/         # Central State Engines (CartContext.jsx, AuthContext.jsx)[cite: 1]
├── data/            # Localized data schemas and fallback structures[cite: 1]
├── hooks/           # Abstracted Custom Hooks (useCart.js, useAuth.js)[cite: 1]
├── pages/           # High-Level Views (HomePage, ProductPage, CheckoutPage, etc.)[cite: 1]
├── App.jsx          # Route Definitions & Root Layout Configuration[cite: 1]
└── main.jsx         # Application entry point wrapped in Context Providers[cite: 1]

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
