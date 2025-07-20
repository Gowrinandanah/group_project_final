import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
  Snackbar,
  Alert,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { joinGroup } from '../api/GroupApi';

const GroupCard = ({ group }) => {
  const navigate = useNavigate();
  const [feedback, setFeedback] = React.useState({ open: false, message: '', severity: 'info' });

  const handleJoinGroup = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const res = await joinGroup(group._id);
      setFeedback({ open: true, message: res.message || 'Joined group!', severity: 'success' });
    } catch (err) {
      console.error('Join failed:', err);
      const msg = err.response?.data?.message || 'Failed to join group';
      setFeedback({ open: true, message: msg, severity: 'error' });
    }
  };

  return (
    <>
      <Card
       sx={{
       width: '100%',
      margin: 2,
      boxShadow: 3,
       backdropFilter: 'blur(8px)',
       borderRadius: 2,
      color: '#000',
       }}
      >
        <CardContent>
          <Typography variant="h6" component="div">
            {group.title}
          </Typography>
          <Typography sx={{ mb: 1 }} >
            Subject: {group.subject}
          </Typography>
          <Typography variant="body2" >
            {group.description?.slice(0, 100)}...
          </Typography>
        </CardContent>

        <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
           component={Link}
           to={`/group/${group._id}`}
           variant="contained"
          //color="primary"
          >
          View Details
          </Button>

          <Button variant="contained" color="secondary" onClick={handleJoinGroup}>
            Join Group
          </Button>
        </CardActions>
      </Card>

      {/* Feedback snackbar */}
      <Snackbar
        open={feedback.open}
        autoHideDuration={3000}
        onClose={() => setFeedback({ ...feedback, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setFeedback({ ...feedback, open: false })}
          severity={feedback.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {feedback.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default GroupCard;
