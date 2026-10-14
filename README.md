# 📸 Mirela Cohen - Photography Courses

## About
Full-stack e-commerce platform for digital photography courses, built end-to-end from planning to deployment. Features secure JWT authentication and a complete course purchase flow.

## ✨ Features
- User registration, login & role-based access (JWT)
- Course catalog, shopping cart & digital course purchases
- Admin management interface
- RESTful API with Express & Mongoose (MongoDB)
- Responsive UI built with React, Redux & React Router

## 🌐 Live Demo
[https://photography-courses-client.vercel.app/](https://photography-courses-client.vercel.app/)

## 📁 Project Structure
```
photography-courses/
├── client/   # React (Vite) SPA – Redux, React Router
└── server/   # REST API – Node.js, Express, MongoDB
```

## 🛠️ Technologies
- **Frontend:** React, Redux, React Router
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT

## 🚀 Getting Started

```bash
git clone https://github.com/st0533168114-dev/photography-courses.git
cd photography-courses
```

### Server
```bash
cd server
cp .env.example .env   # fill in MONGO_URI and JWT_SECRET
npm install
npm start              # http://localhost:1234
```

### Client
```bash
cd client
cp .env.example .env   # VITE_API_URL=http://localhost:1234
npm install
npm run dev            # http://localhost:5173
```
