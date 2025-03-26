import Company from "../Models/CompanySchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";
const OTP_EXPIRATION = 5 * 60 * 1000; // 5 minutes

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "shreyashpatel5506@gmail.com",
    pass: "esas djpv lbrd zvxt", // Replace with your app password
  },
});

// Temporary OTP store (use Redis or DB in production)
const otpStore = new Map();

// Generate and send OTP
const sendOTP = async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email, { otp, expiresAt: Date.now() + OTP_EXPIRATION });
  await transporter.sendMail({
    from: "shreyashpatel5506@gmail.com",
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
  });
};

// Add Company (Signup)
export const addCompany = async (req, res) => {
  try {
    const { companyName, companyUsername, companyPassword, companyEmail, companyAddress, companyContactNo } = req.body;

    // Check if email or username already exists
    const existingCompany = await Company.findOne({
      $or: [{ companyEmail }, { companyUsername }],
    });
    if (existingCompany) {
      return res.status(400).json({ message: "Email or Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(companyPassword, 10);

    // Create new company
    const newCompany = new Company({
      companyName,
      companyUsername,
      companyPassword: hashedPassword,
      companyEmail,
      companyAddress,
      companyContactNo,
      role: "Company", // Set role to "Company"
    });

    await newCompany.save();
    res.status(201).json({ message: "Company registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering company", error });
  }
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params; // Assuming company ID is passed as a URL parameter
    const updates = req.body;

    // If password is being updated, hash it
    if (updates.companyPassword) {
      updates.companyPassword = await bcrypt.hash(updates.companyPassword, 10);
    }

    const updatedCompany = await Company.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({ message: "Profile updated successfully", updatedCompany });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
  }
};

// Login by Email or Username
export const login = async (req, res) => {
  try {
    const { identifier, companyPassword } = req.body; // `identifier` can be email or username

    // Find company by email or username
    const company = await Company.findOne({
      $or: [{ companyEmail: identifier }, { companyUsername: identifier }],
    });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(companyPassword, company.companyPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: company._id, role: company.role }, // Include role in the token payload
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Send OTP for registration
export const registerSendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    await sendOTP(email);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error });
  }
};

// Verify OTP and register company
export const registerVerifyOTP = async (req, res) => {
  try {
    const { companyName, companyUsername, companyPassword, companyEmail, companyAddress, companyContactNo, otp } = req.body;

    if (!otp) return res.status(400).json({ message: "OTP is required" });

    const storedOTP = otpStore.get(companyEmail);
    if (!storedOTP || storedOTP.otp !== otp || storedOTP.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(companyPassword, 10);

    // Create new company
    const newCompany = new Company({
      companyName,
      companyUsername,
      companyPassword: hashedPassword,
      companyEmail,
      companyAddress,
      companyContactNo,
      role: "Company",
    });

    await newCompany.save();
    otpStore.delete(companyEmail);

    res.status(201).json({ message: "Company registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering company", error });
  }
};

// Login with OTP
export const loginWithOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const company = await Company.findOne({ companyEmail: email });
    if (!company) return res.status(404).json({ message: "Company not found" });

    await sendOTP(email);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error });
  }
};

// Verify OTP for login
export const verifyLoginOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const storedOTP = otpStore.get(email);
    if (!storedOTP || storedOTP.otp !== otp || storedOTP.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const company = await Company.findOne({ companyEmail: email });
    if (!company) return res.status(404).json({ message: "Company not found" });

    const token = jwt.sign({ id: company._id, role: company.role }, JWT_SECRET, { expiresIn: "1h" });
    otpStore.delete(email);

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error verifying OTP", error });
  }
};