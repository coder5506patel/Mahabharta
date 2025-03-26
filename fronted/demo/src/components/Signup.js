import React, { useState } from "react";
import { sendRegisterOTP, verifyRegisterOTP } from "../services/companyService";

const Register = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({
    companyName: "",
    companyUsername: "",
    companyPassword: "",
    companyEmail: "",
    companyAddress: { city: "", state: "", country: "" },
    companyContactNo: "",
    otp: "",
  });

  const handleSendOTP = async () => {
    try {
      await sendRegisterOTP(email);
      setStep(2);
    } catch (error) {
      alert(error.message || "Error sending OTP");
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      await verifyRegisterOTP(formData);
      alert("Registration successful");
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
        <form onSubmit={handleVerifyOTP}>
          <input name="otp" placeholder="Enter OTP" onChange={(e) => setFormData({ ...formData, otp: e.target.value })} />
          <input name="companyName" placeholder="Company Name" onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} />
          <input name="companyUsername" placeholder="Username" onChange={(e) => setFormData({ ...formData, companyUsername: e.target.value })} />
          <input name="companyPassword" type="password" placeholder="Password" onChange={(e) => setFormData({ ...formData, companyPassword: e.target.value })} />
          <input name="companyEmail" placeholder="Email" onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })} />
          <input name="companyAddress.city" placeholder="City" onChange={(e) => setFormData({ ...formData, companyAddress: { ...formData.companyAddress, city: e.target.value } })} />
          <input name="companyAddress.state" placeholder="State" onChange={(e) => setFormData({ ...formData, companyAddress: { ...formData.companyAddress, state: e.target.value } })} />
          <input name="companyAddress.country" placeholder="Country" onChange={(e) => setFormData({ ...formData, companyAddress: { ...formData.companyAddress, country: e.target.value } })} />
          <input name="companyContactNo" placeholder="Contact No" onChange={(e) => setFormData({ ...formData, companyContactNo: e.target.value })} />
          <button type="submit">Verify & Register</button>
        </form>
      )}
    </div>
  );
};

export default Register;