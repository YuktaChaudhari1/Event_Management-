const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const otp = require("../models/OTP");
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  family: 4,
});

// verify transporter at startup
transporter
  .verify()
  .then(() => console.log("Mailer ready: transporter verified"))
  .catch((err) => console.error("Mailer verify failed:", err));

const sendBookingEmail = async (userEmail, userName, eventTitle) => {
  try {
    console.log("Sending OTP email to:", userEmail);
    console.log("sendBookingEmail called");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Booking Confirmed: ${eventTitle}`,
      html: `
            <h2>Hi ${userName}!</h2>
            <p>YOur booking for the event <strong>${eventTitle}</strong>is successfully confirmed</p>
            <p>Thank you for choosing Eventora.</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to`, userEmail);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

const sendOTPEmail = async (userEmail, otp, type) => {
  try {
    const title =
      type === "account_verification"
        ? "verify your Eventora Account "
        : "Eventora Booking verification";

    const msg =
      type === "account_verification"
        ? "Please use the following OTP to verify your new Eventora account."
        : "Please use the following OTP to verify and confirm your event booking.";

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: title,
      html: `
                 <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                    <h2 style="color: #111;">${title}</h2>
                    <p style="color: #555; font-size: 16px;">${msg}</p>
                    <div style="margin: 20px auto; padding: 15px; font-size: 24px; font-weight: bold; background: #f4f4f4; width: max-content; letter-spacing: 5px;">
                        ${otp}
                    </div>
                    <p style="color: #999; font-size: 12px;">This code expires in 5 minutes. If you didn't request this, please ignore this email.</p>
                </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${userEmail} for ${type}`);
  } catch (error) {
    console.error("Error sending OTP  email ", error);
  }
};
module.exports = { sendBookingEmail, sendOTPEmail };
