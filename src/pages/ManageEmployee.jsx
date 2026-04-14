import React, { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Button,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  Grid,
  Select,
  MenuItem,
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

const ManageEmployee = () => {
  const [data, setData] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const [open, setOpen] = useState(false);

  const [accountNum, setAccountNum] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [salary, setSalary] = useState("");
  const [fuel, setFuel] = useState("");
  const [phoneCost, setPhoneCost] = useState("");
  const [basic, setBasic] = useState("");
  const [DA, setDA] = useState("");
  const [HRA, setHRA] = useState("");

  const fetchData = async () => {
    const user = JSON.parse(sessionStorage.getItem("user-info"));
    const response = await fetch(
      `${phpBaseURL}/Employee/fetch_employee_byofficeid.php?officeid=${user.officeid}`,
    );

    const responseData = await response.json();
    setData(responseData.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      field: "srNo",
      headerName: "Sr No.",
      width: 80,
      valueGetter: (params) => {
        const allRowIds = params.api.getAllRowIds?.();
        if (!allRowIds) return "";
        return allRowIds.indexOf(params.id) + 1;
      },
      sortable: false,
    },
    { field: "employeeid", headerName: "Employee ID", width: 160 },
    { field: "name", headerName: "Name", width: 150 },
    { field: "phone", headerName: "Phone", width: 120 },
    { field: "officeid", headerName: "Office ID", width: 100 },
    { field: "location", headerName: "Location", width: 120 },
    { field: "employee_role", headerName: "Employee Role", width: 140 },
    { field: "aadhar_number", headerName: "Aadhar Number", width: 150 },
    { field: "pan_card", headerName: "PAN Card", width: 120 },
    {
      field: "driving_license_no",
      headerName: "Driving License No.",
      width: 160,
    },
    { field: "rc_number", headerName: "RC Number", width: 120 },
    { field: "ac_name", headerName: "Account Name", width: 150 },
    { field: "ifsc", headerName: "IFSC", width: 100 },
    { field: "account_num", headerName: "Account Number", width: 150 },
    { field: "salary", headerName: "Salary", width: 100 },
    { field: "amazon_login_id", headerName: "Amazon Login ID", width: 160 },
    {
      field: "action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => (
        <div>
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
        </div>
      ),
    },
  ];

  const handleEdit = (row) => {
    setEditRow(row);
    setAccountNum(row.account_num || "");
    setIfsc(row.ifsc || "");
    setSalary(row.salary || "");
    setFuel(row.fuel || "");
    setPhoneCost(row.phone_cost || "");
    setBasic(row.basic || "");
    setDA(row.DA || "");
    setHRA(row.HRA || "");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditRow(null);
  };

  const handleUpdate = async () => {
    const payload = {
      employeeid: editRow.employeeid,
      account_num: accountNum,
      ifsc: ifsc,
      salary: salary,
      fuel: fuel,
      phone_cost: phoneCost,
      basic: basic,
      DA: DA,
      HRA: HRA,
    };

    // const response = await fetch(`${baseURL}/update_employee_details`, {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(payload),
    // });

    const response = await fetch(`${phpBaseURL}/update_employee_details.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();
    if (responseData.status === 200) {
      toast.success(responseData.message);
      fetchData();
      handleClose();
    } else {
      toast.error("Failed to update employee details.");
    }
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
          m="20px 0 0 0"
          height="80vh"
          width="75vw"
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

      <Modal open={open} onClose={handleClose}>
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
          <h2
            style={{
              marginBottom: "20px",
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
            }}
          >
            Edit Employee
          </h2>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Name"
                value={editRow?.name || ""}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Employee Id"
                value={editRow?.employeeid || ""}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={6}>
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
                <InputLabel>Account Number</InputLabel>
                <OutlinedInput
                  value={accountNum}
                  onChange={(e) => setAccountNum(e.target.value)}
                  label="Account Number"
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
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
                <InputLabel>IFSC</InputLabel>
                <OutlinedInput
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value)}
                  label="IFSC"
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
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
                <InputLabel>Salary</InputLabel>
                <OutlinedInput
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  label="Salary"
                  type="number"
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
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
                <InputLabel>Fuel</InputLabel>
                <OutlinedInput
                  value={fuel}
                  onChange={(e) => setFuel(e.target.value)}
                  label="Fuel"
                  type="number"
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
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
                <InputLabel>Phone Cost</InputLabel>
                <OutlinedInput
                  value={phoneCost}
                  onChange={(e) => setPhoneCost(e.target.value)}
                  label="Phone Cost"
                  type="number"
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
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
                <InputLabel>Basic</InputLabel>
                <OutlinedInput
                  value={basic}
                  onChange={(e) => setBasic(e.target.value)}
                  label="Basic"
                  type="number"
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
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
                <InputLabel>DA</InputLabel>
                <OutlinedInput
                  value={DA}
                  onChange={(e) => setDA(e.target.value)}
                  label="DA"
                  type="number"
                />
              </FormControl>
            </Grid>

            <Grid item xs={6}>
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
                <InputLabel>HRA</InputLabel>
                <OutlinedInput
                  value={HRA}
                  onChange={(e) => setHRA(e.target.value)}
                  label="HRA"
                  type="number"
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} textAlign="center">
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdate}
                style={{ backgroundColor: "#1547bd" }}
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

export default ManageEmployee;
