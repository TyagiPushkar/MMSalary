import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  ArrowBack as ArrowBackIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";

const FileUploadButton = ({ label, value, onChange }) => {
  return (
    <div className="w-full">
      <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-blue-400 rounded-lg cursor-pointer hover:bg-blue-50 transition">
        <div className="flex items-center space-x-2">
          <CloudUploadIcon className="text-blue-500" />
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        <input
          type="file"
          onChange={(e) => onChange(e.target.files[0])}
          className="hidden"
        />
      </label>
      <p className="text-xs text-gray-500 mt-2">
        {value ? value.name : "No file selected"}
      </p>
    </div>
  );
};

const SectionCard = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
    {children}
  </div>
);

const RegistrationForm = ({ initialData, onClose, userInfo = {} }) => {
  const [formData, setFormData] = useState({
    Name: initialData?.name || "",
    phone: initialData?.phone || "",
    officeid: initialData?.officeid || "",
    photo: initialData?.photo || "",
    location: initialData?.location || "",
    employee_role: initialData?.employee_role || "",
    email: initialData?.email || "",
    fatherName: initialData?.father_name || "",
    dateOfBirth: initialData?.date_of_birth || "",
    address: initialData?.address || "",
    district: initialData?.district || "",
    state: initialData?.state || "",
    pinCode: initialData?.pin_code || "",
    aadharNumber: initialData?.aadhar_number || "",
    panNumber: initialData?.pan_number || "",
    accountHolderName: initialData?.account_holder_name || "",
    accountIFSC: initialData?.account_ifsc || "",
    accountNo: initialData?.account_number || "",
  });

  const [files, setFiles] = useState({
    aadharPhoto: null,
    panPhoto: null,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (field) => (file) => {
    setFiles({ ...files, [field]: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create FormData for file upload
      const submitData = new FormData();

      // Add form fields
      submitData.append("name", formData.Name);
      submitData.append("phone", formData.phone);
      submitData.append("officeid", formData.officeid);
      submitData.append("photo", formData.photo);
      submitData.append("location", formData.location);
      submitData.append("employee_role", formData.employee_role);
      submitData.append("fathers_name", formData.fatherName);
      submitData.append("dob", formData.dateOfBirth);
      submitData.append("address", formData.address);
      submitData.append("district", formData.district);
      submitData.append("state", formData.state);
      submitData.append("pin_code", formData.pinCode);
      submitData.append("aadhar_number", formData.aadharNumber);
      submitData.append("pan_card", formData.panNumber);
      submitData.append("ac_name", formData.accountHolderName);
      submitData.append("ifsc", formData.accountIFSC);
      submitData.append("account_num", formData.accountNo);

      // Add employee ID if editing
      if (initialData?.id) {
        submitData.append("employee_id", initialData.id);
      }

      // Add office ID from user info
      if (userInfo?.officeid) {
        submitData.append("office_id", userInfo.officeid);
      }

      // Add files
      if (files.aadharPhoto) {
        submitData.append("aadhar_photo", files.aadharPhoto);
      }
      if (files.panPhoto) {
        submitData.append("pan_photo", files.panPhoto);
      }

      // API call
      const response = await fetch(
        "https://namami-infotech.com/MMSalary/Employee/add_req_employe.php",
        {
          method: "POST",
          body: submitData,
        },
      );

      const result = await response.json();

      if (result.success || result.status === "success") {
        setSnackbar({
          open: true,
          message: result.message || "Employee details saved successfully!",
          severity: "success",
        });

        // Close modal after 2 seconds
        setTimeout(() => {
          if (onClose) onClose();
        }, 2000);
      } else {
        setSnackbar({
          open: true,
          message: result.message || "Error saving employee details",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setSnackbar({
        open: true,
        message: "Error submitting form. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fatherName: "",
      dateOfBirth: "",
      address: "",
      district: "",
      state: "",
      pinCode: "",
      aadharNumber: "",
      panNumber: "",
      accountHolderName: "",
      accountIFSC: "",
      accountNo: "",
    });

    setFiles({
      aadharPhoto: null,
      panPhoto: null,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6 font-medium transition"
        >
          <ArrowBackIcon className="w-5 h-5" />
          <span>Back</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Registration Form
          </h1>
          <p className="text-gray-600 text-sm mb-6">
            Please fill all the required details
          </p>

          <hr className="mb-8 border-gray-200" />

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Details */}
            <SectionCard title="Personal Details">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Profile Photo Upload */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📷 Profile Photo
                  </label>
                  <FileUploadButton
                    label="Upload Profile Photo"
                    value={files.profilePhoto}
                    onChange={handleFileChange("profilePhoto")}
                  />
                  {/* Photo Preview - Show existing photo or new upload preview */}
                  <div className="mt-3 text-center">
                    {files.profilePhoto ? (
                      <>
                        <img
                          src={URL.createObjectURL(files.profilePhoto)}
                          alt="Profile Preview"
                          className="w-20 h-20 rounded-full mx-auto border-2 border-blue-400 object-cover"
                        />
                        <p className="text-xs text-blue-600 mt-1 font-semibold">
                          New Photo
                        </p>
                      </>
                    ) : formData.photo ? (
                      <>
                        <img
                          src={formData.photo}
                          alt="Current Profile"
                          className="w-20 h-20 rounded-full mx-auto border-2 border-green-400 object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/80?text=Photo";
                          }}
                        />
                        <p className="text-xs text-green-600 mt-1 font-semibold">
                          Current Photo
                        </p>
                      </>
                    ) : (
                      <p className="text-xs text-gray-400 mt-1">
                        No photo selected
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Father Name
                  </label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    placeholder="Enter father's name"
                    className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your address"
                    rows="2"
                    className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-800"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    District
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    placeholder="District"
                    className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pin Code
                  </label>
                  <input
                    type="text"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleInputChange}
                    placeholder="Pin Code"
                    className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-800"
                  />
                </div>
              </div>
            </SectionCard>

            {/* Documents */}
            <SectionCard title="Documents">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aadhar Number
                  </label>
                  <input
                    type="text"
                    name="aadharNumber"
                    value={formData.aadharNumber}
                    onChange={handleInputChange}
                    placeholder="Enter Aadhar number"
                    className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Aadhar
                  </label>
                  <FileUploadButton
                    label="Upload Aadhar"
                    value={files.aadharPhoto}
                    onChange={handleFileChange("aadharPhoto")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PAN Number
                  </label>
                  <input
                    type="text"
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleInputChange}
                    placeholder="Enter PAN number"
                    className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload PAN
                  </label>
                  <FileUploadButton
                    label="Upload PAN"
                    value={files.panPhoto}
                    onChange={handleFileChange("panPhoto")}
                  />
                </div>
              </div>
            </SectionCard>

            {/* Bank Details */}
            <SectionCard title="Bank Details">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    name="accountHolderName"
                    value={formData.accountHolderName}
                    onChange={handleInputChange}
                    placeholder="Account holder name"
                    className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    name="accountIFSC"
                    value={formData.accountIFSC}
                    onChange={handleInputChange}
                    placeholder="IFSC Code"
                    className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="accountNo"
                    value={formData.accountNo}
                    onChange={handleInputChange}
                    placeholder="Account number"
                    className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-800"
                  />
                </div>
              </div>
            </SectionCard>

            {/* Buttons */}
            <div className="flex gap-4 justify-center pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Register"}
              </button>

              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="px-8 py-3 border-2 border-blue-500 text-blue-500 font-semibold rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reset
              </button>
            </div>
          </form>

          {/* Snackbar */}
          {snackbar.open && (
            <div
              className={`mt-6 p-4 rounded-lg animate-pulse ${
                snackbar.severity === "success"
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{snackbar.message}</span>
                <button
                  onClick={() => setSnackbar({ ...snackbar, open: false })}
                  className="text-lg font-bold hover:opacity-70"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

RegistrationForm.propTypes = {
  onClose: PropTypes.func,
  initialData: PropTypes.object,
  userInfo: PropTypes.object,
};

export default RegistrationForm;
