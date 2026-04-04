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

  return (
    <div className="p-3 bg-gradient-to-b from-blue-50 to-white rounded-lg">
      {/* Photo Section */}
      <div className="flex justify-center mb-4">
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
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center text-4xl font-bold border-4 border-blue-500 shadow-lg">
            {data.name ? data.name.charAt(0).toUpperCase() : "E"}
          </div>
        )}
      </div>

      {/* Employee Info Header */}
      <div className="text-center mb-4 pb-3 border-b-2 border-blue-200">
        <h2 className="text-xl font-bold text-gray-800">{data.name}</h2>
        <p className="text-blue-600 font-semibold text-sm mt-1">
          {data.employee_role || "Employee"}
        </p>
        <p className="text-gray-500 text-xs mt-1">ID: {data.id}</p>
      </div>

      {/* Info Grid */}
      <div className="space-y-2">
        <div className="flex justify-between items-center p-2 bg-white rounded border border-gray-200 hover:bg-blue-50 transition">
          <span className="text-gray-600 font-medium text-sm">📞 Phone:</span>
          <span className="text-gray-800 font-semibold text-sm">
            {data.phone || "-"}
          </span>
        </div>

        <div className="flex justify-between items-center p-2 bg-white rounded border border-gray-200 hover:bg-blue-50 transition">
          <span className="text-gray-600 font-medium text-sm">🏢 Office:</span>
          <span className="text-gray-800 font-semibold text-sm">
            {data.officeid || "-"}
          </span>
        </div>

        <div className="flex justify-between items-center p-2 bg-white rounded border border-gray-200 hover:bg-blue-50 transition">
          <span className="text-gray-600 font-medium text-sm">
            📍 Location:
          </span>
          <span className="text-gray-800 font-semibold text-sm">
            {data.location || "-"}
          </span>
        </div>
      </div>

      {/* Salary Section for Super Users */}
      {userInfo.type === "super" && (
        <SectionCard title="💰 Add Salary">
          {message.text && (
            <div className="mb-4">
              {message.type === "success" ? (
                <Alert severity="success">{message.text}</Alert>
              ) : (
                <Alert severity="error">{message.text}</Alert>
              )}
            </div>
          )}
          <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
            <TextField
              label="Salary Amount"
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="Enter salary amount"
              fullWidth
              size="small"
              disabled={loading}
            />
            <Button
              variant="contained"
              color="success"
              onClick={handleApproveSalary}
              disabled={loading}
              sx={{ whiteSpace: "nowrap" }}
            >
              {loading ? <CircularProgress size={24} /> : "Add & Approve"}
            </Button>
          </Box>
        </SectionCard>
      )}
    </div>
  );
};

EmployeeDetailsView.propTypes = {
  data: PropTypes.object,
};

export default EmployeeDetailsView;
