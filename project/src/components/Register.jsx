import React, { useState } from 'react';
import {
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Checkbox,
  FormControlLabel,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/UserApi';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    contact: '',
    password: '',
    role: 'user',
    terms: false,
  });

  const [termsOpen, setTermsOpen] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.terms) {
      alert('Please accept the terms and conditions');
      return;
    }

    const { terms, ...formData } = form;

    try {
      console.log('Submitting registration:', formData);
      
      const res = await registerUser(formData);
      if (!res || !res.token) throw new Error('Token not received');
      localStorage.setItem('token', res.token);
      localStorage.setItem('role', res.role);
      navigate('/');
    } catch (err) {
      alert('Registration failed. Please try again.');
      console.error('❌ Registration error:', err);
    }
  };

  const handleOpenTerms = (e) => {
    e.preventDefault();
    setTermsOpen(true);
  };

  const handleCloseTerms = () => setTermsOpen(false);

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 6 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            name="name"
            fullWidth
            required
            value={form.name}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            required
            value={form.email}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            label="Contact Number"
            name="contact"
            fullWidth
            required
            value={form.contact}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            required
            value={form.password}
            onChange={handleChange}
            margin="normal"
          />

          <FormControlLabel
            control={
              <Checkbox
                name="terms"
                checked={form.terms}
                onChange={handleChange}
              />
            }
            label={
              <span>
                I agree to the{' '}
                <Link href="#" onClick={handleOpenTerms} underline="hover" color="primary">
                  terms and conditions
                </Link>
              </span>
            }
          />

          <Box mt={2}>
            <Button type="submit" variant="contained" fullWidth>
              Register
            </Button>
          </Box>
        </form>
      </Paper>

      {/* Terms & Conditions Dialog */}
      <Dialog open={termsOpen} onClose={handleCloseTerms} maxWidth="md" fullWidth scroll="paper">
        <DialogTitle>Terms and Conditions</DialogTitle>
        <DialogContent dividers sx={{ maxHeight: '70vh' }}>
          <Typography variant="body1" gutterBottom>
            Welcome to our platform. Please read these terms carefully before registering:
          </Typography>

          <ul>
            <li><strong>Respectful Conduct:</strong> All users are expected to treat others with respect. Harassment or abuse will result in account suspension.</li>
            <li><strong>No Unauthorized Sharing:</strong> Do not post copyrighted materials or distribute others' content without permission.</li>
            <li><strong>Account Responsibility:</strong> You are responsible for maintaining the confidentiality of your login credentials.</li>
            <li><strong>Platform Usage:</strong> The services provided are for educational and collaboration purposes. Misuse of resources may lead to suspension.</li>
            <li><strong>Changes to Terms:</strong> We may update these terms occasionally. Continued use of the platform implies acceptance of the changes.</li>
            <li><strong>Privacy:</strong> Your personal data will be stored securely and used only for platform-related notifications and features.</li>
            <li><strong>Admin Rights:</strong> Admins reserve the right to remove content or users that violate these terms.</li>
          </ul>

          <Typography variant="body2" color="textSecondary" mt={3}>
            By signing up, you agree to abide by the above terms and conditions. If you do not agree, please refrain from registering.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTerms} variant="outlined">Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Register;
