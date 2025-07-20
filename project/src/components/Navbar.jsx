import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Fade,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Avatar,
  Box,
  Tooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name") || "U";

  const isLoggedIn = !!token;

  const [anchorEl, setAnchorEl] = useState(null);
  const [aboutOpen, setAboutOpen] = useState(false);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleAboutOpen = () => {
    setAboutOpen(true);
    handleMenuClose();
  };
  const handleAboutClose = () => setAboutOpen(false);
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };
  const handleProfileClick = () => {
    navigate('/profile');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar position="static" color="primary" enableColorOnDark>
      <Toolbar sx={{ display: 'flex', alignItems: 'center' }}>
        {/* Logo + Title */}
        <Box
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <img
            src="/brainhive-logo.svg"
            alt="Brainhive Logo"
            width="44"
            style={{ marginRight: '14px' }}
          />
          <Typography
            variant="h4"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              fontFamily: '"Pacifico", cursive',
              outline: 'none'
            }}
          >
            brainhive
          </Typography>
        </Box>

        {/* Right Side */}
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <Button
              component={Link}
              to="/home"
              variant={isActive("/home") ? "contained" : "text"}
              //color="secondary"
            >
              Home
            </Button>

            {!isLoggedIn && (
              <>
                <Button
                  component={Link}
                  to="/login"
                  variant={isActive("/login") ? "contained" : "text"}
                  //color="secondary"
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant={isActive("/register") ? "contained" : "text"}
                  //color="secondary"
                >
                  Sign Up
                </Button>
              </>
            )}

            {isLoggedIn && role === "user" && (
              <>
                <Button
                  component={Link}
                  to="/create"
                  variant={isActive("/create") ? "contained" : "text"}
                  color="secondary"
                >
                  Create Group
                </Button>
                <Button onClick={handleLogout} color="secondary">
                  Logout
                </Button>
              </>
            )}

            {isLoggedIn && role === "admin" && (
              <>
                <Button
                  component={Link}
                  to="/admin"
                  variant={isActive("/admin") ? "contained" : "text"}
                  //color="secondary"
                >
                  Admin Dashboard
                </Button>
                <Button onClick={handleLogout} color="secondary">
                  Logout
                </Button>
              </>
            )}
          </Box>

          {/* Avatar + Menu */}
          {isLoggedIn && (
            <Tooltip title="View Profile">
              <IconButton onClick={handleProfileClick} sx={{ ml: 1 }}>
                <Avatar sx={{ bgcolor: '#a7fe96ff', color: '#000', fontWeight: 'bold' }}>
                  {name.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
          )}

          <IconButton
            edge="end"
            aria-label="menu"
            onClick={handleMenuOpen}
            sx={{
              transition: 'transform 0.3s ease',
              transform: anchorEl ? 'rotate(90deg)' : 'rotate(0deg)',
              ml: 1,
              color: 'inherit'
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        {/* Dropdown */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          TransitionComponent={Fade}
          transitionDuration={300}
        >
          <MenuItem>
            <Typography sx={{ flexGrow: 1 }}>Dark Mode</Typography>
            <Switch
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              color="secondary"
            />
          </MenuItem>
          <MenuItem onClick={handleAboutOpen}>About</MenuItem>
        </Menu>

        {/* About Dialog */}
        <Dialog open={aboutOpen} onClose={handleAboutClose}>
          <DialogTitle>About Brainhive</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Brainhive is your modern, elegant academic study group finder and collaboration platform.
              Designed for students and learners to connect, create, and grow together.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAboutClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
