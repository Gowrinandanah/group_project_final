import React from 'react';
import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UserCard = ({ user, onDelete, onRetain, actionLabel = "Remove" }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/user/${user._id}`);
  };

  const handleButtonClick = (e) => {
    e.stopPropagation();
    if (user.status === 'suspended' && onRetain) {
      onRetain(user._id);
    } else if (onDelete) {
      onDelete(user._id);
    }
  };

  return (
    <Card
      elevation={6}
      onClick={handleCardClick}
      sx={{
        width: 500,
        height: 200,
        m: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 6,
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'scale(1.03)',
          boxShadow: 10,
        },
      }}
    >
      <CardContent sx={{ textAlign: 'center' }}>
        <Typography variant="h6" color="text.primary">{user.name}</Typography>
        <Typography color="text.secondary">Email: {user.email}</Typography>
      </CardContent>

      <CardActions>
        <Button
          variant="contained"
          color={user.status === 'suspended' ? 'success' : 'error'}
          onClick={handleButtonClick}
        >
          {actionLabel}
        </Button>
      </CardActions>
    </Card>
  );
};

export default UserCard;
