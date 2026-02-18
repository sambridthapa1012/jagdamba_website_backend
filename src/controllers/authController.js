import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js"; // nodemailer helper
import sendOTPMail from '../utils/sendOTPMail.js';

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          phone: user.phone,
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error registering user'
    });
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Account is deactivated' });
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error logging in'
    });
  }
};

/**
 * Forgot Password
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save({ validateBeforeSave: false });

    try {
      await sendOTPMail({
        to: user.email,
        subject: "OTP for Password Reset",
        text: `Your OTP is ${otp}. It will expire in 10 minutes.`
      });
    } catch (mailErr) {
      console.error("sendOTPMail error:", mailErr);
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP. Check email configuration on the server.",
        error: mailErr.message
      });
    }

    res.status(200).json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error("forgotPassword error:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP", error: error.message });
  }
};

/**
 * Verify OTP
 */
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({
    email,
    otp,
    otpExpire: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ success: false, message: "Invalid or expired OTP" });

  const resetToken = user.getResetPasswordToken();

  user.otp = undefined;
  user.otpExpire = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, resetToken });
};

/**
 * Reset Password
 */
export const resetPassword = async (req, res) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) return res.status(400).json({ success: false, message: "Invalid or expired token" });

  const { password, confirmPassword } = req.body;
  if (password !== confirmPassword) return res.status(400).json({ success: false, message: "Passwords do not match" });

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({ success: true, message: "Password updated successfully" });
};

/**
 * Get Current User
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error fetching user profile' });
  }
};
