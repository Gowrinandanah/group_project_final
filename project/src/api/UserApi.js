import axios from './Axios';

const useDummy = false; // Toggle this to simulate API

// ✅ Auth Header with Bearer token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/* 1. Login */
export const loginUser = async (form) => {
  if (useDummy) {
    if (form.email === 'admin@gmail.com' && form.password === 'admin123') {
      localStorage.setItem('token', 'adminToken');
      localStorage.setItem('userId', 'dummyAdminId');
      return { token: 'adminToken', role: 'admin' };
    }
    localStorage.setItem('token', 'userToken');
    localStorage.setItem('userId', 'dummyUserId');
    return { token: 'userToken', role: 'user' };
  }

  try {
    const res = await axios.post('/login', form);
    localStorage.setItem('token', res.data.token); 
    localStorage.setItem('userId', res.data.user._id); // ✅ Store userId
    return res.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};


/* 2. Register */
export const registerUser = async (formData) => {
  if (useDummy) {
    console.log('Simulated registration:', formData);
    localStorage.setItem('token', 'dummyToken');
    localStorage.setItem('userId', 'dummyUserId');
    return { token: 'dummyToken', role: formData.role };
  }

  try {
    const res = await axios.post('/users/register', formData);
    localStorage.setItem('token', res.data.token); 
    localStorage.setItem('userId', res.data.user._id); // ✅ Store userId
    return res.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    throw error;
  }
};

/* 3. Get User Profile */
export const getUserProfile = async () => {
  try {
    const res = await axios.get('/user/profile', getAuthHeader());
    return res.data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};



/* 4. Update Profile Info */
export const updateUserInfo = async (formData) => {
  try {
    const res = await axios.put('/user/update-info', formData, getAuthHeader());
    return res.data;
  } catch (error) {
    console.error('Update user info error:', error);
    throw error;
  }
};

/* 5. Update Profile Picture */
export const updateProfilePic = async (base64Image) => {
  try {
    const res = await axios.put('/user/profile-pic', { image: base64Image }, getAuthHeader());
    return res.data;
  } catch (error) {
    console.error('Update profile pic error:', error);
    throw error;
  }
};

/* 6. Fetch All Users (Admin) */
export const fetchAllUsers = async () => {
  try {
    const res = await axios.get('/admin/users', getAuthHeader());
    return res.data;
  } catch (error) {
    console.error('Fetch users error:', error);
    throw error;
  }
};

/* 7. Suspend User (Admin) */
export const suspendUser = async (id) => {
  try {
    const res = await axios.put(`/admin/users/${id}/suspend`, {}, getAuthHeader());
    return res.data;
  } catch (error) {
    console.error('Suspend user error:', error);
    throw error;
  }
};



// Reinstate suspended user
export const reinstateUser = async (userId) => {
  const token = localStorage.getItem("token");
  const res = await axios.put(`http://localhost:5000/admin/users/${userId}/reinstate`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};



/*fetch user ny id*/
export const fetchUserById = async (userId, token) => {
  const response = await axios.get(`/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


