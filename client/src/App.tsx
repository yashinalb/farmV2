import { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import { Snackbar, Alert, CssBaseline, Box, Toolbar, ThemeProvider, createTheme } from '@mui/material';
import Home from './pages/home/Home';
import Invoice from './pages/invoice/Invoice';
import AddBuyer from './pages/add-buyer/AddBuyer';
import AddProducts from './pages/add-products/AddProducts';
import Login from './pages/login/Login';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import Menu from './components/menu/Menu';
import { login, logout } from './utils/auth';


function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
    // ... other theme properties
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));

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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerWidth = 240;

  const Layout = () => (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Navbar onLogout={handleLogout} handleDrawerToggle={handleDrawerToggle} />
        <Menu mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} drawerWidth={drawerWidth} />
        <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, marginLeft: { sm: mobileOpen ? `${drawerWidth}px` : '0px' } }}>
          <Toolbar />
          <div style={{ backgroundColor: 'lightblue' }}>
            <Outlet />
          </div>

          <Footer />
        </Box>
      </Box>
    </ThemeProvider>
  );

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
      <ThemeProvider theme={theme}>
        <Snackbar open={alert.open} autoHideDuration={8000} onClose={handleAlertClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
          <Alert severity={alert.severity} sx={{ width: '100%' }}>
            {alert.message}
          </Alert>
        </Snackbar>
        <RouterProvider router={router}>
          {/* ... rest of your component */}
        </RouterProvider>
      </ThemeProvider>
    </>
  );
}

export default App;