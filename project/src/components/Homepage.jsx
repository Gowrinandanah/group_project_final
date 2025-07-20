import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import GroupCard from '../components/Groupcard';
import Header from '../components/Header';
import { fetchAllGroups } from '../api/GroupApi';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

 useEffect(() => {
  const loadGroups = async () => {
    try {
      const allGroups = await fetchAllGroups();
      const approvedOnly = allGroups.filter(group => group.status === 'approved');
      setGroups(approvedOnly);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  loadGroups();
}, []);



  const filteredGroups = groups.filter(group =>
    group.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Header />
      <Box p={{ xs: 2, sm: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            //backgroundColor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(8px)',
            borderRadius: 2,
            //color: '#000'
          }}
        >
          <Typography variant="h4" gutterBottom>
            Explore Study Groups
          </Typography>

          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
            <TextField
              label="Search groups"
              variant="outlined"
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              variant="contained"
              //color="primary"
              onClick={() => navigate('/create')}
              sx={{ whiteSpace: 'nowrap' }}
            >
              Create Group
            </Button>
          </Box>
        </Paper>

        {filteredGroups.length === 0 ? (
          <Typography variant="body1">No groups found. Try creating one!</Typography>
        ) : (
          <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="flex-start"
            gap={3}
          >
            {filteredGroups.map(group => (
              <Box
                sx={{
                width: '100%',          
                mb: 2,                  
                 }}
                key={group._id}
                //flexBasis={{ xs: '100%', sm: '48%', md: '30%' }}
              >
                <GroupCard group={group} />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
};

export default HomePage;
