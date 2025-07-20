import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const Header = () => {
  return (
    <Box
      sx={{
        //backgroundColor: '#f9f9f9',
        paddingY: { xs: 4, sm: 6 },
        textAlign: 'center',
        //borderBottom: '1px solid #e0e0e0',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        Your Partner in Smarter Learning
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: 'white',
          marginTop: 1,
          maxWidth: '600px',
          marginX: 'auto',
        }}
      >
        Discover, join, and build collaborative study groups across topics you love.
      </Typography>

      
    </Box>
  );
};

export default Header;
