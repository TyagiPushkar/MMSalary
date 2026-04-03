import React from "react";
import PropTypes from "prop-types";

const EmployeeDetailsView = ({ data = {} }) => {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No employee data available</p>
      </div>
    );
  }

  const DetailRow = ({ label, value }) => (
    <div className="flex justify-between py-3 border-b border-gray-200 last:border-b-0">
      <span className="font-semibold text-gray-700">{label}:</span>
      <span className="text-gray-600">{value || "N/A"}</span>
    </div>
  );

  const SectionCard = ({ title, children }) => (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4 border border-blue-200">
      <h3 className="text-md font-bold text-blue-900 mb-3">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Profile Header */}
      <div className="flex flex-col items-center justify-center py-6 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg mb-6">
        {/* Circular Profile Image */}
        <div className="mb-4">
          {data.photo || data.profile_photo ? (
            <img
              src={data.photo || data.profile_photo}
              alt={data.name}
              className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover shadow-lg"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/96?text=" +
                  (data.name ? data.name.charAt(0) : "E");
              }}
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-500 text-white flex items-center justify-center text-4xl font-bold border-4 border-blue-600 shadow-lg">
              {data.name ? data.name.charAt(0).toUpperCase() : "E"}
            </div>
          )}
        </div>

        {/* Employee Info */}
        <h2 className="text-2xl font-bold text-gray-800">
          {data.name || "Employee"}
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          ID:{" "}
          <span className="font-semibold">
            {data.id || data.employee_id || "N/A"}
          </span>
        </p>
        <p className="text-blue-600 font-semibold mt-2">
          {data.employee_role || data.role || data.designation || "Employee"}
        </p>
      </div>

      {/* Personal Details */}
      <SectionCard title="👤 Personal Details">
        <DetailRow label="Name" value={data.name} />
        <DetailRow label="Father's Name" value={data.father_name} />
        <DetailRow label="Date of Birth" value={data.date_of_birth} />
        <DetailRow label="Phone" value={data.phone} />
        <DetailRow label="Email" value={data.email} />
        <DetailRow label="Address" value={data.address} />
        <DetailRow label="District" value={data.district} />
        <DetailRow label="State" value={data.state} />
        <DetailRow label="Pin Code" value={data.pin_code} />
      </SectionCard>

      {/* Employment Details */}
      <SectionCard title="💼 Employment Details">
        <DetailRow label="Employee ID" value={data.id || data.employee_id} />
        <DetailRow label="Office" value={data.officeid} />
        <DetailRow label="Location" value={data.location} />
        <DetailRow label="Role" value={data.employee_role || data.role} />
        <DetailRow label="Designation" value={data.designation} />
        <DetailRow label="Department" value={data.department} />
      </SectionCard>

      {/* Document Details */}
      <SectionCard title="📄 Document Details">
        <DetailRow label="Aadhar Number" value={data.aadhar_number} />
        <DetailRow label="PAN Number" value={data.pan_number} />
        <DetailRow
          label="Aadhar Photo"
          value={data.aadhar_photo ? "✓ Uploaded" : "Not Uploaded"}
        />
        <DetailRow
          label="PAN Photo"
          value={data.pan_photo ? "✓ Uploaded" : "Not Uploaded"}
        />
      </SectionCard>

      {/* Bank Details */}
      <SectionCard title="🏦 Bank Details">
        <DetailRow
          label="Account Holder Name"
          value={data.account_holder_name}
        />
        <DetailRow label="Account Number" value={data.account_number} />
        <DetailRow label="IFSC Code" value={data.account_ifsc} />
        <DetailRow label="Bank Name" value={data.bank_name} />
        <DetailRow label="Branch" value={data.branch} />
      </SectionCard>

      {/* Additional Info */}
      {(data.created_at || data.updated_at || data.status) && (
        <SectionCard title="ℹ️ Additional Information">
          <DetailRow label="Status" value={data.status} />
          <DetailRow label="Created Date" value={data.created_at} />
          <DetailRow label="Last Updated" value={data.updated_at} />
        </SectionCard>
      )}

      {/* Photo Attachments */}
      {(data.aadhar_photo || data.pan_photo) && (
        <SectionCard title="📸 Attachments">
          <div className="grid grid-cols-2 gap-4">
            {data.aadhar_photo && (
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Aadhar Photo
                </p>
                <img
                  src={data.aadhar_photo}
                  alt="Aadhar"
                  className="w-full h-32 object-cover rounded border border-gray-300"
                  onError={(e) => (e.target.src = "")}
                />
              </div>
            )}
            {data.pan_photo && (
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  PAN Photo
                </p>
                <img
                  src={data.pan_photo}
                  alt="PAN"
                  className="w-full h-32 object-cover rounded border border-gray-300"
                  onError={(e) => (e.target.src = "")}
                />
              </div>
            )}
          </div>
        </SectionCard>
      )}
    </div>
  );
};

EmployeeDetailsView.propTypes = {
  data: PropTypes.object,
};

export default EmployeeDetailsView;
