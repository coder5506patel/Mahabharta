import express from "express";
import {
  addCompany,
  updateProfile,
  login,
  registerSendOTP,
  registerVerifyOTP,
  loginWithOTP,
  verifyLoginOTP,
} from "../Controller/comapnayauth.js";

const router = express.Router();

// OTP-based registration
router.post("/register/send-otp", registerSendOTP);
router.post("/register/verify-otp", registerVerifyOTP);

// OTP-based login
router.post("/login/send-otp", loginWithOTP);
router.post("/login/verify-otp", verifyLoginOTP);

// Other routes
router.post("/signup", addCompany);
router.put("/update/:id", updateProfile);
router.post("/login", login);

export default router;