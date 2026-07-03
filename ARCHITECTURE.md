# JWT Auth Server - Architecture & Flow Explained

## How It All Works (Simple English)

### The Flow When User Registers

```
1. User sends: POST /auth/register
   {email: "user@example.com", password: "pass123"}
   
2. Server validates input (Joi schema)
   ✓ Email format correct?
   ✓ Password at least 6 chars?
   
3. Check database - is email already registered?
   
4. Hash the password with bcrypt (turns "pass123" into random gibberish)
   
5. Save user to MongoDB:
   {
     email: "user@example.com",
     password: "$2b$10$...", // bcrypt hash
     role: "user",
     createdAt: now
   }
   
6. Generate 2 tokens:
   - accessToken (15 min expiry) - for API calls
   - refreshToken (7 day expiry) - to get new accessToken
   
7. Return both tokens to user
```

### The Flow When User Logs In

```
1. User sends: POST /auth/login
   {email: "user@example.com", password: "pass123"}
   
2. Server validates input
   
3. Find user in database by email
   
4. Compare submitted password with stored bcrypt hash
   bcrypt.compare("pass123", "$2b$10$...") → true/false
   
5. If password wrong → return 401 "Invalid email or password"
   
6. If password correct:
   - Generate new tokens
   - Store refreshToken in database
   - Record login activity (timestamp, IP, user agent)
   - Update lastLogin field
   
7. Return accessToken + refreshToken to user
```

### The Flow When User Calls Protected API

```
1. User sends: GET /auth/profile
   Headers: Authorization: Bearer eyJhbGc...
   
2. Middleware extracts token from Authorization header
   
3. Verify JWT signature with JWT_SECRET
   - If signature invalid → return 403 "Invalid token"
   - If expired → return 403 "Expired token"
   - If valid → continue
   
4. Decode token to get userId, email, role
   
5. Attach decoded info to request object (req.user)
   
6. Controller function gets req.user with user info
   
7. Fetch user details from database
   
8. Return profile data (without password)
```

### The Flow When Token Expires

```
1. User tries to call protected endpoint with old token
   
2. Middleware tries to verify token
   
3. JWT sees it's expired (15 min old)
   
4. Returns: 403 "Token expired"
   
5. Frontend catches this error
   
6. Frontend calls: POST /auth/refresh-token
   {refreshToken: "eyJhbGc..."}
   
7. Server verifies refreshToken (7 day TTL)
   
8. If valid:
   - Generate NEW accessToken
   - Generate NEW refreshToken (rotate both)
   - Delete old refreshToken from database
   - Store new refreshToken
   
9. Return new accessToken to client
   
10. Client retries original request with new token
    Works! ✓
```

---

## File Purpose (Each File's Job)

### `index.js` - The Entry Point
- Loads environment variables (.env)
- Creates Express app
- Connects to MongoDB
- Registers routes
- Starts server on port 5000

### `config/db.js` - Database Connection
- Connects to MongoDB Atlas
- Only 15 lines
- Called from index.js

### `models/User.js` - Database Schema
- Defines what a user looks like in database
- Password hashing happens here (pre-save hook)
- Password comparison method (comparePassword)
- Password is never exposed in responses (toJSON method)

### `middleware/auth.js` - Security Guards
- **verifyToken**: Checks if JWT is valid
  - Extracts token from header
  - Verifies signature
  - Attaches user info to request
  
- **authorize**: Role checker
  - Checks if user is admin/user
  - Blocks if not authorized
  
- **loginLimiter**: Blocks brute-force
  - Max 5 login attempts per 15 min
  
- **registerLimiter**: Blocks spam signups
  - Max 3 registrations per IP per hour

### `schemas/authSchema.js` - Input Validation
- Joi schemas that check user input BEFORE it goes to DB
- registerSchema: checks email format, password length
- loginSchema: checks email and password exist
- refreshTokenSchema: checks refreshToken exists

### `controllers/authController.js` - The Brain
- register: Hash password, save user, issue tokens
- login: Find user, verify password, issue tokens, log activity
- refreshToken: Verify refresh token, issue new tokens
- logout: Blacklist refresh token
- getProfile: Return user info
- getLoginHistory: Return activity log

All the real logic lives here.

### `routes/authRoutes.js` - The Router
- Maps URLs to controller functions
- Example: POST /auth/login → calls authController.login
- Applies middleware to routes
- Example: GET /auth/profile → apply verifyToken first

