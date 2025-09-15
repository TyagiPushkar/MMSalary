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

const EdspPivotTable = () => {
  const [data, setData] = useState([]);
  const [monthYear, setMonthYear] = useState(dayjs().subtract(1, "month"));
  const [stationCodes, setStationCodes] = useState([]);
  const [selectedStation, setSelectedStation] = useState("all");
  const user = JSON.parse(sessionStorage.getItem("user-info"));

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
    // const response = await fetch(`${baseURL}/api/fetch_edsp_pivot_table`, {
      const response = await fetch(`${phpBaseURL}/fetch_edsp_pivot_table.php`, {
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
    {
      field: "id",
      headerName: "Sr No.",
      flex: 0.5,
    },
    {
      field: "Stn Code",
      headerName: "Station Code",
      // flex: 1,
      width: 100
    },
    {
      field: "Sum of Del Count",
      headerName: "Invoice delivery",
      // flex: 1,
      width: 120
    },
    {
      field: "M&M Delivery Count",
      headerName: "M&M Delivery Count",
      // flex: 1,
      width: 120
    },
    {
      field: "Sum of final_creturn_count",
      headerName: "Invoice C-Return",
      // flex: 1,
      width: 120
    },
    {
      field: "M&M C-Return Count",
      headerName: "M&M C-Return Count",
      // flex: 1,
      width: 120
    },
    {
      field: "Sum of final_mfn_count",
      headerName: "Invoice MFN",
      // flex: 1,
      width: 120
    },
    {
      field: "M&M Mfn Count",
      headerName: "M&M MFN Count",
      // flex: 1,
      width: 100
    },
    {
      field: "Sum of final_seller_returns",
      headerName: "Invoice Seller Returns",
      // flex: 1,
      width: 120
    },
    {
      field: "M&M Seller Count",
      headerName: "M&M Seller Count",
      // flex: 1,
      width: 100
    },
    {
      field: "Total_invoice_pkt",
      headerName: "Total invoice packet",
      // flex: 1,
      width: 100
    },
    {
      field: "Total_mnm_pkt",
      headerName: "Total M&M packet",
      // flex: 1,
      width: 100
    },
    {
      field: "Diff_Invoice_Mnm",
      headerName: "Packet Differnce",
      // flex: 1,
      width: 100
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
          height="75vh"
          width="75vw"
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

export default EdspPivotTable;
