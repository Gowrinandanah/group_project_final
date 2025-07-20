import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home'); // go to homepage after splash
    }, 2500); // 2.5 seconds delay

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        //backgroundColor: '#FFFFFF',
      }}
    >
      <img src="/splash-logo.svg" alt="Splash Logo" width="160" />
      <Typography
        variant="h6"
        sx={{
          //color: '#000000',
          fontWeight: '500',
          animation: 'fadeText 2s ease-in-out infinite alternate',
        }}
      >
        Lighting up your learning...
      </Typography>

      <style>
        {`
          @keyframes fadeText {
            0% { opacity: 0.3; transform: translateY(2px); }
            100% { opacity: 1; transform: translateY(0px); }
          }
        `}
      </style>
    </Box>
  );
};

export default SplashScreen;
