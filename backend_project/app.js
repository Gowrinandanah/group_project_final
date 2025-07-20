const express = require('express');
const cors = require('cors');
const { connectDB, getGFS } = require('./connection');
const { Group, User } = require('./project_module/model');
const notifyRoutes = require('./project_module/notify');
const authMiddleware = require('./middleware/auth');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const path = require('path');
const materialRoutes = require('./routes/materialRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Auth & profile routes
app.use('/', authRoutes);

// Notification routes
app.use('/api', notifyRoutes);

//files
app.use('/api/materials', materialRoutes);


// ===============================
// GROUP ROUTES
// ===============================



// ✅ PUT: Approve group by ID
app.put('/groups/:id/approve', authMiddleware, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    group.status = 'approved';
    await group.save();

    res.status(200).json({ message: 'Group approved', group });
  } catch (err) {
    console.error('Error approving group:', err);
    res.status(500).json({ error: 'Failed to approve group' });
  }
});




// GET: All groups (public)
app.get('/groups', async (req, res) => {
  try {
    const groups = await Group.find()
      .populate('createdBy', 'name email')     // ✅ show who created it
      .populate('members', 'name email');
    res.json(groups);
  } catch (err) {
    console.error('🔥 Error fetching groups:', err);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

// GET: Single group by ID
app.get('/group/:id', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('members', 'name email')
      .populate('createdBy', 'name email')
      .populate('messages.user', 'name email');

    if (!group) return res.status(404).json({ error: 'Group not found' });
    res.json(group);
  } catch (err) {
    console.error('Error fetching group by ID:', err);
    res.status(500).json({ error: 'Failed to fetch group by ID' });
  }
});

// POST: Create group (protected)
app.post('/groups', authMiddleware, async (req, res) => {
  try {
    const newGroup = new Group({
      ...req.body,
      createdBy: req.user.id,    // ✅ Set creator
      members: [req.user.id],    // Auto-join creator as first member
    });

    await newGroup.save();

    // Also add group to user's `groupsJoined`
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { groupsJoined: newGroup._id },
    });

    res.status(201).json(newGroup);
  } catch (err) {
    console.error('Group creation error:', err);
    res.status(400).json({ error: 'Failed to create group', details: err.message });
  }
});

// POST: Join group (protected)
app.post('/groups/:id/join', authMiddleware, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      console.error('❌ Group not found');
      return res.status(404).json({ error: 'Group not found' });
    }

    const userId = req.user.id;
    if (!userId) {
      console.error('❌ Missing user ID in request');
      return res.status(401).json({ error: 'User ID missing in token' });
    }

    // ✅ If already a member, skip adding again
    if (group.members.includes(userId)) {
      console.log('ℹ️ User already a member of the group');
      const updatedGroup = await Group.findById(group._id).populate('members', 'name email');
      return res.status(200).json({ message: 'Already a member', group: updatedGroup });
    }

    // ✅ Add user to group and update user profile
    group.members.push(userId);
    await group.save();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { groupsJoined: group._id } },
      { new: true }
    );

    if (!updatedUser) {
      console.error('❌ Failed to update user');
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedGroup = await Group.findById(group._id).populate('members', 'name email');
    res.status(200).json({ message: 'Joined successfully', group: updatedGroup });

  } catch (err) {
    console.error('🔥 Join group error:', err.message);
    res.status(500).json({ error: 'Failed to join group', details: err.message });
  }
});


// DELETE: Delete group (protected)
app.delete('/groups/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Group.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Group not found' });
    res.json({ message: 'Group deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete group' });
  }
});

// ===============================
// ADMIN ROUTES
// ===============================

// GET: All users (admin only)
app.get('/admin/users', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET: Debug users
app.get('/debug-users', authMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// ===============================
// Health check
// ===============================


// ✅ PUT: Suspend user by ID (admin only)
app.put('/admin/users/:id/suspend', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'suspended' },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User suspended successfully', user });
  } catch (err) {
    console.error('Suspend user error:', err);
    res.status(500).json({ error: 'Failed to suspend user' });
  }
});



// ✅ POST: Leave group (protected)
app.post('/groups/:id/leave', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const group = await Group.findById(req.params.id);
  group.members = group.members.filter(id => id.toString() !== userId);
  await group.save();
  await User.findByIdAndUpdate(userId, { $pull: { groupsJoined: group._id } });
  res.json({ message: 'Left group successfully' });
});

//post messages
app.post('/groups/:id/message', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const userId = req.user.id;

  try {
    if (!text || text.trim() === "") {
      return res.status(400).json({ error: "Message text is required." });
    }

    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    if (!group.members.includes(userId)) {
      return res.status(403).json({ error: "Only members can post messages." });
    }

    const newMessage = { user: userId, text, timestamp: new Date() };
    group.messages.push(newMessage);
    await group.save();

    res.json({ message: "Message posted successfully." });
  } catch (error) {
    console.error("Error posting message:", error);
    res.status(500).json({ error: "Server error." });
  }
});




// DELETE message from group
app.delete('/groups/:groupId/message/:messageId', authMiddleware, async (req, res) => {
  const { groupId, messageId } = req.params;
  const userId = req.user.id;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    const messageIndex = group.messages.findIndex(
      (msg) => msg._id.toString() === messageId
    );

    if (messageIndex === -1) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const message = group.messages[messageIndex];

    // Only the message owner or an admin can delete
    if (
      message.user.toString() !== userId &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ error: 'Not authorized to delete this message' });
    }

    // Remove the message manually
    group.messages.splice(messageIndex, 1);
    await group.save();

    res.json({ success: true, message: 'Message deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});




//toget updated vers after delete
app.put('/groups/:groupId/message/:messageId', authMiddleware, async (req, res) => {
  try {
    const { groupId, messageId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    const message = group.messages.id(messageId);
    if (!message) return res.status(404).json({ error: 'Message not found' });

    const isOwnMessage = message.user?.toString() === userId;
    const isAdmin = req.user.role === 'admin';

    if (!isOwnMessage && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized to edit this message' });
    }

    message.text = text;
    await group.save();

    res.json({ success: true, message: 'Message updated' });
  } catch (err) {
    console.error('Edit message error:', err);
    res.status(500).json({ error: 'Server error while editing message' });
  }
});


//files upload
app.get('/materials/file/:filename', async (req, res) => {
  try {
    const file = await gfs.files.findOne({ filename: req.params.filename });
    if (!file) return res.status(404).json({ error: 'File not found' });

    const readStream = gfs.createReadStream(file.filename);
    readStream.pipe(res);
  } catch (err) {
    console.error('File fetch error:', err);
    res.status(500).json({ error: 'Error fetching file' });
  }
});


// ✅ GET materials for a specific group
app.get('/groups/:id/materials', authMiddleware, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.status(200).json(group.materials || []);
  } catch (err) {
    console.error('Error fetching materials:', err);
    res.status(500).json({ message: 'Failed to fetch materials' });
  }
});


// Backend: GET /user/:id
app.get("/admin/users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find()
      .populate('groupsJoined', 'title'); // ✅ This adds group titles

    res.json(users);
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// Get a specific user by ID (for user profile)
app.get("/user/:id", authMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("Fetching user:", userId);

    const user = await User.findById(userId)
      .populate('groupsJoined', 'title'); // populates group titles

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("User fetch error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// Reinstate a suspended user
app.put('/admin/users/:id/reinstate', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: 'active' }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User reinstated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});





app.get('/', (req, res) => {
  res.send('✅ Study Group Finder API is running');
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
