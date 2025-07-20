import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  fetchGroupById,
  joinGroup,
  leaveGroup,
  postMessageToGroup,
  deleteMessageFromGroup,
  editMessageInGroup,
  uploadMaterial, // ✅ NEW API IMPORT
} from '../api/GroupApi';
import MessageBox from './Messagebox';
import MaterialItem from './Materialitem';
import { TextField, Button, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';


const Groupdetails = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const currentUserId = localStorage.getItem('userId');
  const [newMaterial, setNewMaterial] = useState('');
  const [isMember, setIsMember] = useState(false);
  const userId = localStorage.getItem('userId'); // If not already fetched
  const theme = useTheme();

  useEffect(() => {
    loadGroup();
  }, [id]);

  useEffect(() => {
  if (group && group.members && userId) {
    const isMemberOfGroup = group.members.some((member) =>
      typeof member === 'string'
        ? member === userId
        : member._id?.toString() === userId
    );
    setIsMember(isMemberOfGroup);
  }
}, [group, userId]);


  const loadGroup = async () => {
    try {
      const data = await fetchGroupById(id);
      setGroup(data);
    } catch (err) {
      console.error('Failed to fetch group details', err);
      setError('Failed to load group.');
    }
  };

  const handleJoin = async () => {
    try {
      const response = await joinGroup(id);
      setStatusMessage(response.message || 'Joined successfully');
      await loadGroup();
    } catch (err) {
      console.error('❌ Failed to join group:', err);
      setStatusMessage(err?.response?.data?.error || 'Failed to join group');
    }
  };

  const handleLeave = async () => {
    try {
      const response = await leaveGroup(id);
      setStatusMessage(response.message || 'Left successfully');
      await loadGroup();
    } catch (err) {
      console.error('Failed to leave group:', err);
      setStatusMessage(err?.response?.data?.error || 'Failed to leave group');
    }
  };

  const handlePostMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await postMessageToGroup(id, newMessage);
      setNewMessage('');
      await loadGroup();
    } catch (err) {
      console.error('Failed to post message:', err);
      setStatusMessage('Error posting message');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessageFromGroup(id, messageId);
      await loadGroup();
    } catch (err) {
      console.error('Failed to delete message', err);
      setStatusMessage('Error deleting message');
    }
  };

  const handleEditMessage = async (messageId, updatedText) => {
    try {
      await editMessageInGroup(id, messageId, updatedText);
      await loadGroup();
    } catch (err) {
      console.error('Failed to edit message', err);
      setStatusMessage('Error editing message');
    }
  };

  const handleUploadMaterial = async (e) => {
  e.preventDefault();
  const file = e.target.elements.file.files[0]; // ✅ get file directly

  if (!file) return;

  try {
    const token = localStorage.getItem('token');
    await uploadMaterial(id, file, token); // ✅ pass just the File object and token
    setStatusMessage('File uploaded!');
    await loadGroup();
  } catch (err) {
    console.error('Upload error:', err);
    setStatusMessage('Failed to upload file.');
  }
};



  
  if (error) return <div style={styles.error}>{error}</div>;
  if (!group) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{group.title}</h2>
        <p><strong>Subject:</strong> {group.subject}</p>
        <p><strong>Description:</strong> {group.description}</p>

        <div style={{ marginTop: '1rem' }}>
          <button style={styles.joinBtn} onClick={handleJoin}>
            Join Group
          </button>
          <button
            style={{
              ...styles.leaveBtn,
              opacity: isMember ? 1 : 0.5,
              cursor: isMember ? 'pointer' : 'not-allowed'
            }}
            onClick={handleLeave}
            disabled={!isMember}
          >
            Leave Group
          </button>
        </div>

        {statusMessage && <p style={styles.success}>{statusMessage}</p>}
      </div>

      <div style={styles.section}>
        <h3 style={styles.heading}>👥 Members</h3>
        <ul style={styles.list}>
          {group.members?.length > 0 ? (
            group.members.map((member, idx) => (
              <li key={idx} style={styles.listItem}>
                {typeof member === 'string' ? member : member?.name || 'Member'}
              </li>
            ))
          ) : (
            <li style={styles.listItem}>No members</li>
          )}
        </ul>
      </div>

      <div style={styles.section}>
        <h3 style={styles.heading}>💬 Messages</h3>
        {group.messages?.length > 0 ? (
          group.messages.map((msg) => (
            <div key={msg._id} style={styles.messageBox}>
              <MessageBox message={msg} groupId={id} onAction={loadGroup} />
            </div>
          ))
        ) : (
          <p>No messages</p>
        )}

        {isMember && (
          <div style={{ marginTop: '1rem' }}>
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              style={{
                padding: '10px',
                width: '80%',
                marginRight: '10px',
                borderRadius: '8px',
                border: '1px solid #ccc',
              }}
            />
            <button
              onClick={handlePostMessage}
              style={{
                padding: '10px 16px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Send
            </button>
          </div>
        )}
      </div>

        <div style={styles.section}>
        <h3 style={styles.heading}>📚 Materials</h3>

        <MaterialItem groupId={id} token={localStorage.getItem('token')} />
        {isMember && (
    <form onSubmit={handleUploadMaterial} style={{ marginTop: '1rem' }}>
      <input type="file" name="file" required />
      <button
        type="submit"
        style={{
          padding: '10px 16px',
          marginLeft: '10px',
          backgroundColor: '#2a7a2f',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        Upload Material
      </button>
    </form>
  )}
        </div>

    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'sans-serif',
    borderRadius: '12px',
    maxWidth: '900px',
    margin: 'auto',
    
  },
  card: {
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 0 12px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
    backgroundColor:'color: theme.palette.background.paper',
    
  },
  title: {
    marginBottom: '0.5rem',
  },
  joinBtn: {
    marginRight: '10px',
    padding: '10px 16px',
    fontSize: '1rem',
    backgroundColor: '#68209cff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  leaveBtn: {
    padding: '10px 16px',
    fontSize: '1rem',
    backgroundColor: '#a2293bff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  success: {
    marginTop: '10px',
  },
  section: {
    padding: '1rem 1.5rem',
    borderRadius: '10px',
    boxShadow: '0 0 8px rgba(0,0,0,0.06)',
    marginBottom: '1.5rem',
  },
  heading: {
    marginBottom: '1rem',
  },
  list: {
    listStyle: 'none',
    paddingLeft: 0,
  },
  listItem: {
    padding: '6px 0',
    borderBottom: '1px solid #eee',
  },
  materialBox: {
    marginBottom: '1rem',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    paddingTop: '2rem',
  },
  loading: {
    textAlign: 'center',
    paddingTop: '2rem',
    fontSize: '1.2rem',
  },
};

export default Groupdetails;
