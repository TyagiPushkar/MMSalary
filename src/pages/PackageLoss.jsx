import React, { useState, useEffect, useRef } from "react";
import { Box, Button } from "@mui/material";
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
  Typography,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL, phpBaseURL } from "./../config";
import { DatePicker } from "antd";
import dayjs from "dayjs";

const Package = () => {
  const [data, setData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const user = JSON.parse(sessionStorage.getItem("user-info"));
  const [monthYear, setMonthYear] = useState(dayjs().subtract(1, "month"));
  const [viewMode, setViewMode] = useState("detailed");
  const fetchData1Called = useRef(false);

  const fetchData = async () => {
    // const response = await fetch(`${phpBaseURL}/dsp_loss.php`, {
    //   method: "GET",
    //   headers: { "Content-Type": "application/json" },
    // });
    const month = parseInt(monthYear.format("M"), 10).toString();
    const year = monthYear.format("YYYY");
    
    const response = await fetch(`${phpBaseURL}/dsp_loss2.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ month: month, year: year }),
    });

    const dataF = await response.json();
    let filteredData = dataF;

    if (monthYear) {
      filteredData = dataF.filter((row) => {
        const rowDate = dayjs(row.upload_month);
        return (
          rowDate.month() === monthYear.month() &&
          rowDate.year() === monthYear.year()
        );
      });
    }
    // let srno = 1;
    // let recover_package_loss = 0;
    // setSummaryData(
    //   filteredData.reduce((acc, curr) => {
    //     const index = acc.findIndex(
    //       (item) => item.delivery_station_code === curr.delivery_station_code
    //     );
        
    //     if (index === -1) {
    //       if(curr.mm_code != null){
    //         recover_package_loss = curr.value;
    //       }
    //       else{
    //         recover_package_loss = 0;
    //       }
    //       acc.push({
    //         id: srno++,
    //         delivery_station_code: curr.delivery_station_code,
    //         totalValue: curr.value,
    //         recover_package_loss: recover_package_loss
    //       });
    //     } else {
    //       if(curr.mm_code != null){
    //         recover_package_loss += curr.value;
    //       }
    //       acc[index].totalValue += curr.value;
    //       acc[index].recover_package_loss = recover_package_loss;
    //     }
    //     return acc;
    //   }, [])
    // );

    let filteredEmployeeData = filteredData;
    if (user.officeid !== "HO") {
      const officeIds = user.officeid.split(",");
      filteredEmployeeData = filteredEmployeeData.filter((emp) =>
        officeIds.includes(emp.delivery_station_code)
      );
    }
    const data1 = filteredEmployeeData.map((row, index) => ({
      index: index + 1,
      ...row,
    }));
    setData(data1);
  };

  const fetchSummaryData = async () => {
    const month = parseInt(monthYear.format("M"), 10).toString();
    const year = monthYear.format("YYYY");
    
    const response = await fetch(`${phpBaseURL}/fetch_dsp_package_loss_summary.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ month: month, year: year }),
    });

    const dataF = await response.json();
    let formattedData = dataF.map((row) => ({
        ...row,
        pending_package_loss:
          row.totalValue - row.recover_package_loss,
      }));
    // console.log(formattedData);
    
    setSummaryData(formattedData);
  }

  useEffect(() => {
    fetchData();
    fetchSummaryData();
  }, [monthYear]);

  useEffect(() => {
    if (summaryData.length > 0) {
      fetchData1(); // Trigger the fetchData1 only when summaryData is updated
    }
  }, [summaryData]); // This effect will run every time summaryData is updated

  const fetchData1 = async () => {
    if (fetchData1Called.current) return;
    fetchData1Called.current = true;
    const month = parseInt(monthYear.format("M"), 10).toString();
    const year = monthYear.format("YYYY");
    try {
      const response = await fetch(`${phpBaseURL}/total_salary.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month: month, year: year }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch employee data");
      }

      const data = await response.json();
      let filteredEmployeeData = data;

      if (user.officeid !== "HO") {
        const officeIds = user.officeid.split(",");
        filteredEmployeeData = filteredEmployeeData.filter((emp) =>
          officeIds.includes(emp.station_code)
        );
      }

      // const packageLossByStation = {};
      // summaryData.forEach((packageLossItem) => {
      //   const { delivery_station_code } = packageLossItem;
      //   const filteredData = data.filter(
      //     (item) => item.station_code === delivery_station_code
      //   );
      //   const sumPackageLoss = filteredData.reduce(
      //     (acc, curr) => acc + curr.package_loss,
      //     0
      //   );
      //   packageLossByStation[delivery_station_code] = sumPackageLoss;
      // });

      // let formattedData = summaryData.map((row) => ({
      //   ...row,
      //   // recover_package_loss:
      //   //   packageLossByStation[row.delivery_station_code] || 0,
      //   // pending_package_loss:
      //   //   row.totalValue - packageLossByStation[row.delivery_station_code] || 0,
      //   pending_package_loss:
      //     row.totalValue - row.recover_package_loss,
      // }));

      // if (user.officeid !== "HO") {
      //   const officeIds = user.officeid.split(",");
      //   formattedData = formattedData.filter((emp) =>
      //     officeIds.includes(emp.delivery_station_code)
      //   );
      // }

      // setSummaryData(formattedData);

      // setEmployeeData(filteredEmployeeData);

      const response1 = await fetch(`${phpBaseURL}/get_employee_data.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ officeId: user.officeid, type: 'dsp' }),
      });

      if (!response1.ok) {
        throw new Error("Failed to fetch employee data");
      }

      const data1 = await response1.json();
      setEmployeeData(data1.data);

    } catch (error) {
      console.error("Error fetching employee data:", error);
    } 
  };

  const handleSave = async (rowId, selectedOption) => {
    const rowData = data.find((row) => row.id === rowId);
    const selectedEmployee = employeeData.find(
      (emp) => emp.emp_code === selectedOption
    );
    const month = parseInt(monthYear.format("M"), 10).toString();
    const year = monthYear.format("YYYY");
    const requestBody = {
      station_code: selectedEmployee.station_code,
      mm_code: selectedEmployee.emp_code,
      name: selectedEmployee.employee_name,
      tracking_id: rowData.tracking_id,
      month: month,
      year: year,
    };

    try {
      const response = await fetch(`${phpBaseURL}/update_package_loss.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        fetchData();
        toast.success(
          `Saved Employee "${selectedOption}" for Tracking Id ${rowId.tracking_id}`
        );
      } else {
        toast.error(`Failed to save option for row ${rowId}`);
      }
    } catch (error) {
      fetchData();
      console.error(error);
      toast.error(
        `Network error occurred while saving option for row ${rowId}`
      );
    }
  };

  const columns = [
    {
      field: "index",
      headerName: "Sr No.",
      flex: 0.5,
    },
    {
      field: "tracking_id",
      headerName: "Tracking Id",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "delivery_station_code",
      headerName: "Station Code",
      flex: 1,
    },
    {
      field: "upload_month",
      headerName: "Upload Month",
      flex: 1,
    },
    {
      field: "value",
      headerName: "Value",
      flex: 1,
    },
    {
      field: "da_name",
      headerName: "Name",
      flex: 2,
      cellClassName: "name-column--cell",
    },
    {
      field: "name",
      headerName: "Recover Name",
      flex: 1,
      renderCell: (params) => {
        if (params.row.name === null) {
          // const filteredEmployees = employeeData.filter(
          //   (employee) =>
          //     employee.station_code === params.row.delivery_station_code
          // );
          const filteredEmployees = employeeData;
          if (user.officeid !== "HO") {
            return (
              <div style={{ width: "100%" }}>
                <FormControl
                  fullWidth
                  variant="standard"
                  className="formControl"
                  sx={{
                    ".MuiInputLabel-root.Mui-focused": {
                      color: "lightgrey !important",
                    },
                    ".MuiSvgIcon-root ": {
                      fill: "black !important",
                    },
                  }}
                >
                  <InputLabel style={{ color: "black" }}>Select</InputLabel>
                  <Select
                    fullWidth
                    value={params.row.dropdownValue || ""}
                    onChange={(event) => {
                      const value = event.target.value;
                      const newData = data.map((row) =>
                        row.id === params.row.id
                          ? { ...row, dropdownValue: value }
                          : row
                      );
                      setData(newData);
                    }}
                    sx={{ color: "black" }}
                  >
                    {filteredEmployees
                      .sort((a, b) =>
                        a.employee_name.localeCompare(b.employee_name)
                      )
                      .map((employee) => (
                        <MenuItem key={employee.id} value={employee.emp_code}>
                          {employee.employee_name} ({employee.emp_code})
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>
            );
          } else {
            return "NA";
          }
        } else {
          return params.row.name;
        }
      },
    },
    {
      field: "mm_code",
      headerName: "Emp Code",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => {
        if (params.row.name !== null && params.row.name !== "None") {
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
          if (user.officeid !== "HO") {
            return (
              <Button
                variant="outlined"
                onClick={() =>
                  handleSave(params.row.id, params.row.dropdownValue)
                }
              >
                Save
              </Button>
            );
          } else {
            return "Pending";
          }
        }
      },
    },
  ];

  const columnsSummary = [
    { field: "id", headerName: "Sr No.", flex: 0.5 },
    {
      field: "delivery_station_code",
      headerName: "Station Code",
      flex: 1,
    },
    { field: "totalValue", headerName: "Total Package Loss", flex: 1 },
    { field: "recover_package_loss", headerName: "Recovered Amount", flex: 1 },
    { field: "pending_package_loss", headerName: "Remaining Amount", flex: 1 },
  ];

  const handleMonthYearChange = (date) => {
    setMonthYear(date);
    setData([]);
    fetchData();
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
        {(user.officeid === "HO" || user.officeid.includes(",")) && (
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
        )}
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
            }}
          >
            <DataGrid
              rows={summaryData}
              columns={columnsSummary}
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

export default Package;
