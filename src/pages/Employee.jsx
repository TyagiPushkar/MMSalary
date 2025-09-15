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

const Employee = () => {
  const [data, setData] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const [open, setOpen] = useState(false);
  const [newOfficeId, setNewOfficeId] = useState("");
  const [newStationType, setNewStationType] = useState("");

  const fetchData = async () => {
    const user = JSON.parse(sessionStorage.getItem("user-info"));
    const response = await fetch(`${phpBaseURL}/employee.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ officeid: user.officeid }),
    });

    const responseData = await response.json();
    setData(responseData.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    // {
    //   field: "id",
    //   headerName: "Sr No.",
    //   flex: 0.5,
    // },
    {
      field: "admin_name",
      headerName: "Name",
      flex: 2,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 2,
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 2,
    },
    {
      field: "city",
      headerName: "City",
      flex: 2,
    },
    {
      field: "officeid",
      headerName: "Office ID",
      flex: 2,
    },
    {
      field: "station_type",
      headerName: "Station Type",
      flex: 2,
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
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
    setNewOfficeId(row.officeid);
    setNewStationType(row.station_type);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditRow(null);
    setNewOfficeId("");
  };

  const handleUpdate = async () => {
    const { id, email } = editRow;
    const response = await fetch(`${phpBaseURL}/update_officeid.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        email,
        new_officeid: newOfficeId,
        new_station_type: newStationType,
      }),
    });

    const responseData = await response.json();
    if (responseData.status === 200) {
      toast.success(responseData.message);
      fetchData();
      handleClose();
    } else {
      toast.error("Failed to update office ID.");
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
            <Grid item xs={12}>
              <TextField
                label="Name"
                value={editRow?.admin_name || ""}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                value={editRow?.email || ""}
                fullWidth
                disabled
              />
            </Grid>
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
                <InputLabel>Office ID</InputLabel>
                <OutlinedInput
                  value={newOfficeId}
                  onChange={(e) => setNewOfficeId(e.target.value)}
                  label="Office ID"
                />
              </FormControl>
            </Grid>
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
                <InputLabel>Station Type</InputLabel>
                <Select
                  value={newStationType}
                  onChange={(e) => setNewStationType(e.target.value)}
                  label="Station Type"
                >
                  <MenuItem value="EDSP">EDSP</MenuItem>
                  <MenuItem value="DSP">DSP</MenuItem>
                </Select>
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

export default Employee;
