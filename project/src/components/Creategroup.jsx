import React, { useState } from 'react';
import {
  Container, Typography, TextField, Button, Box, Paper, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createGroup } from '../api/GroupApi';

const CreateGroupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    subject: '',
    description: ''
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      setError('You must be logged in to create a group.');
      
      return;
    }

    try {
      await createGroup(form, token);
      setSuccess(true);
      setError('');
      setForm({ title: '', subject: '', description: '' });
      setTimeout(() => navigate('/home'), 1500);
    } catch {
      setError('Failed to create group. Try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Create New Study Group
        </Typography>

        {success && <Alert severity="success">Group submitted for approval!</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Group Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            aria-label="Group Title"
          />
          <TextField
            label="Subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            aria-label="Group Subject"
          />
          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            required
            multiline
            rows={4}
            margin="normal"
            aria-label="Group Description"
          />
          <Box mt={2}>
            <Button type="submit" variant="contained" fullWidth>
              Submit for Approval
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateGroupPage;
