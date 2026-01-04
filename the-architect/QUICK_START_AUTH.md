# 🚀 Quick Start: Firebase Auth (5 Minutes)

## Step 1: Install Firebase (30 seconds)
```bash
cd frontend
npm install firebase
```

## Step 2: Create Firebase Project (2 minutes)
1. Go to https://console.firebase.google.com/
2. Click "Add project" → Name it "DevBrain"
3. Click "Create project"

## Step 3: Enable Auth (1 minute)
1. Click "Authentication" → "Get started"
2. Enable "Email/Password" ✅
3. Enable "Google" ✅

## Step 4: Get Config (1 minute)
1. Click ⚙️ → "Project settings"
2. Scroll to "Your apps" → Click `</>`
3. Register as "DevBrain Web"
4. **Copy the firebaseConfig object**

## Step 5: Update Config (30 seconds)
Open `frontend/src/config/firebase.js` and paste your config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxx"
};
```

## Step 6: Start & Test (30 seconds)
```bash
npm run dev
```

Open `http://localhost:5173` → You'll see the login page!

## ✅ Done!

- Try signing up with email
- Try Google Sign-In
- Create mind maps
- Logout and login again

**Everything persists per user!** 🎉

---

**Need more details?** See `FIREBASE_SETUP_INSTRUCTIONS.md`