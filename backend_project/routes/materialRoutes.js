const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFSBucket } = require('mongodb');
const { Group } = require('../project_module/model');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// ✅ Upload material to group (Node.js v22 safe)
router.post('/:id/materials', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ error: 'Group not found' });
     console.log('📥 Upload endpoint hit');
    console.log('Group ID:', req.params.id);    console.log('User ID:', req.user.id);
    console.log('Received file:', req.file);  // ❗️this will confirm if multer received the file

    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const userId = req.user.id;
    const isMember = group.members.some(m => m.toString() === userId);
    if (!isMember) return res.status(403).json({ error: 'Only members can upload materials' });

    const bucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      metadata: {
        uploadedBy: userId,
        groupId: req.params.id,
      },
      contentType: req.file.mimetype,
    });

    uploadStream.end(req.file.buffer);

    uploadStream.on('finish', async () => {
      // ✅ Manually query file after upload
      const savedFile = await mongoose.connection.db
        .collection('uploads.files')
        .find({ filename: req.file.originalname })
        .sort({ uploadDate: -1 })
        .limit(1)
        .toArray()
        .then(arr => arr[0]);

      if (!savedFile || !savedFile._id) {
        return res.status(500).json({ error: 'Uploaded file not found in DB' });
      }

      const material = {
        filename: savedFile.filename,
        fileId: savedFile._id,
        uploadedBy: userId,
        uploadedAt: new Date(),
      };

      group.materials.push(material);
      await group.save();

      res.status(200).json({ message: 'File uploaded', material });
    });

    uploadStream.on('error', (err) => {
      console.error('Upload error:', err);
      res.status(500).json({ error: 'Upload failed' });
    });
  } catch (err) {
    console.error('❌ Upload exception:', err.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// ✅ Serve file for inline preview (NOT forced download)
router.get('/file/:filename', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'uploads' });

    const files = await db.collection('uploads.files')
      .find({ filename: req.params.filename })
      .sort({ uploadDate: -1 })
      .toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    const file = files[0]; // latest match
    res.set({
      'Content-Type': file.contentType || 'application/octet-stream',
      'Content-Disposition': 'inline',
    });

    const downloadStream = bucket.openDownloadStreamByName(file.filename);
    downloadStream.pipe(res);
  } catch (err) {
    console.error('❌ Error serving file:', err.message);
    res.status(500).json({ error: 'Failed to serve file' });
  }
});

// ✅ Get all materials for a group
router.get('/:id/materials', authMiddleware, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate('materials.uploadedBy', 'name email');
    if (!group) return res.status(404).json({ error: 'Group not found' });

    const userId = req.user.id;
    const isMember = group.members.some(m => m.toString() === userId);
    if (!isMember) {
      return res.status(403).json({ error: 'Only members can view materials' });
    }

    res.json(group.materials);
  } catch (err) {
    console.error('❌ Fetch materials error:', err.message);
    res.status(500).json({ error: 'Failed to fetch materials' });
  }
});

module.exports = router;
