# 📸 Mirela Cohen - Photography Courses

## About
Full-stack e-commerce platform for digital photography courses, built end-to-end from planning to deployment. Features secure JWT authentication and a complete course purchase flow.

## ✨ Features
- User registration, login & role-based access (JWT)
- Course catalog, shopping cart & digital course purchases
- Admin management interface
- Course images uploaded to Cloudinary
- RESTful API with Express & Mongoose (MongoDB)
- Responsive UI built with React, Redux & React Router

## 🌐 Live Demo
[https://photography-courses-client.vercel.app/](https://photography-courses-client.vercel.app/)

## 🛠️ Technologies
- **Frontend:** React 19 · Vite · Redux Toolkit · React Router v7 · Axios · CSS Modules · Swiper
- **Backend:** Node.js · Express 5 · Mongoose (MongoDB) · JWT · bcrypt · Cloudinary
- **Deployment:** Vercel (client) · Render (server)

## 📁 Project Structure
```
photography-courses/
├── client/src/
│   ├── pages/        # Site pages (admin/ for the management panel)
│   ├── components/   # Reusable components
│   ├── layout/       # Header and Footer
│   ├── API/          # Axios calls to the server
│   ├── redux/        # Store and slices
│   └── CSS/          # CSS Modules
└── server/
    ├── app.js        # Entry point: express, DB, CORS, routers
    ├── Routers/      # API route definitions
    ├── Controllers/  # Request handling
    ├── Services/     # Logic shared between controllers
    ├── Models/       # Mongoose schemas
    └── Middlewares/  # JWT authentication and admin authorization
```

## 🔌 API Routes
`/users` · `/courses` · `/categories` · `/shoppingCarts` · `/orders` · `/payments` · `/faq` · `/media`

## 🚀 Getting Started

```bash
git clone https://github.com/st0533168114-dev/photography-courses.git
cd photography-courses
```

### Server
```bash
cd server
cp .env.example .env
npm install
npm start              # http://localhost:1234
```

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing tokens |
| `CLOUDINARY_URL` | `cloudinary://<api_key>:<api_secret>@<cloud_name>` |

### Client
```bash
cd client
cp .env.example .env
npm install
npm run dev            # http://localhost:5173
```

| Variable | Description |
|---|---|
| `VITE_API_URL` | Server address, e.g. `http://localhost:1234` |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `VITE_CLOUDINARY_API_KEY` | Cloudinary API key (public) |
