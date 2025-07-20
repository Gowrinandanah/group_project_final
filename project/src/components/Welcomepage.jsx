import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';


const WelcomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  // ✅ Skip Welcome if already visited
  

  const handleEnter = () => {
    localStorage.setItem('visitedWelcome', 'true');
    navigate('/home');
  };

  return (
    <Box
      sx={{
        backgroundColor: 'color: theme.palette.background.default ',
        color: 'white',
        minHeight: '100vh',
        py: 6,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        {/* Logo */}
        <img
          src="/brainhive-logo.svg"
          alt="BrainHive Logo"
          width="70"
          style={{ marginBottom: '1rem' }}
        />

        {/* Headline */}
        <Typography
          variant="h3"
          fontWeight={700}
          sx={{ mb: 2, fontFamily: 'Poppins, sans-serif' }}
        >
          Discover. Collaborate. Thrive.
        </Typography>
        <Typography variant="h6" color="#ccc" sx={{ mb: 4 }}>
          Connect with passionate learners and supercharge your academic journey.
        </Typography>

        {/* Illustration */}
        <img
          src="/illustration-study.svg"
          alt="Study Illustration"
          style={{
            maxWidth: '500px',
            width: '100%',
            marginBottom: '3rem',
            borderRadius: '10px',
          }}
        />

        {/* What is BrainHive */}
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          What is BrainHive?
        </Typography>
        <Typography
          variant="body1"
          //color="#ddd"
          sx={{ mb: 5, maxWidth: '750px', mx: 'auto' }}
        >
          BrainHive is an academic networking platform where students form or join study groups based on subjects, interests, and goals. It's built to make learning collaborative, effective, and engaging.
        </Typography>

        {/* Features */}
        <Grid container spacing={3} justifyContent="center" sx={{ mb: 5 }}>
          {[
            {
              icon: '📚',
              title: 'Create & Join Study Groups',
              desc: 'Instantly create or join subject-specific groups and collaborate with like-minded peers.',
            },
            {
              icon: '💬',
              title: 'Share Notes & Messages',
              desc: 'Post messages, share materials, and stay in sync with your study mates.',
            },
            {
              icon: '🔒',
              title: 'Safe and Verified',
              desc: 'Admin approval ensures quality groups and verified users to keep the community safe.',
            },
          ].map((feature, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Card
                sx={{
                  height: '100%',
                  p: 2,
                  //background: '#fff',
                  color: '#ffff',
                  borderRadius: '12px',
                  boxShadow: 3,
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'scale(1.03)' },
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" color="text.secondary" gutterBottom >
                    {feature.icon} {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* CTA */}
        <Button
          onClick={handleEnter}
          variant="contained"
          size="large"
          sx={{
            px: 5,
            py: 1.5,
            fontWeight: 'bold',
            fontSize: '1rem',
            background: theme.palette.primary.main,
            '&:hover': {
              background: theme.palette.primary.dark,
            },
          }}
        >
          GET STARTED
        </Button>
      </Container>
    </Box>
  );
};

export default WelcomePage;
