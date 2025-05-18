import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout/Layout';
import HomePage from './pages/Home/HomePage';
import PolicyDetailPage from './pages/Policies/PolicyDetailPage';
import './App.css';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="policies/:sectionId" element={<PolicyDetailPage />} />
            <Route path="procedures" element={<div className="placeholder-page"><h2>Procedures Page</h2><p>Coming soon...</p></div>} />
            <Route path="resources" element={<div className="placeholder-page"><h2>Resources Page</h2><p>Coming soon...</p></div>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
