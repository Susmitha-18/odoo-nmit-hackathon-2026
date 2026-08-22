const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: __dirname + '/../../.env' });

console.log('Testing connection to:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000
}).then(() => {
  console.log('SUCCESS: Connected to MongoDB Atlas Cloud!');
  process.exit(0);
}).catch((err) => {
  console.error('FAILED Connection Error:', err.message);
  process.exit(1);
});
