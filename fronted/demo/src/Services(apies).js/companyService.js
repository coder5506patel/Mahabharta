import axios from "axios";

const API_URL = "http://localhost:5000/api/company"; // Replace with your backend URL if different

// Signup a new company
export const signupCompany = async (companyData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, companyData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Update company profile
export const updateCompanyProfile = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/update/${id}`, updatedData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Login a company
export const loginCompany = async (loginData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, loginData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Send OTP for registration
export const sendRegisterOTP = async (email) => {
  const response = await axios.post(`${API_URL}/register/send-otp`, { email });
  return response.data;
};

// Verify OTP and register
export const verifyRegisterOTP = async (data) => {
  const response = await axios.post(`${API_URL}/register/verify-otp`, data);
  return response.data;
};

// Send OTP for login
export const sendLoginOTP = async (email) => {
  const response = await axios.post(`${API_URL}/login/send-otp`, { email });
  return response.data;
};

// Verify OTP for login
export const verifyLoginOTP = async (data) => {
  const response = await axios.post(`${API_URL}/login/verify-otp`, data);
  return response.data;
};