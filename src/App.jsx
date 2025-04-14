import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import DonorRegistration from './pages/DonorRegistration';
// import About from './pages/About';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import DonorsList from './pages/admin/DonorsList';
import TransplantRequests from './pages/admin/TransplantRequests';
import RequestForm from './pages/RequestForm';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is logged in on component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
      setIsLoggedIn(true);
      setIsAdmin(user.role === 'admin');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  // Protected route component
  const AdminRoute = ({ children }) => {
    return isAdmin ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} onLogout={handleLogout} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/donor-registration" element={<DonorRegistration />} />
            <Route path="/request-transplant" element={<RequestForm />} />
            {/* <Route path="/about" element={<About />} /> */}
            <Route 
              path="/login" 
              element={<Login setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />} 
            />
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/donors" 
              element={
                <AdminRoute>
                  <DonorsList />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/requests" 
              element={
                <AdminRoute>
                  <TransplantRequests />
                </AdminRoute>
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
