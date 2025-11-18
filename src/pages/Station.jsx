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

const Station = () => {
  const [data, setData] = useState([]);
  const [monthYear, setMonthYear] = useState(dayjs().subtract(1, "month"));

  const fetchData = async () => {
    const user = JSON.parse(sessionStorage.getItem("user-info"));
    // const response = await fetch(`${baseURL}/api/fetch_station_data`, {
    const response = await fetch(`${phpBaseURL}/fetch_station_data.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ officeid: user.officeid }),
    });

    const dataF = await response.json();
    if (dataF !== null) {
      const filteredData = filterDataByDate(dataF.data, monthYear);
      const data1 = filteredData.map((row, index) => ({
        index: index + 1,
        ...row,
      }));
      setData(data1);
    } else {
      setData();
    }
  };

  const filterDataByDate = (data, date) => {
    return data.filter((item) => {
      return dayjs(item.month_yr).format("YYYY-MM") === date.format("YYYY-MM");
    });
  };


  useEffect(() => {
    fetchData();
  }, [monthYear]);

  const columns = [
    // { field: "id", headerName: "Sr No.", width: 70 },
    { field: "index", headerName: "Sr No.", width: 70 },
    { field: "month_yr", headerName: "MonthYear", width: 110 },
    { field: "location", headerName: "Station Code", width: 130 },
    { field: "emp_code", headerName: "M&M Id", width: 150 },
    { field: "amazon_lm_id", headerName: "Amazon Id", width: 150 },
    {
      field: "employee_name",
      headerName: "Name",
      width: 160,
      cellClassName: "name-column--cell",
    },
    { field: "bike_a", headerName: "Bike A", width: 90 },
    { field: "bike_b", headerName: "Bike B", width: 90 },
    { field: "bike_c", headerName: "Bike C", width: 90 },
    { field: "bike_d", headerName: "Bike D", width: 90 },
    { field: "sp_van_a", headerName: "Van A", width: 90 },
    { field: "sp_van_b", headerName: "Van B", width: 90 },
    { field: "sp_van_c", headerName: "Van C", width: 90 },
    { field: "sp_van_d", headerName: "Van D", width: 90 },
    { field: "sp_van_z", headerName: "Van Z", width: 90 },
    { field: "vancd_a", headerName: "VANDCD A", width: 100 },
    { field: "vancd_b", headerName: "VANDCD B", width: 100 },
    { field: "vancd_c", headerName: "VANDCD C", width: 100 },
    { field: "vancd_d", headerName: "VANDCD D", width: 100 },
    { field: "vancd_z", headerName: "VANDCD Z", width: 100 },
    { field: "ev_van_a", headerName: "EV Van A", width: 100 },
    { field: "ev_van_b", headerName: "EV Van B", width: 100 },
    { field: "ev_van_c", headerName: "EV Van C", width: 100 },
    { field: "ev_van_d", headerName: "EV Van D", width: 100 },
    { field: "ev_van_z", headerName: "EV Van Z", width: 100 },
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
        {/* <Header
                category="CONTACTS"
                title="List of Contacts for Future Reference"
            /> */}
        <DatePicker
          picker="month"
          onChange={handleMonthYearChange}
          className="h-10"
          value={monthYear}
          disabledDate={disabledDate}
          style={{ backgroundColor: "white" }}
          allowClear={false}
        />
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
            // "& .none-row .amazonId": {
            //     backgroundColor: "red",
            //     color: "white"
            // }
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

export default Station;
