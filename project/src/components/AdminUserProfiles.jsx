import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserById } from '../api/UserApi';
import {
  Container,
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Button,
} from '@mui/material';

const AdminUserProfilePage = ({ onDelete }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = await fetchUserById(id, token);
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Typography variant="h6">User not found.</Typography>;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Button variant="contained" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        ← Back
      </Button>

      <Box display="flex" flexDirection="column" alignItems="center">
        <Avatar
          src={user.profilePic || ''}
          alt={user.name}
          sx={{ width: 100, height: 100, mb: 2 }}
        />
        <Typography variant="h5">{user.name}</Typography>
        <Typography variant="subtitle1">{user.email}</Typography>

        <Typography variant="body1" sx={{ mt: 4, fontWeight: 600 }}>
          Joined Groups:
        </Typography>
        <ul>
          {user.groupsJoined && user.groupsJoined.length > 0 ? (
            user.groupsJoined.map((group, index) => (
              <li key={index}>{group.title}</li>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No groups joined.
            </Typography>
          )}
        </ul>

        {/* 🔴 REMOVE button here 
        <Button
          variant="contained"
          color="error"
          sx={{ mt: 3 }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete && onDelete(user._id); 
          }}
        >
          REMOVE
        </Button>*/}
      </Box>
    </Container>
  );
};

export default AdminUserProfilePage;
