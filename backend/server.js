const app = require('./app');
const connectDB = require('./config/db');
const otpCleanupJob = require('./jobs/otpCleanup');

const PORT = parseInt(process.env.PORT) || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend Server running on port ${PORT}`);
    
    // Start OTP cleanup job
    otpCleanupJob.start();
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  otpCleanupJob.stop();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  otpCleanupJob.stop();
  process.exit(0);
});
