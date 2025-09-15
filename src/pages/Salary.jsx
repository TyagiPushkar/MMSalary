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

const Salary = () => {
  const [data, setData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [monthYear, setMonthYear] = useState(dayjs().subtract(1, "month"));
  const [filterOption, setFilterOption] = useState("All");
  const user = JSON.parse(sessionStorage.getItem("user-info"));
  const[ viewMode, setViewMode ] = useState("summary");

  const fetchData = async () => {
    const month = parseInt(monthYear.format("M"), 10).toString();
    const year = monthYear.format("YYYY");

    const response = await fetch(`${phpBaseURL}/total_salary.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ month: month, year: year }),
    });

    const dataF = await response.json();

    if (dataF !== null) {
      const dataWithTotalSalary = dataF.map((row, index) => ({
        index: index + 1,
        ...row,
        account_no: row.account_no !== null && row.account_no !== undefined ? String(row.account_no) : "",
        total_salary:
          (row.intial_salary || 0) -
          (row.cash_short || 0) -
          (row.package_loss || 0) -
          (row.advanced_recovery),
      }));

      setData(dataWithTotalSalary);
      let srno = 1;
      setSummaryData(
        dataWithTotalSalary.reduce((acc, curr) => {
          const index = acc.findIndex(
            (item) => item.station_code === curr.station_code
          );
          if (index === -1) {
            acc.push({
              id: srno++,
              station_code: curr.station_code,
              intial_salary: curr.intial_salary,
              cash_short: curr.cash_short,
              package_loss: curr.package_loss,
              advanced_recovery: curr.advanced_recovery,
              total_salary: curr.total_salary,
            });
          } else {
            acc[index].intial_salary += curr.intial_salary;
            acc[index].cash_short += curr.cash_short;
            acc[index].package_loss += curr.package_loss;
            acc[index].advanced_recovery += curr.advanced_recovery;
            acc[index].total_salary += curr.total_salary;
          }
          return acc;
        }, [])
      );
    } else {
      setData();
    }
  };
  useEffect(() => {
    fetchData();
  }, [monthYear]);

  const columns = [
    {
      field: "index",
      headerName: "Sr No.",
      flex: 0.5,
    },
    {
      field: "station_code",
      headerName: "Station Code",
      flex: 1,
    },
    {
      field: "amazon_lm_id",
      headerName: "Amazon Id",
      flex: 1,
      cellClassName: "amazonId",
    },
    {
      field: "emp_code",
      headerName: "M&M Id",
      flex: 2,
      cellClassName: "mmId",
    },
    {
      field: "employee_name",
      headerName: "Name",
      flex: 2,
      cellClassName: "name-column--cell",
    },
    {
      field: "account_no",
      headerName: "Account No",
      flex: 2,
      cellClassName: "accountNo",
    },
    {
      field: "ifsc_code",
      headerName: "IFSC Code ",
      flex: 2,
      cellClassName: "ifscCode",
    },
    {
      field: "intial_salary",
      headerName: "Salary",
      flex: 1,
      cellClassName: "salary",
    },
    {
      field: "cash_short",
      headerName: "Cash Short",
      flex: 1,
      cellClassName: "cashShort",
    },
    {
      field: "package_loss",
      headerName: "Package Loss",
      flex: 1,
      cellClassName: "packageLoss",
    },
    {
      field: "advanced_recovery",
      headerName: "Advanced Recovery",
      flex: 1,
      cellClassName: "advancedRecovery",
    },
    {
      field: "total_salary",
      headerName: "Total Salary",
      flex: 1,
      cellClassName: "totalSalary",
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
    {
      field: "intial_salary",
      headerName: "Salary",
      flex: 1,
      cellClassName: "salary",
    },
    {
      field: "cash_short",
      headerName: "Cash Short",
      flex: 1,
      cellClassName: "cashShort",
    },
    {
      field: "advanced_recovery",
      headerName: "Advanced Recovery",
      flex: 1,
      cellClassName: "cashShort",
    },
    {
      field: "package_loss",
      headerName: "Package Loss",
      flex: 1,
      cellClassName: "packageLoss",
    },
    {
      field: "total_salary",
      headerName: "Total Salary",
      flex: 1,
      cellClassName: "totalSalary",
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
          <Box>
            <DatePicker
              picker="month"
              onChange={handleMonthYearChange}
              className="h-10"
              value={monthYear}
              disabledDate={disabledDate}
              style={{ backgroundColor: "white" }}
              allowClear={false}
            />
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
            {/* <DataGrid
              rows={data}
              columns={columns}
              slots={{
                toolbar: CustomToolbar,
              }}
              disableRowSelectionOnClick
            /> */}
            <DataGrid
              rows={data}
              columns={columns}
              slots={{
                toolbar: CustomToolbar,
              }}
              getRowId={(row) => row.index} // ensure row ID is stable
              disableRowSelectionOnClick
              slotProps={{
                toolbar: {
                  csvOptions: {
                    getRowsToExport: (rows) =>
                      rows.map((row) => ({
                        ...row,
                        account_no: `="${row.account_no}"`, // wrap in ="" to preserve leading zeros
                      })),
                  },
                },
              }}
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
                toolbar: CustomToolbar,
              }}
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

export default Salary;