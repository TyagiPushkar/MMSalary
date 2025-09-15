import React, { useState, useEffect } from "react";
import { Box, Modal, Button, TextField } from "@mui/material";
import {
  DataGrid,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL, phpBaseURL } from './../config';
import { DatePicker } from "antd";
import dayjs from 'dayjs';

const Map = () => {
    const [data, setData] = useState([]);
    const [monthYear, setMonthYear] = useState(dayjs().subtract(1, 'month'));
    const [selectedRow, setSelectedRow] = useState(null);
    const [submitData, setSubmitData] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const fetchData = async () => {
        const month = parseInt(monthYear.format('M'), 10).toString();
        const year = monthYear.format('YYYY');

        const user = JSON.parse(sessionStorage.getItem("user-info"));
        const response = await fetch(`${phpBaseURL}/employee_cash_short_show.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month: month, year: year }),
        });

        const dataF = await response.json();
        if(dataF !== null){
            const data1 = dataF.map((row, index) => ({ index: index + 1, ...row }));
            setData(data1);
        }else{
            setData([]);
        }
    };

    useEffect(() => {
        fetchData();
    }, [monthYear]);

    const handleMonthYearChange = (date) => {
        setMonthYear(date);
    };

    const disabledDate = (current) => {
        return current && dayjs(current).isAfter(dayjs().endOf("month").subtract(1, "month"));
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
            field: "employee_name",
            headerName: "Name",
            flex: 2,
            cellClassName: "name-column--cell",
        },
        {
            field: "employee_id",
            headerName: "Emp Id",
            flex: 1,
            cellClassName: "empId"
        },
        {
            field: "total_short_cash",
            headerName: "Total Cash Short",
            flex: 1,
        },
    ];

    const handleRowClick = (params) => {
        setSelectedRow(params.row);
        const { id, asignd_employee_id, asignd_employee_name, TTlink } = params.row;
        setSubmitData(prevState => ({ ...prevState, id, asignd_employee_id, asignd_employee_name, TTlink }));
        setOpenModal(true);
    };


    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleAsigndEmployeeIdChange = (e) => {
        setSubmitData(prevState => ({ ...prevState, asignd_employee_id: e.target.value }));
    };

    const handleAsigndEmployeeNameChange = (e) => {
        setSubmitData(prevState => ({ ...prevState, asignd_employee_name: e.target.value }));
    };

    const handleTTLinkChange = (e) => {
        setSubmitData(prevState => ({ ...prevState, TTlink: e.target.value }));
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch(
              `${phpBaseURL}/update_employee_cash_short.php`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(submitData),
              }
            );

            if (response.ok) {
                toast.success("Data updated successfully!");
                fetchData();
                setOpenModal(false);
            } else {
                toast.error("Failed to update data!");
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("An error occurred while updating data!");
        }
    };

    return (
        <div>
            <Box m="20px">
            <DatePicker
                  picker="month"
                  onChange={handleMonthYearChange}
                  className="h-10"
                  value={monthYear}
                  disabledDate={disabledDate}
                  style={{ backgroundColor: 'white' }}
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
                        "& .MuiTablePagination-toolbar" : {
                        backgroundColor: "#1547bd",
                        color: "white",
                        },
                        "& .MuiSelect-icon" : {
                            color: "white",
                        },
                        "& .MuiDataGrid-sortIcon" : {
                            color: "white",
                        },
                        "& .MuiIconButton-root" : {
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
                        // onRowClick={handleRowClick}
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
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 600,
                        bgcolor: '#1547bd',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    {/* <h2 id="modal-modal-title" style={{ color: "white", justifyContent: "cenetr"}}>Assign Employee</h2> */}
                    {selectedRow && (
                        <>
                            <div style={{ color: "white", margin: "10px 0px 10px 0px"}}>
                                <p><strong>Station Code:</strong> {selectedRow.station_code}</p>
                                <p><strong>Name:</strong> {selectedRow.employee_name}</p>
                                <p><strong>Emp ID:</strong> {selectedRow.employee_id}</p>
                                <p><strong>Total Cash Short:</strong> {selectedRow.total_short_cash}</p>
                            </div>
                            <TextField
                                label="Assigned Employee ID"
                                fullWidth
                                sx={{ margin: "10px 0px 10px 0px" }}
                                value={submitData?.asignd_employee_id || ""}
                                onChange={handleAsigndEmployeeIdChange}
                            />

                            <TextField
                                label="Assigned Employee Name"
                                fullWidth
                                sx={{ margin: "10px 0px 10px 0px" }}
                                value={submitData?.asignd_employee_name || ""}
                                onChange={handleAsigndEmployeeNameChange}
                            />

                            <TextField
                                label="Remarks"
                                fullWidth
                                sx={{ margin: "10px 0px 10px 0px" }}
                                value={submitData?.TTlink || ""}
                                onChange={handleTTLinkChange}
                            />
                            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    style={{ color: "#1547bd", backgroundColor: "whitesmoke" }}
                                >
                                    Submit
                                </Button>
                            </div>
                        </>
                    )}
                </Box>
            </Modal>
        </div>
    );
}

export default Map;
