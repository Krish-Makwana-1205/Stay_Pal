const cron = require("node-cron");
const OTP = require("../model/otp");

cron.schedule("0 0 * * *", async () => {
  try {
    console.log("Running daily OTP cleanup...");

    const result = await OTP.deleteMany({
      createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } // older than 1 day
    });

    console.log("Deleted old OTPs:", result.deletedCount);
  } catch (error) {
    console.log("Error while deleting OTPs:", error);
  }
});
