import { useState } from 'react';
import { Box, Button, Container, TextField, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom'

function Login({ onLogin, setAlert }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateEmail(email)) {
      setAlert({ open: true, message: 'Please enter a valid email address.', severity: 'error' });
      return;
    }
    if (!password) {
      setAlert({ open: true, message: 'Please enter your password.', severity: 'error' });
      return;
    }
  
    setIsSubmitting(true);
    try {
      await onLogin(email, password);
      // If login is successful, navigate to home page
      navigate('/');
    } catch (error) {
      // If login fails, display the error message
      setAlert({ open: true, message: error.message || 'Login failed, please try again.', severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!validateEmail(email) && email.length > 0}
          helperText={!validateEmail(email) && email.length > 0 ? "Invalid email address" : ""}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={!validateEmail(email) || !password || isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} /> : 'Sign In'}
        </Button>
      </Box>
    </Box>
  </Container>
  );
}

export default Login;
