import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
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
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TablePagination,
  Button,
  TextField,
  Modal,
  Grid,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL, phpBaseURL } from "./../config";
import { DatePicker } from "antd";
import dayjs from "dayjs";

const FixedSalary = () => {
  const [data, setData] = useState([]);
  const [monthYear, setMonthYear] = useState(dayjs().subtract(1, "month"));
  const [stationCodes, setStationCodes] = useState([]);
  const [selectedStation, setSelectedStation] = useState("all");
  const [openModal, setOpenModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [extraDays, setExtraDays] = useState(0);
  const userInfo = JSON.parse(sessionStorage.getItem("user-info"));
  const isDualRole = userInfo?.officeid?.includes(",");


  useEffect(() => {
      const fetchStationCodes = async () => {
        const officeId = userInfo?.officeid;
  
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

  const fetchData = async () => {
    const date = new Date(monthYear);
    const formattedMonthYear = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
    const user = JSON.parse(sessionStorage.getItem("user-info"));
    const response = await fetch(`${phpBaseURL}/fetch_permanent_salary.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        month: formattedMonthYear,
        officeId: user.officeid
      }),
    });

    const dataF = await response.json();
    let rowsWithId = dataF.data?.map((row, index) => ({
      ...row,
      id: index + 1,
    }));

    if (selectedStation.toLowerCase() !== "all") {
      rowsWithId = rowsWithId.filter((row) => row.OfficeId === selectedStation);
    }
    setData(rowsWithId || []);
  };

  useEffect(() => {
    fetchData();
  }, [monthYear, selectedStation]);

  const columns = [
    { field: "id", headerName: "Sr No.", minWidth: 80 },
    { field: "EMP ID", headerName: "Employee ID", minWidth: 150 },
    { field: "Name", headerName: "Name", minWidth: 150 },
    { field: "Account_no", headerName: "Account no", minWidth: 150 },
    { field: "Ifsc_code", headerName: "IFSC code", minWidth: 150 },
    { field: "OfficeId", headerName: "Station Code", minWidth: 100 },
    !isDualRole && { field: "Salary", headerName: "Salary", minWidth: 120 },
    { field: "Fuel", headerName: "Fuel", minWidth: 100 },
    { field: "PHONE", headerName: "Phone", minWidth: 150 },
    !isDualRole && { field: "Basic", headerName: "Basic", minWidth: 120 },
    !isDualRole && { field: "DA", headerName: "DA", minWidth: 100 },
    !isDualRole && { field: "HRA", headerName: "HRA", minWidth: 100 },
    !isDualRole && { field: "Gross", headerName: "Gross", minWidth: 130 },
    { field: "Month", headerName: "Month", minWidth: 100 },
    { field: "Month Days", headerName: "Month Days", minWidth: 130 },
    { field: "Present", headerName: "Present", minWidth: 100 },
    { field: "Absent", headerName: "Absent", minWidth: 100 },
    {
      field: "Total Working Days",
      headerName: "Total Working Days",
      minWidth: 180,
    },
    { field: "OT", headerName: "OT", minWidth: 100 },
    { field: "Extra_Days", headerName: "Extra Days", minWidth: 130 },
    !isDualRole && {
      field: "Basic as per days",
      headerName: "Basic (Per Days)",
      minWidth: 150,
    },
    !isDualRole && {
      field: "DA as per days",
      headerName: "DA (Per Days)",
      minWidth: 150,
    },
    !isDualRole && {
      field: "HRA as per days",
      headerName: "HRA (Per Days)",
      minWidth: 150,
    },
    !isDualRole && {
      field: "Gross. as per days",
      headerName: "Gross (Per Days)",
      minWidth: 160,
    },
    !isDualRole && {
      field: "O.T. amount",
      headerName: "OT Amount",
      minWidth: 130,
    },
    !isDualRole && {
      field: "Extra_Days_Amount",
      headerName: "Extra Days Amount",
      minWidth: 180,
    },
    !isDualRole && {
      field: "PF Reimbursement",
      headerName: "PF Reimbursement",
      minWidth: 170,
    },
    !isDualRole && {
      field: "Total earning",
      headerName: "Total Earning",
      minWidth: 160,
    },
    !isDualRole && {
      field: "PF EE share @12%",
      headerName: "PF EE Share (12%)",
      minWidth: 160,
    },
    !isDualRole && {
      field: "ESIC  EE Share @0.75%",
      headerName: "ESIC EE Share (0.75%)",
      minWidth: 180,
    },
    !isDualRole && {
      field: "PF ER Share  @13%",
      headerName: "PF ER Share (13%)",
      minWidth: 160,
    },
    !isDualRole && {
      field: "ESIC ER Share @3.75%,0)",
      headerName: "ESIC ER Share (3.75%)",
      minWidth: 200,
    },
    { field: "DEDUCTION", headerName: "Deduction", minWidth: 120 },
    { field: "PackageLoss", headerName: "Package Loss", width: 120 },
    { field: "CashShort", headerName: "Cash Short", width: 120 },
    { field: "AdvRecovery", headerName: "Adv. Recovery", width: 120 },
    { field: "SLP", headerName: "SLP", width: 120 },
    { field: "Total Deduction", headerName: "Total Deduction", minWidth: 150 },
    !isDualRole && { field: "Net payble", headerName: "Net Payable", minWidth: 150 },
    {
      field: "action",
      headerName: "Action",
      minWidth: 100,
      renderCell: (params) => (
        <button
          className="btn btn-primary"
          onClick={() => handleEdit(params.row)}
          style={{
            borderColor: "#1547bd",
            color: "#1547bd",
            backgroundColor: "transparent",
            padding: "5px 10px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Edit
        </button>
      ),
    },
  ].filter(Boolean);


  const handleEdit = (row) => {
    setSelectedEmployee(row);
    setExtraDays(row.Extra_Days || 0);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEmployee(null);
  };

  const handleUpdateExtraDays = async () => {
    if(extraDays > 4){
      toast.error("Extra Days value should be less than 4");
      return;
    }
    try {
        // const response = await fetch(`${baseURL}/update_extra_days_permanent`, {
        // method: "PUT",
        const response = await fetch(`${phpBaseURL}/update_extra_days_permanent.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: selectedEmployee["EMP ID"],
          extra_days: extraDays,
          month: selectedEmployee["Month"],
        }),
      });
      const data = await response.json();
      toast.success(data.message);
      fetchData(); // Refresh the data
      handleCloseModal();
    } catch (error) {
      toast.error("Failed to update extra days.");
      console.error(error);
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
                <MenuItem value="all">All</MenuItem>{" "}
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
          height="70vh"
          width="100%"
          sx={{
            overflow: "auto",
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
          <div style={{ height: "70vh",maxWidth: "75vw" }}>
            <DataGrid
              rows={data}
              columns={columns}
              slots={{
                toolbar: CustomToolbar,
              }}
              disableRowSelectionOnClick
              autoHeight={false}
            />
          </div>
        </Box>
      </Box>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            backgroundColor: "white",
            padding: 3,
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Edit Extra Days
          </h2>

          <Grid container spacing={2}>
            <Grid item xs={12}>
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
                <InputLabel>Extra Days (0-4)</InputLabel>
                <OutlinedInput
                  value={extraDays}
                  onChange={(e) => setExtraDays(Number(e.target.value))}
                  label="Extra Days (0-4)"
                  type="number"
                  inputProps={{ min: 0, max: 4 }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} textAlign="center">
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateExtraDays}
                style={{ marginTop: "10px", backgroundColor: "#1547bd" }}
              >
                Update
              </Button>
            </Grid>
          </Grid>
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

export default FixedSalary;
