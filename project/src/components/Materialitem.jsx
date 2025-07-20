import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import { fetchMaterialsForGroup } from '../api/GroupApi';

const MaterialItem = ({ groupId, token }) => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const data = await fetchMaterialsForGroup(groupId, token);
      setMaterials(data || []);
    } catch (err) {
      console.error('Failed to fetch materials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (groupId && token) loadMaterials();
  }, [groupId, token]);

  return (
    <Box mt={4}>
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6">Uploaded Materials</Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {materials.length === 0 && (
            <Typography variant="body2" color="white">
              No materials uploaded yet.
            </Typography>
          )}
          {materials.map((material, index) => (
            <ListItem
              key={index}
              component="a"
              href={
                material.filename
                  ? `http://localhost:5000/api/materials/file/${material.filename}`
                  : '#'
              }
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                 backgroundColor: '#c2b5c9ff',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
                cursor: material.filename ? 'pointer' : 'default',
              }}
            >
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText
                primary={material.filename || 'Unnamed File'}
                secondary={material.uploadedAt ? new Date(material.uploadedAt).toLocaleString() : ''}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default MaterialItem;