---

## Database Structure

### Users Collection

Each user document looks like:

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  email: "user@example.com",
  password: "$2b$10$...", // NOT the actual password
  role: "user",
  createdAt: ISODate("2024-01-15T10:30:00Z"),
  lastLogin: ISODate("2024-01-15T14:45:00Z"),
  updatedAt: ISODate("2024-01-15T14:45:00Z"),
  
  // Array of valid refresh tokens
  refreshTokens: [
    {
      token: "eyJhbGciOiJIUzI1NiIs...",
      createdAt: ISODate("2024-01-15T14:45:00Z") // expires 7 days from now
    }
  ],
  
  // Activity log
  loginHistory: [
    {
      timestamp: ISODate("2024-01-15T14:45:00Z"),
      ip: "192.168.1.1",
      userAgent: "Mozilla/5.0..."
    },
    {
      timestamp: ISODate("2024-01-14T09:20:00Z"),
      ip: "192.168.1.1",
      userAgent: "Mozilla/5.0..."
    }
  ]
}
```

---

## Token Structure (JWT)

### Access Token (issued at login)
```
Header:     { alg: "HS256", typ: "JWT" }
Payload:    { userId, email, role, iat, exp }
Signature:  HMACSHA256(base64(header) + "." + base64(payload), JWT_SECRET)
Expires in: 15 minutes
Used for:   Calling protected endpoints
```

### Refresh Token (issued at login)
```
Header:     { alg: "HS256", typ: "JWT" }
Payload:    { userId, email, iat, exp }
Signature:  HMACSHA256(..., JWT_REFRESH_SECRET)
Expires in: 7 days
Used for:   Getting new access tokens
Stored in:  Database (so we can revoke it)
```

---

## Security Decisions

| What | Why |
|------|-----|
| **Bcrypt hashing (salt: 10)** | Slows down password brute-force attacks; adds randomness |
| **Access token 15 min TTL** | Even if stolen, attacker has limited time window |
| **Refresh token 7 day TTL** | User doesn't have to log in every 15 minutes |
| **Store refresh tokens in DB** | We can revoke/logout (delete token from DB) |
| **Rate limiting on login** | Prevents brute-force (5 attempts/15 min) |
| **Never return password** | User object uses `.toJSON()` method to hide it |
| **Separate JWT_SECRET & JWT_REFRESH_SECRET** | If access token is stolen, refresh token is still safe |

---

## Common Questions

**Q: Why 2 tokens instead of 1?**
A: If you use one token for 7 days, losing it means 7 days of access. With 2 tokens:
- Access token (15 min): Often exposed in frontend, shorter lifetime
- Refresh token (7 day): Stored securely, only used to get new access tokens

**Q: Why hash passwords?**
A: If database is stolen, attacker can't immediately use passwords. Bcrypt takes milliseconds to check one password, making brute-force impractical.

**Q: Why rate limit login?**
A: Without it, attacker can try 1000 passwords/second. With limit (5/15min), they can try max 480/day.

**Q: Why store refresh tokens in DB?**
A: You can revoke them on logout. Without DB storage, you'd have no way to invalidate tokens.

**Q: Can I use this in production?**
A: Almost. Add:
- Email verification on signup
- Password reset flow
- Change password endpoint
- Delete account endpoint
- 2FA (optional but recommended)

---

## How to Debug

**User says "token expired"**
1. Check if accessToken TTL is 15 min (not 7 days)
2. Tell user to call /auth/refresh-token
3. Client should automatically retry with new token

**User can't login**
1. Check error message (invalid email/password)
2. Check if email is in database
3. Check if bcrypt comparison is working
4. Try resetting password (build password reset endpoint)

**Protected route returns 401**
1. Check if Authorization header is present
2. Check if format is "Bearer <token>"
3. Check if token is expired
4. Check if JWT_SECRET matches what was used to sign

**Rate limiting blocks me**
1. If 5 failed logins in 15 min → wait 15 min
2. Check your test email/password
3. Restart server (clears in-memory limits)

---

## Next Features to Add (After This Works)

- Email verification on signup
- Password reset flow (email link)
- Change password endpoint
- Delete account endpoint
- Google/GitHub OAuth
- 2FA with authenticator app
- Session management (invalidate all tokens for a user)
- Admin panel to manage users
- API rate limiting (global, not just login)

---

This is a real, production-quality auth system. After you build this, you'll understand backend security deeply.
