const otpRepository = require('../repositories/otp.repository');

class OTPCleanupJob {
  constructor() {
    this.intervalId = null;
  }

  start() {

    this.intervalId = setInterval(async () => {
      try {
        const result = await otpRepository.deleteExpired();
        if (result.deletedCount > 0) {
          console.log(`OTP Cleanup: Deleted ${result.deletedCount} expired OTP(s)`);
        }
      } catch (error) {
        console.error('OTP Cleanup Error:', error);
      }
    }, 5 * 60 * 1000);

    console.log('OTP Cleanup Job started - runs every 5 minutes');
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('OTP Cleanup Job stopped');
    }
  }
}

module.exports = new OTPCleanupJob();
