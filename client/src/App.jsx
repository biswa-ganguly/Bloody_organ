import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getCurrentUser } from './services/authService';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import DonorRegistration from './pages/DonorRegistration';
// import About from './pages/About';
import AdminDashboard from './pages/admin/Dashboard';
import DonorsList from './pages/admin/DonorsList';
import TransplantRequests from './pages/admin/TransplantRequests';
import RequestForm from './pages/RequestForm';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar user={user} setUser={setUser} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard user={user} />
                </ProtectedRoute>
              }
            />
            <Route path="/donor-registration" element={<DonorRegistration />} />
            <Route path="/request-transplant" element={<RequestForm />} />
            {/* <Route path="/about" element={<About />} /> */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/donors" 
              element={
                <ProtectedRoute>
                  <DonorsList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/requests" 
              element={
                <ProtectedRoute>
                  <TransplantRequests />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
