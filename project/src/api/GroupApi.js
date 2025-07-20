import axios from './Axios';

// Toggle this flag to switch between dummy data and backend
const useDummy = false;

// Helper to get token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/* 1. Create Group */
export const createGroup = async (form, token) => {
  if (useDummy) {
    const existing = JSON.parse(localStorage.getItem('dummyGroups')) || [];
    const newGroup = {
      ...form,
      _id: new Date().getTime().toString(),
      status: 'pending',
    };
    existing.push(newGroup);
    localStorage.setItem('dummyGroups', JSON.stringify(existing));
    return { data: newGroup };
  } else {
    return await axios.post('/groups', form, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
};

/* 2. Fetch One Group by ID */
export const fetchGroupById = async (id) => {
  if (useDummy) {
    return {
      _id: id,
      title: 'React Learners',
      subject: 'Web Development',
      description: 'A group for React.js enthusiasts.',
      members: ['Alice', 'Bob'],
      messages: [{ text: 'Welcome!', user: 'Alice' }],
      materials: [{ title: 'Intro to React' }],
    };
  } else {
    const token = localStorage.getItem('token');
    const res = await axios.get(`/group/${id}`, {
      headers: token ? {
        Authorization: `Bearer ${token}`,
      } : {},
    });
    return res.data;
  }
};

/* 3. Fetch All Groups */
export const fetchAllGroups = async () => {
  const token = localStorage.getItem('token');

  const headers = token
    ? { Authorization: `Bearer ${token}` }
    : {}; // ✅ allow call without token

  const res = await axios.get('/groups', { headers });
  return res.data;
};

/* 4. Approve Group */
export const approveGroup = async (id) => {
  if (useDummy) {
    const groups = JSON.parse(localStorage.getItem('dummyGroups')) || [];
    const updatedGroups = groups.map((g) =>
      g._id === id ? { ...g, status: 'approved' } : g
    );
    localStorage.setItem('dummyGroups', JSON.stringify(updatedGroups));
    
    const approvedGroup = updatedGroups.find(g => g._id === id);
    return approvedGroup;
  } else {
    const res = await axios.put(`/groups/${id}/approve`, {}, getAuthHeader());
    return res.data.group; // ✅ Expecting backend to return { group }
  }
};


/* 5. Delete Group */
export const deleteGroup = async (id) => {
  if (useDummy) {
    const groups = JSON.parse(localStorage.getItem('dummyGroups')) || [];
    const updated = groups.filter((g) => g._id !== id);
    localStorage.setItem('dummyGroups', JSON.stringify(updated));
    return { data: true };
  } else {
    return await axios.delete(`/groups/${id}`, getAuthHeader());
  }
};

/* 6. Send Notification to Group Members */
export const sendNotification = async (groupId) => {
  try {
    const res = await axios.post(`/api/notify-group/${groupId}`, {}, getAuthHeader());
    return res.data;
  } catch (error) {
    console.error('Send notification error:', error);
    throw error;
  }
};

/* 7. Join Group (🔗 NEW) */
export const joinGroup = async (groupId) => {
  try {
    const res = await axios.post(`/groups/${groupId}/join`, {}, getAuthHeader());
    return res.data;
  } catch (err) {
    console.error('Failed to join group:', err);
    throw err;
  }
};


//import axios from './Axios'; // your Axios config
//leave group

export const leaveGroup = async (groupId) => {
  const token = localStorage.getItem('token');
  const res = await axios.post(`/groups/${groupId}/leave`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};


//post messages
// Add optional messageId for editing
export const postMessageToGroup = async (groupId, text, messageId = null) => {
  const token = localStorage.getItem('token');
  const payload = { text };
  if (messageId) payload.messageId = messageId; // 🔁 for editing

  const res = await axios.post(`/groups/${groupId}/message`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};



//DELETE MSG
export const deleteMessageFromGroup = async (groupId, messageId) => {
  const token = localStorage.getItem('token');
  const res = await axios.delete(
    `/groups/${groupId}/message/${messageId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};



//EDIT MSG
export const editMessageInGroup = async (groupId, messageId, newText) => {
  const token = localStorage.getItem('token');
  const res = await axios.put(
    `/groups/${groupId}/message/${messageId}`,
    { text: newText },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};



/*export const uploadMaterialToGroup = async (groupId, file) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await axios.post(
    `/materials/groups/${groupId}/upload`, // ✅ Corrected route
    formData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return res.data;
};*/



// Add this function
export const uploadMaterial = async (groupId, file, token) => {
  const formData = new FormData();
 
  formData.append('file', file); // ✅ must be 'file'

  const res = await axios.post(
    `http://localhost:5000/api/materials/${groupId}/materials`, // ✅ must match backend
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};




// ✅ Fetch materials for a group
export const fetchMaterialsForGroup = async (groupId) => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`/api/materials/${groupId}/materials`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};




/*notifications
export const sendNotification = async (groupId) => {
  const res = await axios.post('/api/notify', { groupId }, getAuthHeader());
  return res.data;
};*/

