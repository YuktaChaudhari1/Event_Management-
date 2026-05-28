const userModel = require("../models/User");
const { sendOTPEmail } = require("../utils/email");
const OTP = require("../models/OTP");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

//Register User
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  let userExist = await userModel.findOne({ email });

  if (userExist) {
    return res.status(400).json({ error: "User already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      isVerified: false,
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`OTP for ${email}: ${otp}`);

    await OTP.create({ email, otp, action: "account_verification" });

    await sendOTPEmail(email, otp, "account_verification");

    res.status(201).json({
      message: "User registered successfully. please verify your email account",
      email: user.email,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//Login User

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid Credential , Please Sign up First" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    if (!user.isVerified && user.role === "user") {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await OTP.deleteMany({ email, action: "account_verification" });
      await OTP.create({ email, otp, action: "account_verification" });
      await sendOTPEmail(email, otp, "account_verification");
      return res.status(400).json({
        error: "Account not verifies . A new OTP has been sent to your email",
      });
    }

    res.status(200).json({
      message: "Login successful",
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//VerifyOTP

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpRecord = await OTP.findOne({
      email,
      otp,
      action: "account_verification",
    });

    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }
    const user = await userModel.findOneAndUpdate(
      { email },
      { isVerified: true },
    );
    await OTP.deleteMany({ email, action: "account_verification" }); //Remove used OTPs
    res.json({
      message: "Account verifies successfully. You can now log in.",
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
