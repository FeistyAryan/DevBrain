# 🔐 Environment Variables Setup Guide

## 📋 Overview

DevBrain uses environment variables to keep sensitive information (API keys, credentials) secure and out of version control.

## 🎯 Quick Setup

### Backend Environment Variables

1. **Copy the example file:**
   ```bash
   cd backend/backend
   cp .env.example .env
   ```

2. **Edit `.env` and add your keys:**
   ```bash
   # Required
   GEMINI_API_KEY=AIzaSyYourActualGeminiKeyHere
   
   # Optional (defaults are fine for development)
   DEBUG=True
   SECRET_KEY=your-secret-key
   ```

3. **Get your Gemini API key:**
   - Go to https://makersuite.google.com/app/apikey
   - Click "Create API Key"
   - Copy the key and paste it in `.env`

### Frontend Environment Variables

1. **Copy the example file:**
   ```bash
   cd frontend
   cp .env.example .env.local
   ```

2. **Edit `.env.local` and add your keys:**
   ```bash
   # Backend API (usually no change needed)
   VITE_API_URL=http://localhost:8000/api
   
   # Firebase Config (get from Firebase Console)
   VITE_FIREBASE_API_KEY=AIzaSyYourFirebaseKeyHere
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
   VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

3. **Get your Firebase config:**
   - Go to Firebase Console → Project Settings
   - Scroll to "Your apps" → Web app
   - Copy the config values

## 📁 File Structure

```
DevBrain/
├── backend/backend/
│   ├── .env                 ← Your actual keys (gitignored)
│   ├── .env.example         ← Template (committed to git)
│   └── .gitignore           ← Includes .env
│
└── frontend/
    ├── .env.local           ← Your actual keys (gitignored)
    ├── .env.example         ← Template (committed to git)
    └── .gitignore           ← Includes *.local
```

## 🔑 Required API Keys

### 1. Gemini API Key (Required for AI Chat)

**Where to get it:**
- https://makersuite.google.com/app/apikey

**Where to use it:**
- Backend: `backend/backend/.env` → `GEMINI_API_KEY`
- Frontend: `frontend/.env.local` → `VITE_GEMINI_API_KEY` (optional)

**What it's for:**
- Powers the AI chat responses
- Generates task breakdowns
- Provides intelligent suggestions

### 2. Firebase Config (Required for Authentication)

**Where to get it:**
- Firebase Console → Project Settings → Your apps → Web app

**Where to use it:**
- Frontend: `frontend/.env.local` → All `VITE_FIREBASE_*` variables

**What it's for:**
- User authentication (login/signup)
- Google Sign-In
- User session management

## ✅ Verification

### Check Backend Environment

```bash
cd backend/backend
source venv/bin/activate
python manage.py shell
```

Then in the Python shell:
```python
from django.conf import settings
print(f"Gemini API Key loaded: {settings.GEMINI_API_KEY[:20]}...")
# Should show: AIzaSy...
```

### Check Frontend Environment

```bash
cd frontend
npm run dev
```

Open browser console and check:
```javascript
console.log('API URL:', import.meta.env.VITE_API_URL)
console.log('Firebase Project:', import.meta.env.VITE_FIREBASE_PROJECT_ID)
```

## 🚨 Security Best Practices

### ✅ DO:
- Keep `.env` and `.env.local` files in `.gitignore`
- Use `.env.example` files to document required variables
- Regenerate keys if they're exposed
- Use different keys for development and production
- Restrict API keys to specific domains/IPs in production

### ❌ DON'T:
- Commit `.env` or `.env.local` files to git
- Share API keys in chat, email, or screenshots
- Use production keys in development
- Hardcode API keys in source code
- Push keys to public repositories

## 🔄 Key Rotation (If Exposed)

If your API key is exposed:

### Gemini API Key:
1. Go to https://makersuite.google.com/app/apikey
2. Delete the exposed key
3. Create a new key
4. Update `.env` files
5. Restart servers

### Firebase Config:
1. Go to Google Cloud Console
2. Find the exposed API key
3. Restrict or regenerate it
4. Update `.env.local`
5. Restart frontend

## 📝 Environment Variables Reference

### Backend (.env)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DEBUG` | No | `True` | Django debug mode |
| `SECRET_KEY` | No | Auto-generated | Django secret key |
| `GEMINI_API_KEY` | Yes | None | Google Gemini API key |
| `DATABASE_URL` | No | SQLite | Database connection string |
| `ALLOWED_HOSTS` | No | `*` | Allowed host names |

### Frontend (.env.local)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | Yes | `http://localhost:8000/api` | Backend API URL |
| `VITE_GEMINI_API_KEY` | No | None | Gemini key (fallback) |
| `VITE_FIREBASE_API_KEY` | Yes | None | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Yes | None | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Yes | None | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Yes | None | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Yes | None | Firebase sender ID |
| `VITE_FIREBASE_APP_ID` | Yes | None | Firebase app ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | No | None | Firebase analytics ID |

## 🎯 Common Issues

### "API key not valid"
- Check for extra spaces or quotes in `.env`
- Make sure `.env` file is in the correct directory
- Restart the server after changing `.env`
- Verify the key is correct in the API console

### "Firebase: Error (auth/invalid-api-key)"
- Check Firebase config in `.env.local`
- Make sure all Firebase variables are set
- Verify the project ID matches your Firebase project
- Check for typos in variable names

### "Cannot connect to backend"
- Check `VITE_API_URL` in `.env.local`
- Make sure backend server is running
- Verify the port number (default: 8000)
- Check CORS settings in backend

## 🚀 Production Deployment

### Backend:
```bash
# Use environment variables from hosting platform
# Don't commit production .env to git
DEBUG=False
SECRET_KEY=<strong-random-key>
GEMINI_API_KEY=<production-key>
ALLOWED_HOSTS=yourdomain.com
DATABASE_URL=postgresql://...
```

### Frontend:
```bash
# Build with production environment
VITE_API_URL=https://api.yourdomain.com/api
VITE_FIREBASE_API_KEY=<production-firebase-key>
# ... other Firebase config
```

## 📚 Additional Resources

- [Django Environment Variables](https://docs.djangoproject.com/en/4.2/topics/settings/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Firebase Security](https://firebase.google.com/docs/projects/api-keys)
- [Gemini API Documentation](https://ai.google.dev/docs)

---

**Remember:** Never commit `.env` or `.env.local` files to version control! 🔒