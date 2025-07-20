import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Avatar,
  Tooltip,
  TextField,
  Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { getUserProfile, updateProfilePic, updateUserInfo } from '../api/UserApi';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useParams } from 'react-router-dom';

// Inside your component:


const UserProfilePage = () => {
  const [user, setUser] = useState({});
  const [groups, setGroups] = useState([]);
  const [messages, setMessages] = useState([]);
  const [previewUrl, setPreviewUrl] = useState('');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const theme = useTheme();
  const { id: userIdFromParams } = useParams();
  const userId = userIdFromParams || localStorage.getItem('userId');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setUser(data.user);
        setGroups(data.groups);
        setMessages(data.messages);
        setPreviewUrl(data.user?.profilePic || '');
        setFormData({
          name: data.user.name || '',
          email: data.user.email || '',
        });
      } catch (err) {
        console.error('Failed to load profile data', err);
      }
    };

    fetchProfile();
  }, []);

  // 📷 Profile picture upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result;
        await updateProfilePic(base64);
        alert('Profile picture updated successfully!');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed!');
    }
  };

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveInfo = async () => {
    try {
      await updateUserInfo(formData);
      setUser((prev) => ({ ...prev, ...formData }));
      setEditing(false);
      alert('Profile updated!');
    } catch (err) {
      console.error('Failed to update user info:', err);
      alert('Update failed!');
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>My Profile</Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={3}>
          <Box position="relative">
            <Avatar alt="Profile" src={previewUrl} sx={{ width: 80, height: 80 }} />
            <Tooltip title="Edit picture">
              <IconButton
                component="label"
                sx={{
                  position: 'absolute',
                  bottom: -8,
                  right: -8,
                  //backgroundColor: 'white',
                  boxShadow: 1,
                }}
              >
                <EditIcon fontSize="small" />
                <input hidden type="file" accept="image/*" onChange={handleFileChange} />
              </IconButton>
            </Tooltip>
          </Box>

          <Box flex={1}>
            {editing ? (
              <>
                <TextField
                  name="name"
                  label="Name"
                  value={formData.name}
                  onChange={handleFormChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  name="email"
                  label="Email"
                  value={formData.email}
                  onChange={handleFormChange}
                  fullWidth
                  margin="normal"
                />
                <Button onClick={handleSaveInfo} variant="contained" sx={{ mt: 1 }}>Save</Button>
                <Button onClick={handleEditToggle} sx={{ mt: 1, ml: 1 }}>Cancel</Button>
              </>
            ) : (
              <>
                <Typography variant="h6">Name: {user.name || '—'}</Typography>
                <Typography variant="h6">Email: {user.email || '—'}</Typography>
                <Button onClick={handleEditToggle} startIcon={<EditIcon />} sx={{ mt: 1 }}>
                  Edit Info
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
  <Typography variant="h5" gutterBottom>My Study Groups</Typography>
  <Box display="flex" flexDirection="column" gap={2}>
    {groups.map((group) => (
      <Button
        key={group._id}
        fullWidth
        variant="contained"
        sx={{
          color: theme.palette.secondary.contrastText,
        }}
        onClick={() => navigate(`/group/${group._id}`)}
      >
        {group.title}
      </Button>
    ))}
  </Box>
</Paper>




      {/*<Paper sx={{ p: 2 }}>
        <Typography variant="h5">My Messages</Typography>
        <List>
          {messages.map((msg) => (
            <ListItem key={msg._id}>
              <ListItemText primary={msg.content} />
            </ListItem>
          ))}
        </List>
      </Paper>*/}
    </Box>
  );
};

export default UserProfilePage;
