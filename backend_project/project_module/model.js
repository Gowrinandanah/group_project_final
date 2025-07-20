const mongoose = require('mongoose');

// ================================
// 📘 Group Schema
// ================================
const groupSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, default: 'pending' }, // 'pending', 'approved', 'rejected'
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [{
    text: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  materials: [
  {
    filename: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    uploadedAt: Date,
  },
],
}, { timestamps: true });

// ================================
// 📘 User Schema
// ================================
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contact: { type: String },
  password: { type: String, required: true },
  role: { type: String, default: 'user', enum: ['user', 'admin'] },
  status: { type: String, default: 'active', enum: ['active', 'suspended'] },
  groupsJoined: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
  profilePic: { type: String },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// ================================
// 📦 Models
// ================================
const Group = mongoose.model('Group', groupSchema, 'studygroupfinder_group');
const User = mongoose.model('User', userSchema, 'studygroupfinder_user');

module.exports = { Group, User };
