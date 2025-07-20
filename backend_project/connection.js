const mongoose = require('mongoose');
const Grid = require('gridfs-stream'); // ✅ Required for GridFS

let gfs; // Exportable GridFS instance

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log('✅ MongoDB Connected');

    // Init gfs after connection is open
    gfs = Grid(conn.connection.db, mongoose.mongo);
    gfs.collection('uploads'); // Bucket name

  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const getGFS = () => gfs; // Helper function to access GridFS from other files

module.exports = { connectDB, getGFS };
