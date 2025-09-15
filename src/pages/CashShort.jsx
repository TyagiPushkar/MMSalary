import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import {
  DataGrid,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL, phpBaseURL } from "./../config";
import { sum } from "@syncfusion/ej2/heatmap";
import { DatePicker } from "antd";
import dayjs from "dayjs";

const CashShort = () => {
  const [totalCashShort, setTotalCashShort] = useState(0);
  const [totalSum, setTotalSum] = useState(0);
  const [recoveryAmount, setRecoveryAmount] = useState(0);
  const [employees, setEmployees] = useState([]);
  const [stationData, setStationData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const user = JSON.parse(sessionStorage.getItem("user-info"));
  const [monthYear, setMonthYear] = useState(dayjs().subtract(1, "month"));

  const fetchData = async () => {
    const month = parseInt(monthYear.format("M"), 10).toString();
    const year = monthYear.format("YYYY");

    try {
      // const response = await fetch(`${phpBaseURL}/total_salary.php`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ month: month, year: year }),
      // });

      // if (!response.ok) {
      //   throw new Error("Failed to fetch employee data");
      // }

      // const data = await response.json();
      // if (user.officeid !== "HO") {
      //   const filteredEmployeeData = data.filter(
      //     (emp) => emp.station_code === user.officeid
      //   );
      //   setEmployeeData(filteredEmployeeData);
      // } else {
      //   setEmployeeData(data);
      // }

      const response = await fetch(`${phpBaseURL}/get_employee_data.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ officeId: user.officeid, type: 'dsp' }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch employee data");
      }

      const data = await response.json();
      setEmployeeData(data.data);
      

      const cashShortResponse = await fetch(
        `${phpBaseURL}/show_station_cash_short.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            { 
              month: month, year: year,
              officeId: user.officeid
            }),
        }
      );
      if (cashShortResponse.ok) {
        const cashShortData = await cashShortResponse.json();
        const sortedData = [...cashShortData].sort((a, b) =>
          a.station_code.localeCompare(b.station_code)
        );
        const cashShortSumByStation = {};

        cashShortData.forEach((item) => {
          cashShortSumByStation[item.station_code] = item.recover_cash_short;
        });

        const formattedData = sortedData.map((row, index) => ({
          index: index + 1,
          ...row,
          recover_cash_short: row.recover_cash_short,
          pending_cash_short:
            -(row.total_cash_short + (row.recover_cash_short || 0)),
        }));
        setStationData(formattedData);
        setTotalSum(
          cashShortData.reduce(
            (sum, station) => sum + station.total_cash_short,
            0
          )
        );
        const officeCashShort = cashShortData.find(
          (item) => item.station_code === user.officeid && item.status === 0
        );
        if (officeCashShort) {
          setTotalCashShort(officeCashShort.total_cash_short);
          setRecoveryAmount(officeCashShort.recover_cash_short);
        }
      } else {
        throw new Error("Failed to fetch total cash short sum");
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user.officeid, monthYear]);

  const handleAddEmployee = () => {
    const month = parseInt(monthYear.format("M"), 10).toString();
    const year = monthYear.format("YYYY");
    setEmployees([
      ...employees,
      {
        advanced_recovery: "",
        cash_short: "",
        station_code: user.officeid,
        mm_code: "",
        name: "",
        cash_short_remark:"",
        month: month,
        year: year,
      },
    ]);
  };

  const handleRemoveEmployee = (index) => {
    setEmployees(employees.filter((_, i) => i !== index));
  };

  const handleEmployeeChange = (index, field, value) => {
    const updatedEmployees = [...employees];
    updatedEmployees[index][field] = value;

    const totalCashShortInput = updatedEmployees.reduce((sum, employee) => {
      return sum + (parseFloat(employee.cash_short) || 0);
    }, 0);

    setRecoveryAmount(totalCashShortInput);

    const selectedEmployee = employeeData.find((emp) => emp.mmCode === value);
    if (selectedEmployee) {
      updatedEmployees[index].name = selectedEmployee.name;
    }
    setEmployees(updatedEmployees);
  };

  const handleSubmit = async () => {
    if (employees.length < 1) {
      toast.warning("Please add at least one employee");
      return;
    }

    const hasNullData = employees.some(
      (employee) => employee.cash_short === "" || employee.mm_code === ""
    );
    if (hasNullData) {
      toast.warning("Please fill in all employee data");
      return;
    }

    if (recoveryAmount > -totalCashShort) {
      toast.warning("Recovery amount exceeds remaining amount!");
      return;
    }

    if(-(totalCashShort + recoveryAmount) != 0){
      toast.warning("Recovery amount should equal zero!");
      return;
    }

    try {
      const response = await fetch(`${phpBaseURL}/receive_cash_short_data.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employees),
      });

      const month = parseInt(monthYear.format("M"), 10).toString();
      const year = monthYear.format("YYYY");

      const response1 = await fetch(`${phpBaseURL}/update_total_cash_short.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month: month,
          year: year,
          station_code: user.officeid,
          recover_amount: recoveryAmount,
        }),
      });

      if (response.ok && response1.ok) {
        toast.success("Upload Data Successfully");
        setEmployees([]);
        fetchData();
        setTotalCashShort(0);
        setRecoveryAmount(0);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Failed to submit data");
    }
  };

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
      field: "total_cash_short",
      headerName: "Cash Short",
      flex: 1,
    },
    {
      field: "recover_cash_short",
      headerName: "Recovered Amount",
      flex: 1,
    },
    {
      field: "pending_cash_short",
      headerName: "Remaining Amount",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => {
        return params.value === 1 ? "Recovered" : "Not Recovered";
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
      {user && user.officeid !== "HO" && !user.officeid.includes(",") && (
        <>
          <Box
            className="mt-0 mb-5 m-2 mr-10 ml-10 p-4 bg-gray-300 dark:bg-black rounded-2xl flex justify-between"
            style={{
              background: "#1547bd",
            }}
          >
            <div style={{ flex: 1 }}>
              <label
                htmlFor="cashShort"
                className="text-white font-bold ml-1 text-24"
              >
                Total Cash Short: {totalCashShort}
              </label>
            </div>
            <div style={{ flex: 1 }}>
              <label
                htmlFor="cashShort"
                className="text-white font-bold ml-1 text-24"
              >
                Remaining Recovery Amount: {-(totalCashShort + recoveryAmount)}
              </label>
            </div>
            <div
              style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}
            >
              <Button
                variant="contained"
                onClick={handleAddEmployee}
                style={{ color: "#1547bd", backgroundColor: "white" }}
              >
                Add Employee
              </Button>
            </div>
          </Box>

          {employees.map((employee, index) => (
            <Box
              key={index}
              className="mt-0 mb-5 m-2 mr-10 ml-10 p-4 bg-gray-300 dark:bg-black rounded-2xl flex justify-between"
              style={{
                background: "#1547bd",
              }}
            >
              <div style={{ flex: 1 }}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  className="formControl"
                  sx={{
                    ".MuiInputLabel-root.Mui-focused": {
                      color: "lightgrey !iimportant",
                    },
                    ".MuiSvgIcon-root ": {
                      fill: "white !important",
                    },
                  }}
                >
                  <InputLabel>Name</InputLabel>
                  <Select
                    value={employee.mmCode}
                    style={{ color: "white" }}
                    onChange={(e) =>
                      handleEmployeeChange(index, "mm_code", e.target.value)
                    }
                    input={<OutlinedInput label="Name: " />}
                  >
                    {employeeData.map((data) => (
                      <MenuItem key={data.emp_code} value={data.emp_code}>
                        {data.employee_name} ({data.emp_code})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div style={{ flex: 1 }}>
                <TextField
                  label="Cash Short"
                  value={employee.cashShort}
                  InputProps={{
                    style: { color: "white" },
                  }}
                  style={{ marginLeft: "40px", marginRight: "40px" }}
                  onChange={(e) =>
                    handleEmployeeChange(index, "cash_short", e.target.value)
                  }
                />
              </div>
              <div style={{ flex: 1 }}>
                <TextField
                  label="Advanced Recovery"
                  value={employee.advancedRecovery}
                  InputProps={{
                    style: { color: "white" },
                  }}
                  style={{ marginLeft: "40px", marginRight: "40px" }}
                  onChange={(e) =>
                    handleEmployeeChange(
                      index,
                      "advanced_recovery",
                      e.target.value
                    )
                  }
                />
              </div>
              <div style={{ flex: 1 }}>
                <TextField
                  label="Remark"
                  value={employee.cash_short_remark}
                  InputProps={{
                    style: { color: "white" },
                  }}
                  style={{ marginLeft: "40px", marginRight: "40px" }}
                  onChange={(e) =>
                    handleEmployeeChange(index, "cash_short_remark", e.target.value)
                  }
                />
              </div>
              <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleRemoveEmployee(index)}
                >
                  Remove
                </Button>
              </div>
            </Box>
          ))}

          <div style={{ textAlign: "center" }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              style={{ backgroundColor: "#1547bd" }}
            >
              Submit
            </Button>
          </div>
        </>
      )}

      {user && (user.officeid === "HO" || user.officeid.includes(",")) && (
        <>
          <Box m="20px">
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
                rows={stationData}
                columns={columns}
                slots={{
                  toolbar: CustomToolbar,
                }}
                disableRowSelectionOnClick
              />
            </Box>
          </Box>
        </>
      )}
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

export default CashShort;
