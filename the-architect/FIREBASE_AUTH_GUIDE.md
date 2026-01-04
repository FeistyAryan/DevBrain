# Firebase Authentication Integration Guide

## 🎯 Overview

Adding Firebase Auth will enable:
- ✅ User login/signup (Email, Google, GitHub, etc.)
- ✅ Protected routes and projects
- ✅ User-specific data isolation
- ✅ Secure API requests with JWT tokens
- ✅ Profile management

## 📋 Implementation Steps

### Phase 1: Firebase Setup (15 minutes)

#### 1. Create Firebase Project
```bash
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Name it "DevBrain" or similar
4. Disable Google Analytics (optional)
5. Click "Create project"
```

#### 2. Enable Authentication Methods
```bash
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable:
   - Email/Password
   - Google (recommended)
   - GitHub (optional)
```

#### 3. Get Firebase Config
```bash
1. Go to Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click web icon (</>)
4. Register app as "DevBrain Web"
5. Copy the firebaseConfig object
```

---

### Phase 2: Frontend Integration (30 minutes)

#### 1. Install Firebase SDK
```bash
cd frontend
npm install firebase
```

#### 2. Create Firebase Config
Create `frontend/src/config/firebase.js`:

```javascript
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

// Your Firebase config from console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Auth functions
export const loginWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signupWithEmail = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

export const logout = () => {
  return signOut(auth);
};

export { onAuthStateChanged };
```

#### 3. Create Auth Context
Create `frontend/src/contexts/AuthContext.jsx`:

```javascript
import { createContext, useContext, useEffect, useState } from 'react';
import { auth, onAuthStateChanged } from '../config/firebase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firebaseToken, setFirebaseToken] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Get Firebase ID token for backend authentication
        const token = await user.getIdToken();
        setFirebaseToken(token);
        localStorage.setItem('firebase_token', token);
      } else {
        setFirebaseToken(null);
        localStorage.removeItem('firebase_token');
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    firebaseToken,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
```

#### 4. Create Login Component
Create `frontend/src/components/Login.jsx`:

```javascript
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';
import { loginWithEmail, signupWithEmail, loginWithGoogle } from '../config/firebase';
import '../styles/Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        await signupWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setLoading(true);

    try {
      await loginWithGoogle();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <motion.div
        className="login-card glass-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="login-header">
          <div className="logo-icon">🧠</div>
          <h1>Welcome to DevBrain</h1>
          <p>AI-powered mind mapping for developers</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="login-form">
          <div className="form-group">
            <label>
              <Mail size={16} />
              Email
            </label>
            <input
              type="email"
              className="glass-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <Lock size={16} />
              Password
            </label>
            <input
              type="password"
              className="glass-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="glass-button primary full-width"
            disabled={loading}
          >
            <LogIn size={18} />
            {loading ? 'Loading...' : isSignup ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <button
          onClick={handleGoogleAuth}
          className="glass-button full-width"
          disabled={loading}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div className="login-footer">
          <button
            type="button"
            className="text-button"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
```

#### 5. Update App.jsx
```javascript
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';

function AppContent() {
  const { user } = useAuth();
  
  if (!user) {
    return <Login />;
  }
  
  // Your existing App component content
  return (
    <div className="app">
      <Navbar />
      {/* ... rest of your app */}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
```

#### 6. Update Navbar with Logout
```javascript
import { useAuth } from '../contexts/AuthContext';
import { logout } from '../config/firebase';

// In your profile menu:
<button 
  className="profile-menu__item"
  onClick={() => logout()}
>
  <LogOut size={16} />
  Sign out
</button>
```

---

### Phase 3: Backend Integration (45 minutes)

#### 1. Install Firebase Admin SDK
```bash
cd backend/backend
source venv/bin/activate
pip install firebase-admin
pip freeze > requirements.txt
```

#### 2. Get Firebase Service Account
```bash
1. Go to Firebase Console > Project Settings
2. Go to "Service accounts" tab
3. Click "Generate new private key"
4. Save as backend/backend/firebase-credentials.json
5. Add to .gitignore!
```

#### 3. Create Firebase Auth Middleware
Create `backend/backend/api/firebase_auth.py`:

