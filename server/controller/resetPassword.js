const User = require('../models/UserModel');
const sendEmail = require('../helpers/sendEmail');
const bcryptjs = require('bcryptjs');

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found", success: false });

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit
  user.otp = otp;
  user.otpExpire = Date.now() + 10 * 60 * 1000; // 10 min

  await user.save();
  
  const message = `Your OTP to reset password is ${otp}`;

  try {
    await sendEmail(user.email, "Password Reset OTP", message);
    res.status(200).json({ message: "OTP sent to your email", success: true });
  } catch (err) {
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();
    res.status(500).json({ message: "Failed to send OTP", success: false });
  }
};

exports.verifyOtp = async (req, res) => {

console.log("Body Received in  req.body:", req.body);

  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    
    if (!user) {
      return res.status(400).json({ message: "User not found", success: false });
    }

    // Check if OTP matches and not expired
    if (String(user.otp) !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP", success: false });
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).json({ message: "OTP has expired", success: false });
    }

    // Clear OTP after successful verification
    user.otp = null;
    user.otpExpire = null;
    await user.save();

    res.status(200).json({
      message: "OTP verified successfully",
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profile_pic: user.profile_pic
      }
    });

  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { userId, password } = req.body;

    if (!userId || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update password

    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({ success: true, message: "Password updated successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};