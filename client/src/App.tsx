import { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import Home from "./pages/home/Home";
import Invoice from "./pages/invoice/Invoice";
import AddBuyer from "./pages/add-buyer/AddBuyer";
import AddProducts from "./pages/add-products/AddProducts";
import Login from './pages/login/Login';
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Menu from "./components/menu/Menu";
import "./styles/global.scss";
import { login } from './utils/auth';
import { logout } from './utils/auth';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    // Check the local storage for a token to determine initial state
    return !!localStorage.getItem('token');
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Inside your App component:
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });

  // Add this function to handle alert close
  const handleAlertClose = (event, reason) => {
    if (reason !== 'clickaway') {
      setAlert(prev => ({ ...prev, open: false }));
    }
  };

  // Modify handleLogin to use setAlert
  const handleLogin = async (email, password) => {
    const result = await login(email, password);
    if (result.ok) {
      setIsLoggedIn(true);
      setAlert(prev => ({ 
        open: true, 
        message: result.ok ? 'Logged in successfully!' : (result.error || 'Authentication failed'), 
        severity: result.ok ? 'success' : 'error' 
      }));
    } else {
      setAlert({ open: true, message: result.error || 'Authentication failed', severity: 'error' });
    }
  };
  


  const handleLogout = () => {
    logout(); // This calls the logout function from your auth utility.
    setIsLoggedIn(false);
  };

  const Layout = () => {
    return (
      <div className="main">
        <Navbar onLogout={handleLogout} />
        <div className="container">
          <div className="menuContainer">
            <Menu />
          </div>
          <div className="contentContainer">
            <Outlet />
          </div>
        </div>
        <Footer />
      </div>
    );
    
    
  };
  const router = createBrowserRouter([

    {
      path: '/login',
      element: isLoggedIn ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} setAlert={setAlert} />
      ,
    },
    {
      path: "/",
      element: isLoggedIn ? <Layout /> : <Navigate to="/login" replace />,
      children: [
        { index: true, element: <Home /> },
        { path: '/add-buyer', element: <AddBuyer /> },
        { path: '/add-product', element: <AddProducts /> },
        { path: '/invoice', element: <Invoice /> },
      ]
    },
  ]);
  return (
    <>
      <Snackbar open={alert.open} autoHideDuration={8000} onClose={handleAlertClose} anchorOrigin={{ vertical: 'top', horizontal: 'center'}}>
        <Alert severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>

      <RouterProvider router={router}>
        {/* ... rest of your component */}
      </RouterProvider>
    </>
  );
}

export default App;