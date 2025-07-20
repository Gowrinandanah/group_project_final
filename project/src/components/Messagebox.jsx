import React, { useState } from 'react';
import {
  Typography,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Box,
  Button,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { deleteMessageFromGroup, editMessageInGroup } from '../api/GroupApi';

const MessageBox = ({ message, groupId, onAction }) => {
  const currentUserId = localStorage.getItem('userId');
  const isOwn = message.user === currentUserId || message.user?._id === currentUserId;
  const isAdmin = localStorage.getItem('role') === 'admin';

  const senderName =
    typeof message.user === 'object'
      ? message.user.name
      : message.user || 'Anonymous';

  const [anchorEl, setAnchorEl] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedText, setEditedText] = useState(message.text);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleDelete = async () => {
    try {
      await deleteMessageFromGroup(groupId, message._id);
      onAction(); // reload messages
    } catch (err) {
      console.error('❌ Delete failed:', err);
    }
    handleMenuClose();
  };

  const handleEditSubmit = async () => {
    try {
      await editMessageInGroup(groupId, message._id, editedText);
      setEditing(false);
      onAction(); // reload messages
    } catch (err) {
      console.error('❌ Edit failed:', err);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2, my: 1, position: 'relative' }}>
      <Box display="flex" justifyContent="space-between">
        <Box flex={1}>
          <Typography variant="subtitle2" color="primary">
            {senderName}:
          </Typography>

          {!editing ? (
            <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
              {message.text}
            </Typography>
          ) : (
            <Box mt={1}>
              <TextField
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                fullWidth
                size="small"
              />
              <Box mt={1} display="flex" gap={1}>
                <Button variant="contained" onClick={handleEditSubmit} size="small">
                  Save
                </Button>
                <Button variant="outlined" onClick={() => setEditing(false)} size="small">
                  Cancel
                </Button>
              </Box>
            </Box>
          )}
        </Box>

        {/* Three-dots menu */}
        <IconButton size="small" onClick={handleMenuOpen}>
          <MoreVertIcon />
        </IconButton>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          {(isOwn || isAdmin) ? (
            [
              <MenuItem key="edit" onClick={() => { setEditing(true); handleMenuClose(); }}>
                Edit
              </MenuItem>,
              <MenuItem key="delete" onClick={handleDelete}>
                Delete
              </MenuItem>
            ]
          ) : (
            [<MenuItem key="none" disabled>No actions available</MenuItem>]
          )}
        </Menu>
      </Box>
    </Paper>
  );
};

export default MessageBox;
