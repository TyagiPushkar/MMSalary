import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import RegistrationForm from "../components/Add_employe_form";

export const AddEmployee = () => {
  const user = JSON.parse(sessionStorage.getItem("user-info")) || {};
  const [employees, setEmployees] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [officeFilter, setOfficeFilter] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  // API call
  useEffect(() => {
    axios
      .get(
        `https://namami-infotech.com/MMSalary/Register/fetch_employee.php?officeid=${user.officeid}`,
      )
      .then((res) => {
        setEmployees(res.data.data);
        setFilteredData(res.data.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSearch = () => {
    const data = employees.filter((emp) => {
      return (
        emp.name.toLowerCase().includes(searchName.toLowerCase()) &&
        (officeFilter === "" || emp.officeid === officeFilter)
      );
    });
    setFilteredData(data);
  };

  const handleDelete = (id) => {
    setFilteredData(filteredData.filter((emp) => emp.id !== id));
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
      headerClassName: "bold-header",
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      headerClassName: "bold-header",
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 1,
      headerClassName: "bold-header",
    },
    {
      field: "officeid",
      headerName: "Office",
      flex: 1,
      headerClassName: "bold-header",
    },
    {
      field: "location",
      headerName: "Location",
      flex: 1,
      headerClassName: "bold-header",
    },
    {
      field: "employee_role",
      headerName: "Role",
      flex: 1,
      headerClassName: "bold-header",
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.5,
      headerClassName: "bold-header",
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button size="small" variant="contained">
            View
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setOpenModal(true)}
          >
            Add
          </Button>
          <Button
            size="small"
            color="error"
            variant="contained"
            onClick={() => handleDelete(params.row.id)}
          >
            Remove
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 2, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Filters */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 2,
          backgroundColor: "#fff",
          p: 2,
          borderRadius: 2,
          border: "1px solid #ddd",
          alignItems: "center",
        }}
      >
        <TextField
          size="small"
          label="Search Name"
          variant="outlined"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />

        <FormControl size="small" sx={{ minWidth: 150 }} variant="outlined">
          <InputLabel>Office</InputLabel>
          <Select
            value={officeFilter}
            label="Office"
            onChange={(e) => setOfficeFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="NAMAMI">NAMAMI</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained">Search</Button>
      </Box>

      {/* Table */}
      <Box
        sx={{
          height: 450,
          backgroundColor: "#fff",
          borderRadius: 2,
        }}
      >
        <DataGrid
          rows={filteredData}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          sx={{
            "& .bold-header": {
              fontWeight: "bold",
            },
          }}
        />
      </Box>

      {/* Modal for Registration Form */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>Add Employee Registration</span>
            <IconButton onClick={() => setOpenModal(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <RegistrationForm onClose={() => setOpenModal(false)} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};
