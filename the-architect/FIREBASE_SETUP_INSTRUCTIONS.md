# 🔥 Firebase Auth Setup Instructions

## ✅ Frontend Files Created

I've created all the necessary frontend files for Firebase Authentication:

- ✅ `frontend/src/config/firebase.js` - Firebase configuration
- ✅ `frontend/src/contexts/AuthContext.jsx` - Auth state management
- ✅ `frontend/src/components/Login.jsx` - Login/Signup UI
- ✅ `frontend/src/styles/Login.css` - Login page styling
- ✅ Updated `frontend/src/App.jsx` - Auth integration
- ✅ Updated `frontend/src/components/Navbar.jsx` - User profile & logout
- ✅ Updated `frontend/src/services/api.js` - Token authentication
- ✅ Updated `frontend/src/store/useStore.js` - User data management

## 🚀 Step 1: Install Firebase SDK

```bash
cd frontend
npm install firebase
```

## 🔧 Step 2: Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Name it "DevBrain" (or whatever you prefer)
4. Disable Google Analytics (optional)
5. Click "Create project"

## 🔐 Step 3: Enable Authentication

1. In Firebase Console, click "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable **Email/Password**:
   - Click on "Email/Password"
   - Toggle "Enable"
   - Click "Save"
5. Enable **Google**:
   - Click on "Google"
   - Toggle "Enable"
   - Select a support email
   - Click "Save"

## 🔑 Step 4: Get Firebase Config

1. In Firebase Console, click the gear icon ⚙️ → "Project settings"
2. Scroll down to "Your apps"
3. Click the web icon `</>`
4. Register app as "DevBrain Web"
5. Copy the `firebaseConfig` object

It will look like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxxxxxxxxxx"
};
```

## 📝 Step 5: Update Firebase Config

Open `frontend/src/config/firebase.js` and replace the placeholder config:

```javascript
// Replace this:
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// With your actual config from Firebase Console
```

## 🧪 Step 6: Test the Frontend

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` - you should see the login page!

### Test Email Signup:
1. Click "Don't have an account? Sign up"
2. Enter email and password (min 6 characters)
3. Click "Sign Up"
4. You should be logged in! ✅

### Test Google Sign-In:
1. Click "Continue with Google"
2. Select your Google account
3. You should be logged in! ✅

### Test Logout:
1. Click on your profile in the top-right
2. Click "Sign out"
3. You should be back at the login page ✅

## 🎯 What's Working Now (Frontend Only)

- ✅ Email/Password signup and login
- ✅ Google Sign-In
- ✅ User profile display (name, email, photo)
- ✅ Logout functionality
- ✅ Token management (auto-refresh)
- ✅ User-specific localStorage (projects per user)
- ✅ Protected routes (must login to access app)

## ⚠️ Backend Integration (Optional - For Production)

The frontend is fully functional! However, the backend is still using the default user.

If you want **true user isolation** (each user sees only their data), you need to:

### Option A: Keep It Simple (Current Setup)
- Frontend handles auth
- Backend uses default user for everyone
- Good for: Personal use, demos, prototypes

### Option B: Full Integration (Production)
Follow the backend setup in `FIREBASE_AUTH_GUIDE.md`:
1. Install Firebase Admin SDK in backend
2. Add token verification middleware
3. Update Django settings
4. Each user gets their own data

## 🎨 Customization

### Change Login Page Colors:
Edit `frontend/src/styles/Login.css`:
```css
.login-container {
  background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
}
```

### Add More Auth Providers:
In Firebase Console → Authentication → Sign-in method:
- GitHub
- Facebook  
- Twitter
- Apple
- Phone

Then update `frontend/src/config/firebase.js` to add the provider.

## 🐛 Troubleshooting

### "Firebase: Error (auth/invalid-api-key)"
- Check that you copied the correct `apiKey` from Firebase Console
- Make sure there are no extra spaces or quotes

### "Firebase: Error (auth/unauthorized-domain)"
- Go to Firebase Console → Authentication → Settings
- Add `localhost` to "Authorized domains"

### Google Sign-In popup blocked
- Allow popups in your browser
- Or use redirect instead of popup (see Firebase docs)

### "Module not found: Can't resolve 'firebase'"
- Run `npm install firebase` in the frontend directory
- Restart the dev server

## ✅ Success Checklist

- [ ] Firebase project created
- [ ] Email/Password auth enabled
- [ ] Google auth enabled
- [ ] Firebase config copied to `firebase.js`
- [ ] `npm install firebase` completed
- [ ] Frontend dev server running
- [ ] Can sign up with email
- [ ] Can login with Google
- [ ] User profile shows in navbar
- [ ] Can logout successfully

## 🎉 You're Done!

Your app now has:
- 🔐 Secure authentication
- 👤 User profiles
- 🔄 Auto token refresh
- 📱 Google Sign-In
- 💾 User-specific data storage

**Next steps:**
- Create some mind maps!
- Test with multiple users
- Deploy to production
- Add backend integration (optional)

Need help? Check `FIREBASE_AUTH_GUIDE.md` for more details!
