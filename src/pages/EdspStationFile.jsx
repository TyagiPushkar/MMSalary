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
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL, phpBaseURL } from "./../config";
import { DatePicker } from "antd";
import dayjs from "dayjs";

const EdspStationFile = () => {
  const [data, setData] = useState([]);
  const [monthYear, setMonthYear] = useState(dayjs().subtract(1, "month"));
  const [stationCodes, setStationCodes] = useState([]);
  const [selectedStation, setSelectedStation] = useState("");
  const user = JSON.parse(sessionStorage.getItem("user-info"));

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

  const fetchData = async () => {
    const date = new Date(monthYear);
    const formattedMonthYear = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
    const user = JSON.parse(sessionStorage.getItem("user-info"));
    // const response = await fetch(`${baseURL}/api/fetch_edsp_station_data`, {
    const response = await fetch(`${phpBaseURL}/fetch_edsp_station_data.php`, {
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

  const columns = [
    { field: "id", headerName: "Sr No.", width: 70 },
    { field: "Stn Code", headerName: "Station Code", width: 120 },
    { field: "AMAZON ID", headerName: "AMAZON ID", width: 130 },
    { field: "Employee Id", headerName: "Employee Id", width: 130 },
    { field: "Employee Name", headerName: "Employee Name", width: 160 },
    { field: "ACCOUNT NO", headerName: "Account No", width: 150 },
    { field: "IFSC", headerName: "IFSC", width: 100 },
    { field: "Bike Del Pkt", headerName: "Bike Del Pkt", width: 130 },
    { field: "Bike C-Ret Pkt", headerName: "Bike C-Ret Pkt", width: 140 },
    { field: "Van Del Pkt", headerName: "Van Del Pkt", width: 130 },
    { field: "Van C-Ret Pkt", headerName: "Van C-Ret Pkt", width: 140 },
    { field: "MFN Pkt", headerName: "MFN Pkt", width: 110 },
    { field: "Seller Ret Pkt", headerName: "Seller Ret Pkt", width: 140 },
    { field: "Deduction", headerName: "Deduction", width: 120 },
    { field: "Fule", headerName: "Fuel", width: 100 },
    { field: "Driver", headerName: "Driver", width: 100 },
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
          width="75vw"
          sx={{
            overflowX: "auto",
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

export default EdspStationFile;
