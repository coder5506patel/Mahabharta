import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true,
  },
  companyUsername: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  companyPassword: {
    type: String,
    required: true,
  },
  companyEmail: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  companyAddress: {
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
  },
  companyContactNo: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    default: "Company", // Default role is "Company"
    enum: ["Company"], // Restrict role to "Company"
  },
}, { timestamps: true });

export default mongoose.model("Company", CompanySchema);