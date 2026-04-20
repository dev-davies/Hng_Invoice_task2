# 🚀 Invoice Management Application

A modern, full-featured invoice management dashboard built with React, TypeScript, and Tailwind CSS. This application allows users to create, read, update, and delete invoices while maintaining state persistence and high accessibility standards.

## 🛠️ Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation
1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd Invoice_hng
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run locally**:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

4.  **Build for production**:
    ```bash
    npm run build
    ```

---

## 🏗️ Architecture Explanation

This project follows a component-driven architecture designed for scalability and performance:

-   **[Vite](https://vitejs.dev/)**: Used as the build tool and development server for lightning-fast HMR and optimized production builds.
-   **[React Router v6](https://reactrouter.com/)**: Handles seamless client-side navigation between the Dashboard and Invoice Detail views.
-   **[Zustand](https://github.com/pmndrs/zustand)**: A lightweight state management library used for global application state (invoices, theme, and form visibility).
-   **[React Hook Form](https://react-hook-form.com/)**: Manages the complex invoice creation/editing form, utilizing `useFieldArray` for dynamic line items and built-in validation.
-   **[Tailwind CSS](https://tailwindcss.com/)**: Provides a utility-first styling approach, enabling a custom design system with built-in dark mode support.

---

## 💾 State & Persistence

Application state is managed globally via **Zustand**. To ensure user data is not lost on page refreshes, we utilize **Zustand's `persist` middleware**.

-   **Local Storage**: The entire invoice store is automatically synced to the browser's `localStorage` under the key `invoice-storage`.
-   **Hydration**: On initial load, the application checks `localStorage`. If empty, it hydrates the state with a set of curated dummy data to provide an immediate interactive experience.

---

## ⚖️ Trade-offs

-   **Local Persistence vs. Backend**: For the scope of this project, `localStorage` was chosen over a full backend (PostgreSQL/Node.js). This ensures zero-config setup for reviewers but limits data sharing across different browsers/devices.
-   **Native Form Elements**: We opted for native browser inputs (like `date`) for better mobile accessibility, though a custom date picker would offer more styling control.

---

## ♿ Accessibility Notes

The application is built to meet **WCAG AA standards**:

-   **Focus Trapping**: Both the `DeleteModal` and the `InvoiceForm` overlay implement strict focus trapping. Keyboard users cannot accidentally focus background elements while a modal is open.
-   **Keyboard Navigation**: All interactive elements (Filter dropdown, Buttons, Invoices) are navigable via `Tab` and triggers like `Enter` or `Space`.
-   **ESC Key Support**: All overlays and modals can be dismissed instantly with the `Escape` key.
-   **Semantic HTML**: Proper use of `<label>`, `aria-label`, and landmark roles ensures a meaningful experience for screen reader users.

---

## 🌟 Improvements Beyond Requirements

While meeting the core brief, we added several premium features:

-   **Smooth Transitions**: Global CSS transitions for background and text colors make switching between Light and Dark mode feel incredibly fluid.
-   **Framer Motion-style Animations**: Used Tailwind's transition utilities and specialized `@tailwindcss/forms` for smooth slide-in/fade-in effects on cards and overlays.
-   **Deep Filtering**: A custom-built status filter that supports multi-selection, allowing users to view `Draft`, `Pending`, and `Paid` invoices in any combination.
-   **Form Logic Enhancement**: The "Save as Draft" feature intelligently bypasses validation, allowing users to save incomplete work, while "Save & Send" enforces strict data integrity.
