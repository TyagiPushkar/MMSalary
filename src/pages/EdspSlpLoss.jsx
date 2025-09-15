import React, { useState, useEffect } from "react";
import { Box, Stack } from "@mui/material";
import {
  DataGrid,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";

import { styled } from "@mui/material/styles";
import {
  Select,
  MenuItem,
  OutlinedInput,
  FormControl,
  InputLabel,
  Typography,
  Button,
  Modal,
  Checkbox,
  ListItemText,
  TextField,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL, phpBaseURL } from "./../config";
import { DatePicker } from "antd";
import dayjs from "dayjs";

const EdspSlpLoss = () => {
  const [data, setData] = useState([]);
  const [monthYear, setMonthYear] = useState(dayjs().subtract(1, "month"));
  const [stationCodes, setStationCodes] = useState([]);
  const [selectedStation, setSelectedStation] = useState("");
   const [editRowData, setEditRowData] = useState(null);
   const [editOpen, setEditOpen] = useState(false);
   const [editForm, setEditForm] = useState({
     employeeCode: [],
     employeeName: [],
     recoveryStatus: "",
     salaryMonth: "",
   });
   const [employeeOptions, setEmployeeOptions] = useState([]);
   const [selectedEmployees, setSelectedEmployees] = useState([]);
  const user = JSON.parse(sessionStorage.getItem("user-info"));

  useEffect(() => {
    const officeId = user?.officeid;

    if (!officeId) return;

    if (officeId === "HO") {
      setSelectedStation("all");
    } else if (officeId.includes(",")) {
      const codes = officeId.split(",");
      setStationCodes(codes);
      setSelectedStation(codes[0]);
    } else {
      setStationCodes([officeId]);
      setSelectedStation(officeId);
    }
  }, []);

  useEffect(() => {
      const fetchStationCodes = async () => {
        const officeId = user?.officeid;
  
      if (officeId !== "HO") {
        const codes = officeId.includes(",")
          ? officeId.split(",")
          : [officeId];
  
        setStationCodes(codes);
      } else {
        try {
          // const response = await fetch(`${baseURL}/api/fetch_all_station_codes`);
          const response = await fetch(`${phpBaseURL}/fetch_all_station_codes.php`);
          const result = await response.json();
          setStationCodes(result.station_codes);
        } catch (error) {
          console.error("Error fetching station codes:", error);
          toast.error("Failed to fetch station codes.");
        }
      }};
  
      fetchStationCodes();
    }, []);

  // useEffect(() => {
  //   const fetchStationCodes = async () => {
  //     try {
  //       // const response = await fetch(`${baseURL}/api/fetch_all_station_codes`);
	// 	const response = await fetch(`${phpBaseURL}/fetch_all_station_codes.php`);
  //       const result = await response.json();
  //       setStationCodes(result.station_codes);
  //     } catch (error) {
  //       console.error("Error fetching station codes:", error);
  //       toast.error("Failed to fetch station codes.");
  //     }
  //   };

  //   fetchStationCodes();
  // }, []);

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    maxHeight: "90vh",
    overflowY: "auto",
  };

  const fetchData = async () => {
    const date = new Date(monthYear);
    const formattedMonthYear = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
    // const response = await fetch(`${baseURL}/api/fetch_edsp_slp_loss`, {
	const response = await fetch(`${phpBaseURL}/fetch_edsp_slp_loss.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uploadMonth: formattedMonthYear,
        stationCode: selectedStation,
      }),
    });

    const dataF = await response.json();
    const rowsWithId = dataF.data?.map((row, index) => ({
      ...row,
      id: index + 1,
    }));
    setData(rowsWithId || []);
  };

  const handleSelectOption = (type) => {
    let filtered = [];

    if (type === "all") {
      filtered = employeeOptions;
    } else if (type === "DA (Packet + Salary)") {
      filtered = employeeOptions.filter((emp) =>
        ["DA (Packet)", "DA (Salary)"].includes(emp.employee_role)
      );
    } else {
      filtered = employeeOptions.filter((emp) => emp.employee_role === type);
    }

    setSelectedEmployees(filtered.map((emp) => emp.employeeid));
  };

  useEffect(() => {
    fetchData();
  }, [monthYear, selectedStation]);

  const columns = [
    {
      field: "id",
      headerName: "Sr No.",
      flex: 0.5,
    },
    {
      field: "Node",
      headerName: "Node",
      flex: 1,
    },
    {
      field: "Tid",
      headerName: "Tid",
      flex: 1,
    },
    {
      field: "Value",
      headerName: "Value",
      flex: 1,
    },
    {
      field: "tid_alignment_status",
      headerName: "Tid Alignment Status",
      flex: 1,
    },
    {
      field: "case_source",
      headerName: "Case Source",
      flex: 2,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1.5,
    },
    {
      field: "approver",
      headerName: "Approver",
      flex: 1.5,
    },
    {
      field: "Responsible person",
      headerName: "Responsible Person",
      flex: 2,
    },
    {
      field: "Employee code",
      headerName: "Employee Code",
      flex: 2,
    },
    {
      field: "Recovery status",
      headerName: "Recovery Status",
      flex: 1,
    },
    {
      field: "Salary month of recovery",
      headerName: "Salary Month of Recovery",
      flex: 1,
    },
     ...(user?.officeid !== "HO" && !user.officeid.includes(",")
    ? [
        {
          field: "action",
          headerName: "Action",
          minWidth: 100,
          renderCell: (params) => {
            if (
              params.row["Employee code"] !== null &&
              params.row["Employee code"] !== ""
            ) {
              return (
                <Typography
                  component="span"
                  variant="body2"
                  style={{ color: "green" }}
                >
                  ✔️
                </Typography>
              );
            } else {
              return (
                <Button
                  variant="outlined"
                  onClick={() => handleEdit(params.row)}
                >
                  Edit
                </Button>
              );
            }
          },
          // renderCell: (params) => (
          //   <button
          //     className="btn btn-primary"
          //     onClick={() => handleEdit(params.row)}
          //     style={{
          //       borderColor: "#1547bd",
          //       color: "#1547bd",
          //       backgroundColor: "transparent",
          //       padding: "5px 10px",
          //       borderRadius: "4px",
          //       cursor: "pointer",
          //     }}
          //   >
          //     Edit
          //   </button>
          // ),
        },
      ]
    : []),
  ];

  const fetchEmployeeOptions = async () => {
    try {
	  const response = await fetch(`${phpBaseURL}/get_employee_data.php`,{
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ officeId: user.officeid, type: 'edsp' }),
        }
      );
      const result = await response.json();
      if (result.data) {
        setEmployeeOptions(result.data);
      } else {
        toast.error("Failed to fetch employee data.");
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
      toast.error("Error fetching employee data.");
    }
  };

  useEffect(() => {
    fetchEmployeeOptions();
  }, []);

  const handleEdit = (row) => {
    setEditRowData(row);
    setEditForm({
      employeeCode: row["Employee code"]?.split(", ") || [],
      employeeName: row["Responsible person"]?.split(", ") || [],
      recoveryStatus: row["Recovery status"] || "",
      salaryMonth: row["Salary month of recovery"] || "",
    });
    setEditOpen(true);
  };

  const handleEditSubmit = async () => {

    const selectedEmpObjects = employeeOptions.filter((emp) =>
      selectedEmployees.includes(emp.employeeid)
    );

    const employeeCode = selectedEmpObjects
      .map((emp) => emp.employeeid)
      .join(", ");
    const employeeName = selectedEmpObjects.map((emp) => emp.name).join(", ");

    try {
	  const response = await fetch(`${phpBaseURL}/update_edsp_slp.php`,
	  {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // id: editRowData.id,
            id: editRowData.Id,
            value: editRowData.Value,
            employeeCode: employeeCode,
            employeeName: employeeName,
            recoveryStatus: editForm.recoveryStatus,
            // monthYear: dayjs(editForm.salaryMonth).format("YYYY-MM"),
            monthYear: editRowData.Upload_month,
          }),
        }
      );
      const result = await response.json();
      if (result.message === "SLP updated") {
        toast.success("Row updated successfully");
        fetchData();
        setEditOpen(false);
      } else {
        toast.error("Update failed");
      }
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("Error updating data");
    }
  };


  const handleMonthYearChange = (date) => {
    setMonthYear(date);
  };

  const disabledDate = (current) => {
    return (
      current &&
      dayjs(current).isAfter(dayjs().endOf("month").subtract(1, "month"))
    );
  };

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector
          slotProps={{ tooltip: { title: "Change density" } }}
        />
        <GridToolbarExport
          slotProps={{
            tooltip: { title: "Export data" },
            button: { variant: "outlined" },
          }}
        />
        <Box sx={{ flexGrow: 1 }} />
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
  }

  return (
    <div>
      <Box m="20px">
        <Box
          display="flex"
          width="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box sx={{ width: "20%" }}>
            <FormControl
              fullWidth
              sx={{
                backgroundColor: "white",
                "& label": {
                  color: "black !important",
                },
                "& fieldset": {
                  borderColor: "black !important",
                },
              }}
            >
              <InputLabel id="station-select-label">
                Select Station Code
              </InputLabel>
              <Select
                labelId="station-select-label"
                value={selectedStation}
                onChange={(e) => setSelectedStation(e.target.value)}
                label="Select Station Code"
              >
                {/* <MenuItem value="all">All</MenuItem>{" "} */}
                {user.officeid === "HO" && <MenuItem value="all">All</MenuItem>}
                {stationCodes.map((stationCode) => (
                  <MenuItem key={stationCode} value={stationCode}>
                    {stationCode}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ width: "20%" }}>
            <DatePicker
              picker="month"
              onChange={handleMonthYearChange}
              value={monthYear}
              disabledDate={disabledDate}
              style={{ width: "100%", backgroundColor: "white" }}
              allowClear={false}
            />
          </Box>
        </Box>
        <Box
          m="20px 0 0 0"
          height="80vh"
          width="100%"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color: "black",
            },
            "& .MuiDataGrid-columnHeaders": {
              color: "white",
              backgroundColor: "#1547bd",
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: "white",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              color: "white",
              backgroundColor: "#1547bd",
            },
            "& .MuiCheckbox-root": {
              color: `#1547bd !important`,
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `#1547bd !important`,
            },
            "& .MuiTablePagination-toolbar": {
              backgroundColor: "#1547bd",
              color: "white",
            },
            "& .MuiSelect-icon": {
              color: "white",
            },
            "& .MuiDataGrid-sortIcon": {
              color: "white",
            },
            "& .MuiIconButton-root": {
              color: "white",
            },
          }}
        >
          <DataGrid
            rows={data}
            columns={columns}
            slots={{
              toolbar: CustomToolbar,
            }}
            disableRowSelectionOnClick
          />
        </Box>
      </Box>
      <Modal open={editOpen} onClose={() => setEditOpen(false)}>
        <Box sx={modalStyle}>
          {/* <Typography variant="h6" mb={2}>
            Edit Row
          </Typography> */}
          <Typography variant="h6" mb={2}>
            Tracking Id : {editRowData?.Tid}
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            marginBottom={2}
            flexWrap="wrap"
            useFlexGap
          >
            <Button
              variant="outlined"
              onClick={() => handleSelectOption("all")}
              sx={{ width: "48%" }}
            >
              Select All
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleSelectOption("DA (Packet)")}
              sx={{ width: "48%" }}
            >
              Select DA (Packet)
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleSelectOption("DA (Salary)")}
              sx={{ width: "48%" }}
            >
              Select DA (Salary)
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleSelectOption("DA (Packet + Salary)")}
              sx={{ width: "48%" }}
            >
              Select DA (Packet + Salary)
            </Button>
          </Stack>

          <FormControl
                      fullWidth
                      margin="normal"
                      sx={{
                        backgroundColor: "white",
                        "& label": {
                          color: "black !important",
                        },
                        "& fieldset": {
                          borderColor: "black !important",
                        },
                      }}
                    >
            <InputLabel id="employee-select-label">Select Employees</InputLabel>
            <Select
              labelId="employee-select-label"
              multiple
              value={selectedEmployees}
              onChange={(e) => setSelectedEmployees(e.target.value)}
              input={<OutlinedInput label="Select Employees" />}
              renderValue={(selected) =>
                employeeOptions
                  .filter((emp) => selected.includes(emp.employeeid))
                  .map((emp) => emp.name)
                  .join(", ")
              }
            >
              {employeeOptions.map((emp) => (
                <MenuItem key={emp.employeeid} value={emp.employeeid}>
                  <Checkbox
                    checked={selectedEmployees.indexOf(emp.employeeid) > -1}
                  />
                  <ListItemText primary={`${emp.name} (${emp.employeeid})`} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
                      fullWidth
                      margin="normal"
                      sx={{
                        backgroundColor: "white",
                        "& label": {
                          color: "black !important",
                        },
                        "& fieldset": {
                          borderColor: "black !important",
                        },
                      }}
                    >
            <InputLabel id="recovery-status-label">Recovery Status</InputLabel>
            <Select
              labelId="recovery-status-label"
              value={editForm.recoveryStatus}
              onChange={(e) =>
                setEditForm({ ...editForm, recoveryStatus: e.target.value })
              }
              input={<OutlinedInput label="Recovery Status" />}
            >
              <MenuItem value="Recovered">Recovered</MenuItem>
              <MenuItem value="To be recovered">To be recovered</MenuItem>
              <MenuItem value="Redispute">Redispute</MenuItem>
            </Select>
          </FormControl>

	{/* <DatePicker
  picker="month"
  onChange={(date) => setEditForm({ ...editForm, salaryMonth: date })}
  value={editForm.salaryMonth ? dayjs(editForm.salaryMonth) : dayjs().subtract(1,"month")}
  disabledDate={disabledDate}
  style={{ width: "100%", backgroundColor: "white" }}
  allowClear={false}
  getPopupContainer={(triggerNode) => triggerNode.parentNode}
/> */}



          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button
              onClick={() => setEditOpen(false)}
              color="secondary"
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditSubmit}
              variant="contained"
              color="primary"
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default EdspSlpLoss;