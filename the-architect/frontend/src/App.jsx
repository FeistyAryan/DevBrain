import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import TreeView from './components/TreeView';
import GraphView from './components/GraphView';
import ChatPanel from './components/ChatPanel';
import CommandPalette from './components/CommandPalette';
import ConnectionStatus from './components/ConnectionStatus';
import Login from './components/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import useStore from './store/useStore';
import './styles/index.css';
import './App.css';

function AppContent() {
  const { user } = useAuth();
  const { 
    currentView, 
    selectedNodeId, 
    initializeProject, 
    loadProject,
    checkConnection, 
    projectId,
    clearUserData
  } = useStore();

  useEffect(() => {
    if (!user) {
      // User logged out, clear data
      clearUserData();
      return;
    }

    // Initialize the app for authenticated user
    const initApp = async () => {
      // Check backend connection
      const connected = await checkConnection();
      
      if (connected) {
        // Check if we have a stored project ID for this user
        const storedProjectId = localStorage.getItem(`devbrain_project_id_${user.uid}`);
        
        if (storedProjectId) {
          // Load existing project
          try {
            await loadProject(storedProjectId);
            console.log('✅ Loaded existing project:', storedProjectId);
          } catch (error) {
            console.log('Failed to load project, creating new one:', error);
            // If loading fails, create a new project
            const project = await initializeProject({
              name: `${user.displayName || user.email}'s Project`,
              description: 'AI-powered mind mapping and project planning',
            });
            if (project) {
              localStorage.setItem(`devbrain_project_id_${user.uid}`, project.id);
            }
          }
        } else {
          // No stored project, create a new one
          try {
            const project = await initializeProject({
              name: `${user.displayName || user.email}'s Project`,
              description: 'AI-powered mind mapping and project planning',
            });
            if (project) {
              localStorage.setItem(`devbrain_project_id_${user.uid}`, project.id);
              console.log('✅ Created new project:', project.id);
            }
          } catch (error) {
            console.log('Failed to create project, using mock data');
          }
        }
      }
    };

    initApp();
  }, [user]); // Re-run when user changes

  // Save project ID to localStorage when it changes (user-specific)
  useEffect(() => {
    if (projectId && user) {
      localStorage.setItem(`devbrain_project_id_${user.uid}`, projectId);
    }
  }, [projectId, user]);

  // Show login if not authenticated
  if (!user) {
    return <Login />;
  }

  return (
    <div className="app">
      <Navbar />
      <CommandPalette />
      <ConnectionStatus />

      <div className={`main-content ${selectedNodeId ? 'chat-open' : ''}`}>
        <AnimatePresence mode="wait">
          {currentView === 'tree' ? (
            <motion.div
              key="tree"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="view-container"
            >
              <TreeView />
            </motion.div>
          ) : (
            <motion.div
              key="graph"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="view-container"
            >
              <GraphView />
            </motion.div>
          )}
        </AnimatePresence>

        <ChatPanel />
      </div>
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
