const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const { Group, User } = require('./model');
require('dotenv').config(); // 🔑 Required to load SMTP credentials

router.post('/notify-group/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId).populate('members');
    if (!group) return res.status(404).json({ message: 'Group not found' });

    const emails = group.members.map(member => member.email);
    if (!emails.length) return res.status(400).json({ message: 'No members with emails' });

    // ✅ Use environment variables for secure production emails
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,       // your email
        pass: process.env.SMTP_PASSWORD,    // app password
      },
    });

    const mailOptions = {
      from: `"BRAINHIVE🚀 " <${process.env.SMTP_EMAIL}>`,
      to: emails.join(','),
      subject: `Update from ${group.title}`,
      text: `Hello members, check for updates in your group "${group.title}".`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Message sent:', info.messageId);

    res.status(200).json({ message: 'Emails sent successfully' });
  } catch (err) {
    console.error('❌ Email error:', err);
    res.status(500).json({ message: 'Failed to send email' });
  }
});

module.exports = router;
