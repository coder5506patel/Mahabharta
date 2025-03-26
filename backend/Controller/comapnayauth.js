import Company from "../Models/CompanySchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
      "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};