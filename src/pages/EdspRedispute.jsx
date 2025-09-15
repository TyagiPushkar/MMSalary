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
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL, phpBaseURL } from "./../config";
import { DatePicker } from "antd";
import dayjs from "dayjs";

const EdspRedispute = () => {
  const [data, setData] = useState([]);
  const [monthYear, setMonthYear] = useState(dayjs().subtract(1, "month"));
  const [stationCodes, setStationCodes] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [caseNumber, setCaseNumber] = useState("");
  const [recoveryStationFromNLT, setRecoveryStationFromNLT] = useState("");
  const [actualRecoveryStatusFromStation, setActualRecoveryStatusFromStation] = useState("");
  const [selectedStation, setSelectedStation] = useState("all");

  useEffect(() => {
    const fetchStationCodes = async () => {
      try {
        // const response = await fetch(`${baseURL}/api/fetch_all_station_codes`);
        const response = await fetch(`${phpBaseURL}/fetch_all_station_codes.php`);
        const result = await response.json();
        setStationCodes(result.station_codes);
      } catch (error) {
        console.error("Error fetching station codes:", error);
        toast.error("Failed to fetch station codes.");
      }
    };

    fetchStationCodes();
  }, []);

  const fetchData = async () => {
    const date = new Date(monthYear);
    const formattedMonthYear = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
    const user = JSON.parse(sessionStorage.getItem("user-info"));
    // const response = await fetch(`${baseURL}/api/fetch_edsp_redispute`, {
      const response = await fetch(`${phpBaseURL}/fetch_edsp_redispute.php`, {
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

  useEffect(() => {
    fetchData();
  }, [monthYear, selectedStation]);

  const handleEditClick = async (row) => {
    setSelectedRow(row);
    setOpenModal(true);
    setCaseNumber("");
    setRecoveryStationFromNLT("");
    setActualRecoveryStatusFromStation("");
  };

  const handleSave = async () => {
    const rowData = data.find((row) => row.id === selectedRow.id);
    if (!caseNumber || caseNumber.trim() === "") {
      toast.error("Case Number is required.");
      return;
    }
    if (!recoveryStationFromNLT || recoveryStationFromNLT.trim() === "") {
      toast.error("Recovery Station From NLT is required.");
      return;
    }
    if (!actualRecoveryStatusFromStation || actualRecoveryStatusFromStation.trim() === "") {
      toast.error("Actual Recovery Status From Station is required.");
      return;
    }
    const requestBody = {
      trackingId: rowData.trackingId,
      caseNumber: caseNumber,
      recoveryStationFromNLT: recoveryStationFromNLT,
      actualRecoveryStatusFromStation: actualRecoveryStatusFromStation
    };

    // console.log(JSON.stringify(requestBody));

    try {
      const response = await fetch(`${phpBaseURL}/update_edsp_redispute.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        toast.success("Redispute update successfully!");
        fetchData();
        setOpenModal(false);
      } else {
        toast.error("Failed to update redispute data.");
      }
    } catch (error) {
      console.error("Error update data:", error);
      toast.error("Error update data.");
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "Sr No.",
      flex: 0.5,
    },
    {
      field: "Station Code (for EDSPs only)",
      headerName: "Station Code",
      // flex: 2,
      width: 120
    },
    {
      field: "Tracking IDs impacted",
      headerName: "Tracking IDs Impacted",
      // flex: 2,
      width: 150
    },
    {
      field: "Loss Month",
      headerName: "Loss Month",
      // flex: 1,
      width: 120
    },
    {
      field: "Loss Bucket",
      headerName: "Loss Bucket",
      // flex: 1,
      width: 120
    },
    {
      field: "Value",
      headerName: "Value",
      flex: 1,
    },
    {
      field: "Case Number",
      headerName: "Case Number",
      flex: 1,
    },
    {
      field: "Recovery station from NLT",
      headerName: "Recovery station from NLT",
      flex: 1,
    },
    {
      field: "Actual Recovery status from station",
      headerName: "Actual Recovery status from station",
      flex: 1,
    },
    // {
    //   field: "Dispute TT raised by Partner on RIVER tool",
    //   headerName: "Dispute TT by Partner on RIVER",
    //   flex: 1,
    // },
    // {
    //   field: "Response on Dispute TT by Losses Team",
    //   headerName: "Response on Dispute TT by Losses Team",
    //   flex: 1,
    // },
    // {
    //   field: "Dispute Reason (against recoverable losses)",
    //   headerName: "Dispute Reason (against recoverable losses)",
    //   flex: 1,
    // },
    // {
    //   field: "Other TT Details (if available)",
    //   headerName: "Other TT Details (if available)",
    //   flex: 1,
    // },
    // {
    //   field: "Reverse/Orphan Tracking ID",
    //   headerName: "Reverse/Orphan Tracking ID",
    //   flex: 1,
    // },
    // {
    //   field: "Channel Team Remarks",
    //   headerName: "Channel Team Remarks",
    //   flex: 1,
    // },
    // {
    //   field: "Channel Team Feedback",
    //   headerName: "Channel Team Feedback",
    //   flex: 1,
    // },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => {
        if (params.row["Case Number"] !== "") {
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
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Edit Dispute</DialogTitle>
        <DialogContent>
          <TextField
            label="Case Number"
            fullWidth
            value={caseNumber}
            onChange={(e) => setCaseNumber(e.target.value)}
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
            label="Recovery Station From NLT"
            fullWidth
            value={recoveryStationFromNLT}
            onChange={(e) => setRecoveryStationFromNLT(e.target.value)}
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
            <InputLabel>Actual Recovery Status From Station</InputLabel>
            <Select
              value={actualRecoveryStatusFromStation}
              onChange={(e) => setActualRecoveryStatusFromStation(e.target.value)}
              label="Actual Recovery Status From Station"
            >
              <MenuItem value="Recovery">Recovery</MenuItem>
              <MenuItem value="To be recover">To be recover</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button
            onClick={() => {handleSave()}}
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

export default EdspRedispute;
