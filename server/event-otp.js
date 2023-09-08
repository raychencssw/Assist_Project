const express = require("express");
const router = express.Router();
require("dotenv").config();
const nodemailer = require("nodemailer");
const emailApi = process.env.BREVO_EMAIL_API;

// Generate a random 4-digit number
function generateRandomOTP() {
  return Math.floor(1000 + Math.random() * 9000);
}

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: "jitbaner@usc.edu",
    pass: emailApi,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

router.get("/getOtp/:email", async (req, res) => {
  console.log("received otp request");
  const email = req.params.email;
  const OTP = generateRandomOTP();
  const mailOptions = {
    from: "no_reply@assistproject.org",
    to: email,
    subject: "Your One Time Password",
    text: `Your one time password is ${OTP}`,
  };
  try {
    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ message: "OTP sent successfully.", otp: OTP });
  } catch (error) {
    console.error("Error sending email: ", error);
    return res.status(500).json({
      error: "The server failed to send an OTP",
    });
  }
});
module.exports = router;
