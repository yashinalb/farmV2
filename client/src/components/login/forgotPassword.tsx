import { useState } from 'react';
import { Box, Button, TextField, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 

function ForgotPassword({ onForgotPassword, setAlert }) {
    const [email, setEmail] = useState('');
    const navigate = useNavigate(); 

    const validateEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateEmail(email)) {
            setAlert({ open: true, message: 'Please enter a valid email address.', severity: 'error' });
            return;
        }

        const result = await onForgotPassword(email);
        if (result.ok) {
            setAlert({ open: true, message: 'Password reset email sent!', severity: 'success' });
            // navigate('/login');
        } else {
            setAlert({ open: true, message: result.error || 'An error occurred', severity: 'error' });
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box component="form" onSubmit={handleSubmit}
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                <Typography component="h1">Reset Password</Typography>
                <TextField
                    label="Email Address"
                    type="email"
                    required
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit" fullWidth variant="contained">
                    Send Reset Link
                </Button>
                 {/* Link back to login page */}
                 <Button
                    fullWidth
                    variant="text"
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/login')} // Using navigate to redirect to login
                >
                    Back to Login
                </Button>
            </Box>
        </Container>
    );
}

export default ForgotPassword;