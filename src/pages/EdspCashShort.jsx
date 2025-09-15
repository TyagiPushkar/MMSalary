import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Checkbox,
  ListItemText,
  Stack,
} from "@mui/material";
import { DataGrid, GridToolbar,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector } from "@mui/x-data-grid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL, phpBaseURL } from "./../config";
import { DatePicker } from "antd";
import dayjs from "dayjs";

const EdspCashShort = () => {
  const [data, setData] = useState([]);
  const [monthYear, setMonthYear] = useState(dayjs().subtract(1, "month"));
  const [stationCodes, setStationCodes] = useState([]);
  const [selectedStation, setSelectedStation] = useState("");
  const [employeeListForNode, setEmployeeListForNode] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [recoveryStatus, setRecoveryStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [ticketLink, setTicketLink] = useState("");
  const [currentDate, setCurrentDate] = useState(dayjs());
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
  
  // Fetch station codes
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

  // Optimized fetch data function with useCallback
  const fetchData = useCallback(async () => {
    const date = new Date(monthYear);
    const formattedMonthYear = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
    try {
      // const response = await fetch(`${baseURL}/api/fetch_edsp_cod`, {
      const response = await fetch(`${phpBaseURL}/fetch_edsp_cod.php`, {
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
    } catch (error) {
      toast.error("Failed to fetch data.");
    }
  }, [monthYear, selectedStation]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEditClick = async (row) => {
    setSelectedRow(row);
    setOpenModal(true);
    setRecoveryStatus("");
    setRemarks("");
    setTicketLink("");
    setCurrentDate(dayjs());
    setSelectedEmployees([]);
    try {
      const response = await fetch(`${phpBaseURL}/get_edsp_employee.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uploadMonth: monthYear.format("YYYY-MM"),
          stationCode: row.Node,
        }),
      });
      const result = await response.json();
      setEmployeeListForNode(result.employees || []);
    } catch (error) {
      console.error("Error fetching employee data:", error);
      setEmployeeListForNode([]);
    }
  };

  const handleSelectOption = (type) => {
    let filtered = [];

    if (type === "all") {
      filtered = employeeListForNode;
    } else if (type === "DA (Packet + Salary)") {
      filtered = employeeListForNode.filter((emp) =>
        ["DA (Packet)", "DA (Salary)"].includes(emp.employee_role)
      );
    } else {
      filtered = employeeListForNode.filter((emp) => emp.employee_role === type);
    }

    setSelectedEmployees(filtered.map((emp) => emp.employeeId));
  };

  const handleSave = async () => {
    const rowData = data.find((row) => row.id === selectedRow.id);
    const selectedEmployeeNames = selectedEmployees
      .map((empId) => {
        const emp = employeeListForNode.find(
          (employee) => employee.employeeId === empId
        );
        return emp ? emp.employeeName : "";
      })
      .join(", ");
    const selectedEmployeeIds = selectedEmployees.join(", ");

    if (
      !selectedEmployees.length ||
      !recoveryStatus ||
      !remarks
    ) {
      toast.error("Please fill all fields.");
      return;
    }

    const requestBody = {
      node: rowData.Node,
      COD_Loss: rowData.COD_Loss,
      employee_code: selectedEmployeeIds,
      responsible_person: selectedEmployeeNames,
      recovery_status: recoveryStatus,
      salary_month_of_recovery: rowData.Upload_month,
      ticket_Link_for_any_tech_issue: ticketLink,
      date_of_Ticket_raised: currentDate.format("YYYY-MM-DD"),
      upload_month: rowData.Upload_month,
    };

    try {
      // const response = await fetch(`${baseURL}/submit_cash_short`, {
      const response = await fetch(`${phpBaseURL}/submit_cash_short.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        toast.success("Employee data saved successfully!");
        fetchData();
        setOpenModal(false);
      } else {
        toast.error("Failed to save employee data.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Error saving employee data.");
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
       field: "COD_Loss",
       headerName: "COD Loss",
       flex: 1,
     },
     {
       field: "Responsible_person",
       headerName: "Responsible Person",
       flex: 2,
     },
     {
       field: "Employee_code",
       headerName: "Employee Code",
       flex: 2,
     },
     {
       field: "Recovery_status",
       headerName: "Recovery Status",
       flex: 1,
     },
     {
       field: "Salary_month_of_recovery",
       headerName: "Salary Month of Recovery",
       flex: 1,
     },
     {
       field: "Ticket_Link_for_any_tech_issue",
       headerName: "Ticket Link for Any Tech Issue",
       flex: 2,
     },
     {
       field: "Date_of_Ticket_raised",
       headerName: "Date of Ticket Raised",
       flex: 1,
     },
     {
       field: "actions",
       headerName: "Actions",
       flex: 1,
       renderCell: (params) => {
         if (
           params.row["Employee_code"] !== null &&
           params.row["Employee_code"] !== ""
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
               onClick={() => handleEditClick(params.row)}
             >
               Edit
             </Button>
           );
         }
       },
     },
   ];

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
          disableRowSelectionOnClick />
        </Box>
      </Box>

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="md"
      >
        <DialogTitle>Edit Employee</DialogTitle>
        <DialogContent>
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
            <InputLabel>Employee</InputLabel>
            {/* <Select
              multiple
              value={selectedEmployees}
              onChange={(e) => setSelectedEmployees(e.target.value)}
              label="Employee"
            >
              {employeeListForNode.length > 0 ? (
                employeeListForNode.map((employee) => (
                  <MenuItem
                    key={employee.employeeId}
                    value={employee.employeeId}
                  >
                    {employee.employeeName} ({employee.employeeId})
                  </MenuItem>
                )) */}
            <Select
              multiple
              value={selectedEmployees}
              onChange={(e) => setSelectedEmployees(e.target.value)}
              label="Employee"
              renderValue={(selected) =>
                employeeListForNode
                  .filter((emp) => selected.includes(emp.employeeId))
                  .map((emp) => emp.employeeName+' ('+emp.employeeId+')')
                  .join(", ")
              }
            >
              {employeeListForNode.length > 0 ? (
                employeeListForNode.map((employee) => (
                  <MenuItem key={employee.employeeId} value={employee.employeeId}>
                    <Checkbox
                      checked={selectedEmployees.indexOf(employee.employeeId) > -1}
                    />
                    <ListItemText primary={`${employee.employeeName} (${employee.employeeId})`} />
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No employees found</MenuItem>
              )}
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
            <InputLabel>Recovery Status</InputLabel>
            <Select
              value={recoveryStatus}
              onChange={(e) => setRecoveryStatus(e.target.value)}
              label="Recovery Status"
            >
              <MenuItem value="Recovery">Recovered</MenuItem>
              <MenuItem value="To be recover">To be recover</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Remarks"
            fullWidth
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
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
          />
          <TextField
            label="Raised Ticket"
            fullWidth
            value={ticketLink}
            onChange={(e) => setTicketLink(e.target.value)}
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (selectedEmployees.length > 0 && recoveryStatus && remarks) {
                handleSave();
              } else {
                toast.error("Please fill all fields.");
              }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

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

export default EdspCashShort;
