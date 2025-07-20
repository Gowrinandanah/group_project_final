import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, TextField, Grid, Paper, Divider,
  List, ListItem, ListItemText, Toolbar, AppBar, IconButton, Tabs, Tab
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import {
  fetchAllGroups, approveGroup, deleteGroup, sendNotification
} from '../api/GroupApi';
import {
  fetchAllUsers, suspendUser, reinstateUser
} from '../api/UserApi';
import UserCard from './Usercard';

const Admin = () => {
  const [groups, setGroups] = useState([]);
  const [pendingGroups, setPendingGroups] = useState([]);
  const [approvedGroups, setApprovedGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [approvedGroupSearch, setApprovedGroupSearch] = useState('');
  const [activeTab, setActiveTab] = useState('groups');
  const [groupTab, setGroupTab] = useState(0);
  const [userTab, setUserTab] = useState(0);
  const [alert, setAlert] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'admin') {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      try {
        const allGroups = await fetchAllGroups();
        setGroups(allGroups);
        setPendingGroups(allGroups.filter(g => g.status !== 'approved'));
        setApprovedGroups(allGroups.filter(g => g.status === 'approved'));

        const userData = await fetchAllUsers();
        setUsers(userData);
      } catch (err) {
        console.error('Error loading data', err);
      }
    };

    loadData();
  }, [navigate]);

  const handleApprove = async (id) => {
    const approvedGroup = await approveGroup(id);
    const updatedGroups = groups.map(g => g._id === id ? approvedGroup : g);
    setGroups(updatedGroups);
    setPendingGroups(updatedGroups.filter(g => g.status !== 'approved'));
    setApprovedGroups(updatedGroups.filter(g => g.status === 'approved'));
  };

  const handleDelete = async (id) => {
    await deleteGroup(id);
    const updatedGroups = groups.filter(g => g._id !== id);
    setGroups(updatedGroups);
    setPendingGroups(updatedGroups.filter(g => g.status !== 'approved'));
    setApprovedGroups(updatedGroups.filter(g => g.status === 'approved'));
  };

  const handleNotify = async (groupId) => {
    try {
      await sendNotification(groupId);
      alert('Notification email sent!');
    } catch (err) {
      console.error(err);
      alert('Failed to send email.');
    }
  };

  const handleUserSuspend = async (id) => {
    try {
      await suspendUser(id);
      setUsers(users.map(u => u._id === id ? { ...u, status: 'suspended' } : u));
    } catch (err) {
      console.error('Suspend user error:', err);
      alert('Failed to remove user.');
    }
  };

  const handleReinstate = async (userId) => {
    try {
      await reinstateUser(userId);
      setUsers(prev =>
        prev.map(user =>
          user._id === userId ? { ...user, status: 'active' } : user
        )
      );
      setAlert({ type: 'success', message: 'User reinstated successfully' });
    } catch (err) {
      console.error('Error reinstating user:', err);
      setAlert({ type: 'error', message: 'Error reinstating user' });
    }
  };

  const activeUsers = users.filter(u => u.status !== 'suspended');
  const suspendedUsers = users.filter(u => u.status === 'suspended');

  return (
    <Box display="flex" sx={{ height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <Box sx={{ width: '240px', minWidth: '240px', p: 3, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h5" gutterBottom fontWeight={700}>Dashboard</Typography>
        <Divider sx={{ my: 4 }} />
        <Button fullWidth variant={activeTab === 'groups' ? 'contained' : 'text'} onClick={() => setActiveTab('groups')} sx={{ justifyContent: 'flex-start' }}>Groups</Button>
        <Button fullWidth variant={activeTab === 'users' ? 'contained' : 'text'} onClick={() => setActiveTab('users')} sx={{ justifyContent: 'flex-start' }}>Users</Button>
      </Box>

      {/* Main Content */}
      <Box flex={1} p={4} sx={{ overflowY: 'auto' }}>
        <AppBar position="static" sx={{ boxShadow: 'none', borderBottom: '1px solid #73667bff' }}>
          <Toolbar>
            <IconButton edge="start" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' }}>Dashboard</Typography>
          </Toolbar>
        </AppBar>

        {/* Stats Row */}
        <Grid container spacing={3} my={3}>
          <Grid item xs={12} sm={4}><Paper sx={{ p: 2, textAlign: 'center' }}><Typography variant="h6">New Users</Typography><Typography variant="h5" fontWeight={600}>{activeUsers.length}</Typography></Paper></Grid>
          <Grid item xs={12} sm={4}><Paper sx={{ p: 2, textAlign: 'center' }}><Typography variant="h6">Approved Groups</Typography><Typography variant="h5" fontWeight={600}>{approvedGroups.length}</Typography></Paper></Grid>
          <Grid item xs={12} sm={4}><Paper sx={{ p: 2, textAlign: 'center' }}><Typography variant="h6">Pending Groups</Typography><Typography variant="h5" fontWeight={600}>{pendingGroups.length}</Typography></Paper></Grid>
        </Grid>

        {/* GROUPS */}
        {activeTab === 'groups' && (
          <Paper sx={{ p: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={groupTab}
                onChange={(e, newValue) => setGroupTab(newValue)}
                textColor="secondary"
                indicatorColor="secondary"
                sx={{ mb: 3 }}
              >
                <Tab label="Approved Groups" />
                <Tab label="Pending Groups" />
              </Tabs>
            </Box>

            {groupTab === 0 && (
              <>
                <TextField
                  label="Search Approved Groups"
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ mb: 3 }}
                  value={approvedGroupSearch}
                  onChange={(e) => setApprovedGroupSearch(e.target.value)}
                />
                <List>
                  {approvedGroups
                    .filter(group =>
                      group.title.toLowerCase().includes(approvedGroupSearch.toLowerCase())
                    )
                    .map(group => (
                      <ListItem key={group._id} divider>
                        <ListItemText
                          primary={<Typography fontWeight={600}>{group.title}</Typography>}
                          secondary={
                            <>
                              <Typography variant="body2">{group.subject} — {group.description}</Typography>
                              <Typography variant="body2">Requested by: {group.createdBy?.name || 'Unknown'} ({group.createdBy?.email || 'N/A'})</Typography>
                            </>
                          }
                        />
                        <Button onClick={() => handleNotify(group._id)} variant="contained" color="info">Notify</Button>
                        <Button onClick={() => handleDelete(group._id)} variant="contained" color="error" sx={{ ml: 1 }}>Delete</Button>
                      </ListItem>
                    ))}
                </List>
              </>
            )}

            {groupTab === 1 && (
              <List>
                {pendingGroups.map(group => (
                  <ListItem key={group._id} divider>
                    <ListItemText
                      primary={<Typography fontWeight={600}>{group.title}</Typography>}
                      secondary={
                        <>
                          <Typography variant="body2">{group.subject} — {group.description}</Typography>
                          <Typography variant="body2">Requested by: {group.createdBy?.name || 'Unknown'} ({group.createdBy?.email || 'N/A'})</Typography>
                        </>
                      }
                    />
                    <Button onClick={() => handleApprove(group._id)} variant="contained" color="success">Approve</Button>
                    <Button onClick={() => handleDelete(group._id)} variant="contained" color="error" sx={{ ml: 1 }}>Delete</Button>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        )}

        {/* USERS */}
        {activeTab === 'users' && (
          <Paper sx={{ p: 3 }}>
            <Tabs value={userTab} onChange={(e, newValue) => setUserTab(newValue)} sx={{ mb: 3 }}>
              <Tab label="Current Users" />
              <Tab label="Suspended Users" />
            </Tabs>

            {alert && (
              <Typography sx={{ color: alert.type === 'error' ? 'red' : 'green', mb: 2 }}>
                {alert.message}
              </Typography>
            )}

            {userTab === 0 && (
              <>
                <TextField
                  label="Search Users"
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ mb: 3 }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Grid container spacing={2}>
                  {activeUsers.filter(user => user.name.toLowerCase().includes(search.toLowerCase()))
                    .map(user => (
                      <Grid item xs={12} sm={6} md={4} key={user._id}>
                        <UserCard user={user} onDelete={handleUserSuspend} />
                      </Grid>
                    ))}
                </Grid>
              </>
            )}

            {userTab === 1 && (
              <Grid container spacing={2}>
                {suspendedUsers.map(user => (
                  <Grid item xs={12} sm={6} md={4} key={user._id}>
                    <UserCard
                      user={user}
                      onRetain={handleReinstate}
                      actionLabel="Reinstate"
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default Admin;
