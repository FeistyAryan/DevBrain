import { createContext, useContext, useEffect, useState } from 'react';
import { auth, onAuthStateChanged } from '../config/firebase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firebaseToken, setFirebaseToken] = useState(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Get Firebase ID token for backend authentication
        try {
          const token = await user.getIdToken();
          setFirebaseToken(token);
          localStorage.setItem('firebase_token', token);
          console.log('✅ User authenticated:', user.email);
        } catch (error) {
          console.error('Error getting token:', error);
        }
      } else {
        setFirebaseToken(null);
        localStorage.removeItem('firebase_token');
        console.log('👋 User logged out');
      }
      
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Refresh token every 55 minutes (tokens expire after 1 hour)
  useEffect(() => {
    if (!user) return;

    const refreshToken = async () => {
      try {
        const token = await user.getIdToken(true); // Force refresh
        setFirebaseToken(token);
        localStorage.setItem('firebase_token', token);
        console.log('🔄 Token refreshed');
      } catch (error) {
        console.error('Error refreshing token:', error);
      }
    };

    // Refresh every 55 minutes
    const interval = setInterval(refreshToken, 55 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user]);

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