```python
import firebase_admin
from firebase_admin import credentials, auth
from rest_framework import authentication, exceptions
from django.contrib.auth.models import User
from django.conf import settings
import os

# Initialize Firebase Admin
cred_path = os.path.join(settings.BASE_DIR, 'firebase-credentials.json')
if not firebase_admin._apps:
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

class FirebaseAuthentication(authentication.BaseAuthentication):
    """
    Firebase token authentication for DRF.
    Clients should authenticate by passing the token in the Authorization header.
    Example: Authorization: Bearer <firebase_id_token>
    """
    
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        
        if not auth_header.startswith('Bearer '):
            return None
        
        token = auth_header.split('Bearer ')[1]
        
        try:
            # Verify Firebase token
            decoded_token = auth.verify_id_token(token)
            uid = decoded_token['uid']
            email = decoded_token.get('email', '')
            
            # Get or create Django user
            user, created = User.objects.get_or_create(
                username=uid,
                defaults={
                    'email': email,
                    'first_name': decoded_token.get('name', '').split()[0] if decoded_token.get('name') else '',
                }
            )
            
            return (user, None)
            
        except Exception as e:
            raise exceptions.AuthenticationFailed(f'Invalid token: {str(e)}')
```

#### 4. Update Django Settings
In `backend/backend/config/settings.py`:

```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'api.firebase_auth.FirebaseAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 100,
}

# Add firebase-credentials.json to .gitignore
```

#### 5. Update API Service (Frontend)
In `frontend/src/services/api.js`:

```javascript
// Helper function for API requests with auth
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get Firebase token from localStorage
  const token = localStorage.getItem('firebase_token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};
```

---

### Phase 4: User-Specific Data (30 minutes)

#### 1. Update Views to Filter by User
The views already filter by `request.user`, so they'll automatically work!

```python
# In ProjectViewSet - already implemented
def get_queryset(self):
    if self.request.user.is_authenticated:
        return Project.objects.filter(owner=self.request.user)
    # ...
```

#### 2. Update Frontend to Handle Auth State
```javascript
// In useStore.js
const useStore = create((set, get) => ({
  // ... existing state
  
  // Clear data on logout
  clearUserData: () => {
    localStorage.removeItem('devbrain_project_id');
    set({
      projectId: null,
      nodes: [],
      edges: [],
      chatHistory: {},
      selectedNodeId: null,
    });
  },
}));
```

#### 3. Call clearUserData on Logout
```javascript
// In logout function
import useStore from '../store/useStore';

const handleLogout = async () => {
  const { clearUserData } = useStore.getState();
  await logout();
  clearUserData();
};
```

---

## 🎨 Styling the Login Page

Create `frontend/src/styles/Login.css`:

```css
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 420px;
  padding: 40px;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header .logo-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.login-header h1 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.login-header p {
  color: var(--text-secondary);
  font-size: 14px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.error-message {
  padding: 12px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: #ef4444;
  font-size: 14px;
  margin-bottom: 16px;
}

.divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 24px 0;
  color: var(--text-tertiary);
  font-size: 14px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--glass-border);
}

.login-footer {
  text-align: center;
  margin-top: 24px;
}

.text-button {
  background: none;
  border: none;
  color: var(--accent-primary);
  cursor: pointer;
  font-size: 14px;
  padding: 8px;
}

.text-button:hover {
  text-decoration: underline;
}

.full-width {
  width: 100%;
}
```

---

## 🧪 Testing the Integration

### 1. Test Email Signup
```bash
1. Start both servers
2. Go to http://localhost:5173
3. Click "Sign up"
4. Enter email and password
5. Should create account and log in
```

### 2. Test Google Login
```bash
1. Click "Continue with Google"
2. Select Google account
3. Should log in and show app
```

### 3. Test Data Isolation
```bash
1. Create nodes as User A
2. Log out
3. Log in as User B
4. Should see empty project (User A's data is private)
```

### 4. Test Token Authentication
```bash
# Check network tab in browser DevTools
# API requests should have:
Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6...
```

---

## 🔒 Security Best Practices

### 1. Environment Variables
```bash
# frontend/.env.local
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
# ... other config

# backend/.env
FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json
```

### 2. Gitignore
```
# Add to .gitignore
firebase-credentials.json
.env
.env.local
```

### 3. CORS Configuration
```python
# In settings.py
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'https://your-production-domain.com',
]
```

---

## 📊 Benefits of Firebase Auth

✅ **Security**: Industry-standard authentication
✅ **Scalability**: Handles millions of users
✅ **Features**: Email, Google, GitHub, phone, etc.
✅ **Free Tier**: 10K auth/month free
✅ **Easy Setup**: Minimal backend code
✅ **Token Management**: Automatic refresh
✅ **User Management**: Built-in admin panel

---

## 🎯 Estimated Time

- **Firebase Setup**: 15 minutes
- **Frontend Integration**: 30 minutes
- **Backend Integration**: 45 minutes
- **Testing**: 15 minutes
- **Total**: ~2 hours

---

## 🚀 Next Steps After Auth

1. **User Profiles**: Add profile pictures, names
2. **Project Sharing**: Share projects with other users
3. **Team Workspaces**: Collaborative mind mapping
4. **Role-Based Access**: Admin, editor, viewer roles
5. **Activity Logs**: Track who changed what

---

Ready to implement? Let me know if you want me to create any of these files for you! 🔥