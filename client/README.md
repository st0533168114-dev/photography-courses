# Mirela Cohen - Photography Courses | Client

React (SPA) application for a digital photography courses sales website. Includes a course and category catalog, registration and login, shopping cart, order placement and payments, viewing purchased courses, and an admin management panel.

## Technologies

React 19 · Vite · Redux Toolkit · React Router v7 · Axios · CSS Modules · Swiper

## Installation & Running

```bash
git clone https://github.com/st0533168114-dev/photography-courses-client.git
cd photography-courses-client
npm install
npm run dev
```

The application will run at the address shown in the terminal (usually `http://localhost:5173`).

## Environment Variables

Create a `.env` file with the server address:

```
VITE_API_URL=http://localhost:1234
```

## Main Structure

```
src/
├── pages/        # Site pages
├── components/    # Reusable components
├── layout/        # Header and Footer
├── API/           # Axios calls to the server
├── redux/         # Store and slices
└── CSS/           # Modular styling
```

## Build for Deployment

```bash
npm run build
```

## Related Repository
- [Photography Courses Server (Node/Express)](https://github.com/st0533168114-dev/photography-courses-server)
