import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

import './SignupLoginForm'
import SignupLoginForm from './SignupLoginForm';
import ForgotPassword from './ForgotPassword';
import Dashboard from './components/tickets/UserTicketDashboard';
import AdminDashboard  from './components/tickets/AdminDashboard';
import AgentDashboard from './components/tickets/AgentDashboard';
import HomePage from './components/tickets/homepage';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signuplogin" element={<SignupLoginForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/agent" element={<AgentDashboard />} />
        <Route
          path="*"
          element={
            isAuthenticated && userRole === 'admin' ? (
              <Navigate to="/admin" />
            ) : isAuthenticated && userRole === 'agent' ? (
              <Navigate to="/agent" />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;