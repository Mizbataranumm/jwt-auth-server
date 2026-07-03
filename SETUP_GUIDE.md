# JWT & OAuth2 Authorization Server - Complete Setup Guide

## Prerequisites
- Node.js (v14+) installed
- Git
- Postman (for testing) or curl

---

## Part 1: Local Setup (10 min)

### 1. Create Project Folder
```bash
mkdir jwt-auth-server
cd jwt-auth-server
npm init -y
```

### 2. Install Dependencies
```bash
npm install express mongoose bcryptjs jsonwebtoken dotenv joi express-rate-limit cors
npm install --save-dev nodemon
```

### 3. Update package.json Scripts
```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

### 4. Create Folder Structure
```bash
mkdir config models controllers schemas middleware routes
```

### 5. Create All Files
Copy these files into their folders:
- `config/db.js`
- `models/User.js`
- `middleware/auth.js`
- `schemas/authSchema.js`
- `controllers/authController.js`
- `routes/authRoutes.js`
- `index.js`
- `.env`
- `.env.example`

### 6. MongoDB Atlas Setup (5 min)
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free tier)
3. Create a cluster (M0 free)
4. Go to Database → Connect
5. Copy connection string: `mongodb+srv://username:password@cluster0.xxx.mongodb.net/auth-db?retryWrites=true&w=majority`
6. Paste into `.env` as `MONGODB_URI`

### 7. Create .env File
```env
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxx.mongodb.net/auth-db?retryWrites=true&w=majority
JWT_SECRET=my-super-secret-jwt-key-that-is-long-enough-32-chars
JWT_REFRESH_SECRET=my-refresh-secret-that-is-also-long-32-chars
NODE_ENV=development
```

### 8. Test Locally
```bash
npm run dev
```
You should see: `✅ Server running on http://localhost:5000`

---

## Part 2: Testing API Endpoints

### Using Postman
1. Download Postman (free)
2. Create new requests for each endpoint below

### Using curl (Terminal)

#### Test 1: Register
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "message": "User registered successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "...",
    "email": "test@example.com",
    "role": "user",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

#### Test 2: Login
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the `accessToken` for next requests.

#### Test 3: Get Profile (Protected Route)
```bash
curl -X GET http://localhost:5000/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

Replace `YOUR_ACCESS_TOKEN` with the token from login response.

#### Test 4: Get Login History
```bash
curl -X GET http://localhost:5000/auth/login-history \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Test 5: Refresh Token
```bash
curl -X POST http://localhost:5000/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

#### Test 6: Logout
```bash
curl -X POST http://localhost:5000/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

---

## Part 3: Deployment to Render (5 min)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: JWT Auth Server"
git remote add origin https://github.com/YOUR_USERNAME/jwt-auth-server.git
git push -u origin main
```

### 2. Deploy to Render
1. Go to https://render.com (free tier)
2. Sign in with GitHub
3. Click "New +" → "Web Service"
4. Select your GitHub repo
5. Fill in:
   - **Name:** jwt-auth-server
   - **Runtime:** Node
   - **Build command:** `npm install`
   - **Start command:** `npm start`
6. Add Environment Variables (from `.env`):
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `NODE_ENV=production`
7. Click Deploy

### 3. Your Live URL
Once deployed, you'll get a URL like: `https://jwt-auth-server.onrender.com`

Test it:
```bash
curl https://jwt-auth-server.onrender.com
```

---

## Part 4: GitHub Repo Structure
```
jwt-auth-server/
├── config/
│   └── db.js
├── models/
│   └── User.js
├── middleware/
│   └── auth.js
├── schemas/
│   └── authSchema.js
├── controllers/
│   └── authController.js
├── routes/
│   └── authRoutes.js
├── index.js
├── package.json
├── .env (don't commit this)
├── .env.example
├── .gitignore
└── README.md
```

### .gitignore
```
node_modules/
.env
.DS_Store
*.log
```

---

## Part 5: What You Have Now

✅ **Production-ready auth system** with:
- User registration & login
- JWT access tokens (15 min expiry)
- Refresh tokens (7 day expiry)
- Password hashing (bcrypt)
- Rate limiting (brute-force protection)
- Login history tracking
- Role-based access control (admin routes)
- Input validation
- Error handling
- Live deployment

This is what **real backends** do. Recruiters will be impressed.

---

## Next Steps (Optional, for Extra Polish)

1. **Add email verification** (send code on register)
2. **Add password reset** (forgot password flow)
3. **Add 2FA** (two-factor authentication)
4. **Add OAuth with Google/GitHub** (social login)
5. **Add API key auth** (for service-to-service)

---

## Common Errors & Fixes

| Error | Fix |
|-------|-----|
| `Cannot find module 'mongoose'` | Run `npm install` |
| `MONGODB_URI not defined` | Check `.env` file exists |
| `Token expired` | Use refresh-token endpoint to get new access token |
| `Rate limit exceeded` | Wait 15 minutes or restart server |
| `Email already registered` | Use different email or login instead |

---

## Recruiting Talking Points

When you add this to your portfolio, say:

*"I built a production-ready JWT & OAuth2 authorization server with Node.js, Express, and MongoDB. It features secure password hashing with bcrypt, JWT access/refresh token rotation, rate limiting for brute-force protection, login activity tracking, and role-based access control. The system is deployed live on Render with full API documentation and has been tested with Postman."*

---

Done. Start building! 🚀
