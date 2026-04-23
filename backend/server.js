const app = require('./app');
const connectDB = require('./config/db');

const PORT = parseInt(process.env.PORT) || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend Server running on port ${PORT}`);
  });
});
