import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Navbar from './components/Navbar';
import Homepage from './components/Homepage';
import Login from './components/Login';
import Register from './components/Register';
import Groupdetails from './components/Groupdetails';
import Creategroup from './components/Creategroup';
import Userprofile from './components/Userprofile';
import Admin from './components/Admin';
import AdminUserProfilePage from './components/AdminUserProfiles';//adminuserprofiles
import RequireAuth from './components/RequireAuth'; // ✅ import
import './App.css';
import SplashScreen from './components/SplashScreen';
import WelcomePage from './components/Welcomepage';

const App = () => {
  const [darkMode, setDarkMode] = useState(true); // ✅ dark mode state

  const theme = useMemo(() => createTheme({
    palette: {
  mode: darkMode ? 'dark' : 'light',

  primary: {
    main: darkMode ? '#c792ea' : '#8b4db2ff',   // Light purple in dark, Deep purple in light
    contrastText: darkMode ? '#0e001a' : '#d1c9c9ff',
  },

  secondary: {
    main: darkMode ? '#ba68c8' : '#9575cd',   // Slightly different purple tone
    contrastText: darkMode ? '#000' : '#fff',
  },

  text: {
    primary: darkMode ? '#e3dee4ff' : '#0a0707ff',   // Light purple-ish white in dark, near-black in light
    secondary: darkMode ? '#ce93d8' : '#4a148c', // Faded purple in dark, bold purple in light
  },

  background: {
    default: darkMode ? '#271642ff' : '#7936a3ff',   // Dark purple-tinted background vs light lavender
    paper: darkMode ? '#452b61ff' : '#e4cdcdff',    // Card background
  },
},

    typography: {
      fontFamily: 'Roboto, sans-serif',
    },
  }), [darkMode]);

  return (
    <ThemeProvider theme={theme}> {/* ✅ apply theme */}
      <CssBaseline /> {/* ✅ normalize styling */}
      <Router>
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} /> {/* ✅ pass dark mode props */}
        <Routes>
          {/* ✅ Public routes */}
          <Route path="/" element={<WelcomePage />} />

          <Route path="/home" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 🔒 Protected routes */}
          <Route path="/group/:id" element={<RequireAuth><Groupdetails /></RequireAuth>} />
          <Route path="/create" element={<RequireAuth><Creategroup /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Userprofile /></RequireAuth>} />
          <Route path="/admin" element={<RequireAuth><Admin /></RequireAuth>} />
          <Route path="/user/:id" element={<RequireAuth><AdminUserProfilePage /></RequireAuth>} />

        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
