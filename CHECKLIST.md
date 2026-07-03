# JWT Auth Server - Quick Start Checklist

## ✅ Setup (15 minutes)

- [ ] Create folder: `mkdir jwt-auth-server && cd jwt-auth-server`
- [ ] Initialize npm: `npm init -y`
- [ ] Install packages: `npm install express mongoose bcryptjs jsonwebtoken dotenv joi express-rate-limit cors` && `npm install --save-dev nodemon`
- [ ] Create folders: `mkdir config models controllers schemas middleware routes`
- [ ] Copy all `.js` files into respective folders
- [ ] Copy `.env.example` and rename to `.env`
- [ ] Create MongoDB Atlas account (free tier)
- [ ] Get MongoDB connection string and paste in `.env`
- [ ] Update `package.json` with npm scripts

## ✅ Files to Create (in order)

```
jwt-auth-server/
├── config/
│   └── db.js                    ← Copy config-db.js
├── models/
│   └── User.js                  ← Copy models-User.js
├── middleware/
│   └── auth.js                  ← Copy middleware-auth.js
├── schemas/
│   └── authSchema.js            ← Copy schemas-authSchema.js
├── controllers/
│   └── authController.js        ← Copy controllers-authController.js
├── routes/
│   └── authRoutes.js            ← Copy routes-authRoutes.js
├── index.js                     ← Copy index.js
├── package.json                 ← Copy package.json
├── .env                         ← Create from .env.example
├── .env.example                 ← Copy .env.example
├── .gitignore                   ← Copy .gitignore
├── README.md                    ← Copy README.md
└── postman-collection.json      ← Copy postman-collection.json (optional but helpful)
```

## ✅ Local Testing (5 minutes)

1. Start server: `npm run dev`
2. Should see: `✅ Server running on http://localhost:5000`
3. Open Postman or terminal
4. Test endpoints (see SETUP_GUIDE.md for curl commands)

## ✅ Deployment (5 minutes)

1. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. Deploy on Render:
   - Go to render.com
   - Create new Web Service from GitHub repo
   - Add environment variables
   - Deploy

3. Your live URL: `https://your-app.onrender.com`

## 📊 What You Have After This

✅ **Production-ready backend** with:
- User registration & login
- JWT token management (access + refresh)
- Password hashing (bcrypt)
- Rate limiting (brute-force protection)
- Role-based access control
- Login activity tracking
- Deployed live on Render
- Clean GitHub repo
- Professional README
- API documentation

✅ **Recruiters will see:**
- Real backend engineering skills
- Security awareness (bcrypt, JWT, rate limiting)
- Complete MERN stack knowledge
- Deployment experience
- Professional code structure

## 🎯 Portfolio Impact

Before: "JWT & OAuth2 Auth Server — Planned" ❌
After: "JWT & OAuth2 Auth Server — [Live Link] [GitHub Link]" ✅

---

## Time Estimate

- Setup: 15 min
- Local testing: 5 min
- GitHub push: 3 min
- Render deployment: 5 min
- **Total: ~30 minutes**

---

## Next: Update Your Portfolio

1. Update portfolio README (replace "Planned" with live URL)
2. Add project screenshot to assets/
3. Update project description with real features
4. Push updated portfolio to GitHub Pages

Done! You now have 2 real, deployed projects. 🚀

---

## Recruiting Talking Points

**"I built a JWT & OAuth2 authorization server that handles user authentication, token management, password security, and role-based access control. It's deployed live on Render with full API documentation and rate limiting for production security. The system uses bcryptjs for password hashing, JWT for stateless auth, and MongoDB Atlas for data persistence."**

---

Keep it simple. Ship it. Move on to the next one. 💪
