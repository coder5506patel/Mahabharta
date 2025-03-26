import React, { useState } from "react";
import { sendLoginOTP, verifyLoginOTP } from "../services/companyService";

const Login = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const handleSendOTP = async () => {
    try {
      await sendLoginOTP(email);
      setStep(2);
    } catch (error) {
      alert(error.message || "Error sending OTP");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const response = await verifyLoginOTP({ email, otp });
      alert("Login successful");
      localStorage.setItem("token", response.token);
    } catch (error) {
      alert(error.message || "Error verifying OTP");
    }
  };

  return (
    <div>
      {step === 1 && (
        <div>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSendOTP}>Send OTP</button>
        </div>
      )}
      {step === 2 && (
        <div>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleVerifyOTP}>Verify OTP</button>
        </div>
      )}
    </div>
  );
};

export default Login;