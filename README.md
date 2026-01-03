# Uber Backend (Express + Socket.IO + MongoDB + Redis) 🚖

Short description
- **Uber-like backend** built with **Node.js**, **Express**, **Socket.IO** for real-time driver-passenger events, **MongoDB** (via Mongoose) for persistence, and **Redis** for mapping driver sockets / quick lookups.

Highlights
- Real-time booking notifications to drivers using Socket.IO 🔄
- Driver location and booking lifecycle management
- JWT-based authentication and role-aware controllers
- Redis used for mapping driverId ↔ socketId for fast lookups

---

## Table of contents
1. Features
2. Tech stack (and advanced packages)
3. Project structure
4. Prerequisites
5. Environment variables (.env example)
6. Local setup (native & Docker)
7. Run & dev commands
8. API endpoints & examples
9. Notes, suggestions & security tips

---

## 1) Features ✅
- Register / Login users (drivers/passengers)
- Create bookings and notify nearby drivers via Socket.IO
- Drivers confirm bookings (real-time flow)
- Store bookings in MongoDB
- Use Redis to store driver socket mappings
- Simple driver UI in `public/driver.html` to test sockets

---

## 2) Tech stack & advanced packages 🔧
- **Node.js + Express** — server
- **Mongoose** — MongoDB ODM
- **Socket.IO** — real-time communication (advanced: event-driven flows)
- **Redis** (`redis` client) — caching and driver socket mapping (advanced: ephemeral state)
- **jsonwebtoken** (JWT) — token-based authentication
- **bcrypt** — password hashing
- **dotenv** — environment configuration
- **cors** — cross-origin
- **nodemon** — dev auto-reload
- Other project packages (review `package.json` for full list; note a few typos may exist — see Notes)

Why these are advanced:
- Socket.IO + Redis: enables scalable, real-time notifications and quick lookups without hitting DB for ephemeral mapping.
- JWT + bcrypt: secure auth patterns.
- MongoDB + Mongoose: flexible schema and population of relationships.

---

## 3) Project structure (key files)
- `index.js` — server, Socket.IO setup, CORS config
- `controllers/` — request handlers
  - `authController.js`, `driverController.js`, `passengerController.js`, `bookingController.js`
- `routes/` — route definitions
- `services/` — business logic (authService, bookingService, driverService, locationService, etc.)
- `models/` — Mongoose models (`user.js`, `booking.js`)
- `utils/` — `db.js` (connect Mongo), `redisClient.js` (connect Redis), `distance.js`
- `public/driver.html` — simple driver UI demonstrating socket flows

---

## 4) Prerequisites
- Node.js 16+ (recommend Node 18 or later)
- npm (comes with Node)
- MongoDB (local or Atlas) or Docker
- Redis (local or Docker)
- Optional: Postman / Insomnia for API testing

---

## 5) Environment variables (.env example)
Create `.env` in project root:

PORT=5005  
MONGO_URI=mongodb://localhost:27017/uber_backend  
REDIS_URI=redis://localhost:6379  
JWT_SECRET=your_jwt_secret_here  
NODE_ENV=development

Notes:
- Do not commit `.env` to version control.
- `MONGO_URI` can be a Mongo Atlas connection string.
- `REDIS_URI` may include password: `redis://:password@host:port`.

---

## 6) Local setup (Windows + Docker options)

Native (Windows):
1. Install Node and npm: https://nodejs.org/
2. Install MongoDB or use MongoDB Atlas
3. Install Redis or use Docker

Docker quick setup:
- MongoDB:
  docker run -d --name mongo -p 27017:27017 mongo:latest
- Redis:
  docker run -d --name redis -p 6379:6379 redis:latest

---

## 7) Install & Run 🔁
Install dependencies:
- npm install

Recommended scripts to add to `package.json` (if not present):
- "start": "node index.js"
- "dev": "nodemon index.js"

Start in development:
- npm run dev

Access driver UI:
- Open `http://localhost:5005/driver.html` (or adjust origin/CORS in `index.js`)

---

## 8) API endpoints & examples 🧭

Auth
- POST /api/auth/register
  - Body: { name, email, password, role }  
  - Example:
    curl -X POST http://localhost:5005/api/auth/register -H "Content-Type: application/json" -d '{"name":"Alice","email":"a@b.com","password":"password","role":"driver"}'

- POST /api/auth/login
  - Body: { email, password }  
  - Example:
    curl -X POST http://localhost:5005/api/auth/login -H "Content-Type: application/json" -d '{"email":"a@b.com","password":"password"}'

Bookings (authenticated)
- POST /api/bookings/ — create booking (Auth: Bearer <token>)
- POST /api/bookings/confirm — driver confirms booking (Auth: Bearer <token>)

Driver
- GET /api/drivers/bookings — get bookings for driver
- POST /api/drivers/location — update driver location

Passenger
- GET /api/passengers/bookings
- POST /api/passengers/feedback

Socket events:
- Client emits `registerDriver` with `driverId`
- Server emits `newBooking`, `removeBooking`, `rideConfirmed` (see `public/driver.html` for usage)

---

## 9) Notes, suggestions & security ⚠️
- I noticed a few odd entries in `package.json` (e.g., `"brcypt"`, `"json"`, `"token"`, `"web"`). Those may be typos or unnecessary — consider cleaning dependencies and moving dev-only packages (like `nodemon`) to `devDependencies`.
- Add `start` and `dev` scripts to `package.json`.
- Ensure `JWT_SECRET` is strong and rotate in production.
- Add input validation and better error handling (e.g., Joi or express-validator).
- Consider tests (Jest / Supertest) and linting (ESLint) for reliability.
- If you plan to scale, consider using Redis Pub/Sub or a message queue to coordinate Socket.IO across multiple nodes.

---

## Want me to make additional changes?
I can also:
- Add the recommended `scripts` to `package.json` and fix obvious typos
- Add example `.env.example`
- Add a small Postman collection for the main flows

If you'd like any of those, tell me which and I'll apply them.
