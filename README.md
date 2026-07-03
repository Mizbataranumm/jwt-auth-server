# JWT & OAuth2 Authorization Server

A production-ready authentication service built with **Node.js, Express, and MongoDB**. Implements secure JWT token management, password hashing, rate limiting, and role-based access control.

## 🎯 Features

✅ **User Authentication**
- Secure registration with password validation
- Login with JWT access token (15-min expiry)
- Refresh token rotation (7-day expiry)
- Logout with token blacklist

✅ **Security**
- Password hashing with bcrypt (salt: 10 rounds)
- JWT signature verification
- Rate limiting on login (5 attempts/15 min)
- Rate limiting on register (3 accounts/1 hour)
- CORS enabled for client integration

✅ **User Management**
- Role-based access control (user, admin)
- Login history tracking (IP, timestamp, user agent)
- Last login timestamp
- Profile endpoint with session info

✅ **API Features**
- Input validation with Joi schemas
- Comprehensive error handling
- Activity logging
- Health check endpoint

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Runtime | Node.js |
| Server | Express.js |
| Database | MongoDB Atlas |
| Authentication | JWT (jsonwebtoken) |
| Password Security | bcryptjs |
| Validation | Joi |
| Rate Limiting | express-rate-limit |
| CORS | cors |
| Config | dotenv |

## 📋 API Endpoints

### Public Endpoints

**Register**
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response: 201
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": { ... }
}
```

**Login**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response: 200
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": { ... }
}
```

**Refresh Token**
```http
POST /auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "..."
}

Response: 200
{
  "accessToken": "...",
  "refreshToken": "..."
}
```

### Protected Endpoints (Require JWT)

**Get Profile**
```http
GET /auth/profile
Authorization: Bearer <accessToken>

Response: 200
{
  "user": { ... }
}
```

**Get Login History**
```http
GET /auth/login-history
Authorization: Bearer <accessToken>

Response: 200
{
  "loginHistory": [
    {
      "timestamp": "2024-01-15T10:30:00Z",
      "ip": "192.168.1.1",
      "userAgent": "..."
    }
  ]
}
```

**Logout**
```http
POST /auth/logout
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "refreshToken": "..."
}

Response: 200
{
  "message": "Logout successful"
}
```

**Admin-Only Route** (requires role: "admin")
```http
GET /auth/admin-only
Authorization: Bearer <adminAccessToken>

Response: 200
{
  "message": "This is admin-only content",
  "user": { ... }
}
```

## 🚀 Quick Start

### Prerequisites
- Node.js v14+
- MongoDB Atlas account (free tier)
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/jwt-auth-server.git
cd jwt-auth-server

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your MongoDB URI and secrets

# Run locally
npm run dev
```

Server starts on `http://localhost:5000`

### Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/auth-db
JWT_SECRET=your-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
NODE_ENV=development
```

## 🧪 Testing

### Using Postman
1. Import collection from `postman-collection.json` (create this)
2. Set environment variable `{{BASE_URL}}` to `http://localhost:5000`
3. Run requests

### Using curl

**Register:**
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Protected Route:**
```bash
curl -X GET http://localhost:5000/auth/profile \
  -H "Authorization: Bearer <YOUR_ACCESS_TOKEN>"
```

## 🌐 Deployment

### Render

1. Push to GitHub
2. Connect repo to Render
3. Add environment variables
4. Deploy

Live at: `https://jwt-auth-server.onrender.com`

### Manual Testing (Live)
```bash
curl https://jwt-auth-server.onrender.com
```

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, lowercase),
  password: String (bcrypt hashed),
  role: String (enum: ["user", "admin"]),
  refreshTokens: [
    {
      token: String,
      createdAt: Date (expires after 7 days)
    }
  ],
  loginHistory: [
    {
      timestamp: Date,
      ip: String,
      userAgent: String
    }
  ],
  createdAt: Date,
  lastLogin: Date,
  updatedAt: Date
}
```

## 🔐 Security Features

| Feature | Implementation |
|---------|---|
| Password Storage | bcryptjs with salt rounds: 10 |
| Token Signing | HS256 with 32+ char secrets |
| Access Token TTL | 15 minutes |
| Refresh Token TTL | 7 days |
| Brute Force Protection | Rate limit: 5 attempts/15 min |
| Registration Spam | Rate limit: 3 accounts/IP/hour |
| Token Verification | Signature check on every protected route |
| CORS | Restricted to allowed origins (configurable) |

## 📁 Project Structure

```
jwt-auth-server/
├── config/
│   └── db.js                 # MongoDB connection
├── models/
│   └── User.js               # User schema & methods
├── middleware/
│   └── auth.js               # JWT verification, rate limiting, RBAC
├── schemas/
│   └── authSchema.js         # Joi validation schemas
├── controllers/
│   └── authController.js     # Business logic for all endpoints
├── routes/
│   └── authRoutes.js         # Express route definitions
├── index.js                  # Server entry point
├── package.json              # Dependencies
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules
└── README.md                 # This file
```

## 🤝 Contributing

Feel free to fork and submit PRs for improvements.

## 📝 License

MIT

## 👤 Author

[Your Name] - [Your GitHub]

---

**Made with ❤️ for learning backend engineering and securing APIs.**
