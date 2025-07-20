import React, { useState } from 'react';
import {
  Button,
  TextField,
  Typography,
  Container,
  Box,
  Paper,
  Alert,
  Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/UserApi';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await loginUser(form);

      const token = res.token || 'fakeTokenForNow';

      if (res?.token && res?.role) {
        localStorage.setItem('token', token);
        localStorage.setItem('role', res.role);
        navigate(res.role === 'admin' ? '/admin' : '/home');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Typography variant="h5" gutterBottom align="center">
          Login
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <Box mt={2}>
            <Button type="submit" variant="contained" fullWidth>
              Login
            </Button>
          </Box>
        </form>

        {/* Signup Link */}
        <Box mt={3} textAlign="center">
          <Typography variant="body2">
            Don't have an account?{' '}
            <Link href="/register" color="primary" underline="hover">
              Sign up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
