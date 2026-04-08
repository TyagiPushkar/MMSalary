import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const EmployeeDetailsView = ({ data }) => {
  // ✅ Safe fallback for null/undefined
  const safeData = data || {};

  // ✅ Safe sessionStorage parsing
  let user = {};
  try {
    user = JSON.parse(sessionStorage.getItem("user-info")) || {};
  } catch (e) {
    user = {};
  }

  // ✅ State
  const [salaryInput, setSalaryInput] = useState("");

  // ✅ Sync salary when data changes (important!)
  useEffect(() => {
    if (safeData && safeData.salary !== undefined && safeData.salary !== null) {
      setSalaryInput(safeData.salary);
    }
  }, [safeData]);

  // ✅ If no data
  if (!safeData || Object.keys(safeData).length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No employee data available</p>
      </div>
    );
  }

  // ✅ API call
  const handleApprove = async () => {
    if (!salaryInput) {
      alert("Please enter salary");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("name", safeData.name || "");
      formData.append("phone", safeData.phone || "");
      // formData.append("location", safeData.location || "");
      formData.append("officeid", safeData.officeid || "");
      formData.append("salary", salaryInput);
      formData.append("photo", safeData.photo || "");

      if (safeData.location) formData.append("location", safeData.location);
      if (safeData.employee_role)
        formData.append("employee_role", safeData.employee_role);
      if (safeData.officeid) formData.append("officeid", safeData.officeid);

      const response = await axios.post(
        "https://namami-infotech.com/MMSalary/Employee/add_employee.php",
        formData,
      );

      console.log("Response:", response.data);

      if (response.data?.success) {
        alert("Employee approved successfully!");
      } else {
        alert(response.data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("API error");
    }
  };

  return (
    <div className="p-3 bg-gradient-to-b from-blue-50 to-white rounded-lg">
      {/* Photo */}
      <div className="flex justify-center mb-4">
        {safeData.photo || safeData.profile_photo ? (
          <img
            src={safeData.photo || safeData.profile_photo}
            alt={safeData.name}
            className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover shadow-lg"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-blue-500 text-white flex items-center justify-center text-3xl">
            {safeData.name ? safeData.name.charAt(0) : "E"}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold">{safeData.name || "-"}</h2>
        <p className="text-blue-600">{safeData.employee_role || "-"}</p>
        <p className="text-xs text-gray-500">ID: {safeData.id || "-"}</p>
      </div>

      {/* Details */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>📞 Phone:</span>
          <span>{safeData.phone || "-"}</span>
        </div>

        <div className="flex justify-between">
          <span>🏢 Office:</span>
          <span>{safeData.officeid || "-"}</span>
        </div>

        <div className="flex justify-between">
          <span>📍 Location:</span>
          <span>{safeData.location || "-"}</span>
        </div>
      </div>

      {/* Salary Section */}
      {user.type === "super" && (
        <div className="mt-4 p-3 border rounded bg-white">
          <div className="flex justify-between items-center mb-2">
            <span>💰 Salary:</span>

            {safeData.salary !== undefined && safeData.salary !== null ? (
              <span className="text-green-600 font-bold">
                ₹{safeData.salary}
              </span>
            ) : (
              <input
                type="number"
                value={salaryInput}
                onChange={(e) => setSalaryInput(e.target.value)}
                placeholder="Enter salary"
                className="border px-2 py-1 rounded text-sm"
              />
            )}
          </div>

          <button
            onClick={handleApprove}
            disabled={!salaryInput}
            className="w-full bg-green-600 text-white py-2 rounded disabled:bg-gray-400"
          >
            Add & Approve
          </button>
        </div>
      )}
    </div>
  );
};

EmployeeDetailsView.propTypes = {
  data: PropTypes.object,
};

export default EmployeeDetailsView;
