import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import {
  DataGrid,
  GridToolbar,
  GridToolbarQuickFilter,
  GridToolbarContainer,
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
import { baseURL, phpBaseURL} from "./../config";

const Map = () => {
  const [data, setData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [filterOption, setFilterOption] = useState("All");
  const [viewMode, setViewMode] = useState("summary");

  const fetchData = async () => {
    const user = JSON.parse(sessionStorage.getItem("user-info"));
    const response = await fetch(`${phpBaseURL}/consiled_file.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "super" }) /*user.type*/,
    });

    const dataF = await response.json();
    if (dataF !== null) {
      const data1 = dataF
        .sort((a, b) => a.station_code.localeCompare(b.station_code))
        .map((row, index) => ({ id: index + 1, ...row }));
      setData(data1);
      let id = 1;
      const summary = data1.reduce((acc, row) => {
        if (!acc[row.station_code]) {
          acc[row.station_code] = {
            id: id++,
            station_code: row.station_code,
            employee_id_count: 0,
            empid: 0,
            amazon_id_count: 0,
            amazonid: 0,
            emp_code_count: 0,
            empcode: 0,
          };
        }
        if (row.employee_id !== "None") {
          acc[row.station_code].employee_id_count++;
        }else{
          acc[row.station_code].empid++;
        }

        if (row["da amazon login id"] !== "None") {
          acc[row.station_code].amazon_id_count++;
        }else {
          acc[row.station_code].amazonid++;
        }

        if (row.emp_code !== "None") {
          acc[row.station_code].emp_code_count++;
        }else {
          acc[row.station_code].empcode++;
        }
        return acc;
      }, {});
      setSummaryData(Object.values(summary));
    } else {
      setData();
      setSummaryData();
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      field: "id",
      headerName: "Sr No.",
      flex: 0.5,
    },
    {
      field: "station_code",
      headerName: "Station Code",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 2,
      cellClassName: "name-column--cell",
    },
    {
      field: "mm_name",
      headerName: "M&M Name",
      flex: 2,
      cellClassName: "name-column--cell",
    },
    // {
    //   field: "employee_id",
    //   headerName: "Emp Id",
    //   flex: 1,
    //   cellClassName: "empId",
    // },
    {
      field: "da amazon login id",
      headerName: "LM Id",
      flex: 1,
      cellClassName: "amazonId",
    },
    {
      field: "emp_code",
      headerName: "MM Id",
      flex: 1,
      cellClassName: "mmId",
    },
  ];

  const summaryColumns = [
    {
      field: "id",
      headerName: "Sr No.",
      flex: 0.5,
    },
    {
      field: "station_code",
      headerName: "Station Code",
      flex: 1,
    },
    // {
    //   field: "employee_id_count",
    //   headerName: "No. of Employee ID",
    //   flex: 1,
    // },
    // {
    //   field: "empid",
    //   headerName: "Not Employee ID",
    //   flex: 1,
    // },
    {
      field: "amazon_id_count",
      headerName: "No. of LM ID",
      flex: 1,
    },
    {
      field: "amazonid",
      headerName: "LM Id having zero salary",
      flex: 1,
    },
    {
      field: "emp_code_count",
      headerName: "No. of MM ID",
      flex: 1,
    },
    {
      field: "empcode",
      headerName: "MM Id not having LM Id",
      flex: 1,
    },
  ];

  const handleFilterChange = (event) => {
    setFilterOption(event.target.value);
  };

  const filteredData =
    filterOption === "Salary"
      ? data.filter(
          (row) =>
            row["da amazon login id"] !== "None" && row["emp_code"] !== "None"
        )
      : filterOption === "Not Salary"
      ? data.filter(
          (row) =>
            row["da amazon login id"] !== "None" && row["emp_code"] === "None"
        )
      : filterOption === "All"
      ? data
      : data;

  function CustomToolbar() {
    return (
      <GridToolbarContainer
        sx={{
          padding: "5px",
        }}
      >
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
        <Select
          value={filterOption}
          onChange={handleFilterChange}
          displayEmpty
          sx={{
            minWidth: 120,
            borderRadius: 4,
            borderWidth: "2px",
            borderColor: "#1547bd",
            color: "#1547bd",
            "& .MuiSelect-select": {
              padding: "5px",
            },
            "& .MuiSvgIcon-root": {
              color: "#1547bd",
            },
          }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Salary">Salary</MenuItem>
          <MenuItem value="Not Salary">Not Salary</MenuItem>
        </Select>
        <Box sx={{ flexGrow: 1 }} />
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
  }

  function CustomToolbarSummary() {
    return (
      <GridToolbarContainer
        sx={{
          padding: "5px",
        }}
      >
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
        <Box sx={{ flexGrow: 1 }} />
        <GridToolbarQuickFilter />
      </GridToolbarContainer>
    );
  }

  const summaryButtonStyle =
    viewMode === "summary"
      ? { textDecoration: "underline", color: "#1547bd", fontSize: "20px" }
      : { color: "gray", fontSize: "12px" };

  const detailedButtonStyle =
    viewMode === "detailed"
      ? { textDecoration: "underline", color: "#1547bd", fontSize: "20px" }
      : { color: "gray", fontSize: "12px" };

  return (
    <div>
      <Box m="20px">
        {/* <Header
                category="CONTACTS"
                title="List of Contacts for Future Reference"
            /> */}
        <Box display="flex" alignItems="center">
          <Box flexGrow={1}>
            <div className="flex items-center">
              <button
                style={summaryButtonStyle}
                onClick={() => setViewMode("summary")}
              >
                Summary
              </button>
              <span className="mx-2 text-black"> </span>
              <button
                style={detailedButtonStyle}
                onClick={() => setViewMode("detailed")}
              >
                Detailed
              </button>
            </div>
          </Box>
        </Box>
        {viewMode === "detailed" && (
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
              // "& .none-row .amazonId": {
              //     backgroundColor: "red",
              //     color: "white"
              // }
            }}
          >
            <DataGrid
              rows={filteredData ? filteredData : ""}
              columns={columns}
              slots={{
                toolbar: CustomToolbar,
              }}
              disableRowSelectionOnClick
            />
          </Box>
        )}
        {viewMode === "summary" && (
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
              // "& .none-row .amazonId": {
              //     backgroundColor: "red",
              //     color: "white"
              // }
            }}
          >
            <DataGrid
              rows={summaryData}
              columns={summaryColumns}
              slots={{
                toolbar: CustomToolbarSummary,
              }}
              // omponents={{ Toolbar: GridToolbar }}
              disableRowSelectionOnClick
            />
          </Box>
        )}
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

export default Map;
