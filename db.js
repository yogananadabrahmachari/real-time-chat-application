// Load Mongoose and dotenv
const mongoose = require('mongoose');
require('dotenv').config();

// Get MongoDB URI from environment variables
const mongoURI = process.env.MONGO_URI;

// Check if the URI was loaded correctly
if (!mongoURI) {
  console.error("❌ MONGO_URI is undefined. Please check your .env file.");
  process.exit(1); // Stop the server if no URI is found
}

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Stop the server on connection error
  });

// Export the database connection
module.exports = mongoose.connection;
