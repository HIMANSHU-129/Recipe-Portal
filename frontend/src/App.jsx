import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import CreateRecipe from './pages/CreateRecipe';
import './App.css';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>🍽️ Recipe Sharing Portal</h1>
          {isAuthenticated && (
            <button 
              className="logout-btn" 
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                window.location.href = '/login';
              }}
            >
              Logout
            </button>
          )}
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
            <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
            <Route path="/create" element={isAuthenticated ? <CreateRecipe /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
