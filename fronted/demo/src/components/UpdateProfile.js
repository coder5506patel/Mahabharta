import React, { useState } from "react";
import { updateCompanyProfile } from "../services/companyService";

const UpdateProfile = ({ companyId }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    companyUsername: "",
    companyPassword: "",
    companyEmail: "",
    companyAddress: { city: "", state: "", country: "" },
    companyContactNo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateCompanyProfile(companyId, formData);
      alert(response.message);
    } catch (error) {
      alert(error.message || "Error updating profile");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="companyName" placeholder="Company Name" onChange={handleChange} />
      <input name="companyUsername" placeholder="Username" onChange={handleChange} />
      <input name="companyPassword" type="password" placeholder="Password" onChange={handleChange} />
      <input name="companyEmail" placeholder="Email" onChange={handleChange} />
      <input name="companyAddress.city" placeholder="City" onChange={handleChange} />
      <input name="companyAddress.state" placeholder="State" onChange={handleChange} />
      <input name="companyAddress.country" placeholder="Country" onChange={handleChange} />
      <input name="companyContactNo" placeholder="Contact No" onChange={handleChange} />
      <button type="submit">Update Profile</button>
    </form>
  );
};

export default UpdateProfile;