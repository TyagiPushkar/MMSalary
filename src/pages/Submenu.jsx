import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
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
  TextField
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL, phpBaseURL } from './../config';
import { DatePicker } from "antd";
import dayjs from 'dayjs';

const Map = () => {
    const [data, setData] = useState([]);
    const [monthYear, setMonthYear] = useState(dayjs().subtract(1, 'month'));

    const fetchData = async () => {
    try {
        const rateCardResponse = await fetch(`${phpBaseURL}/dsp_rate_card.php`);
        const rateCardData = await rateCardResponse.json();
        let idCounter = 1;
        for (const item of rateCardData) {
            const response = await fetch(`${phpBaseURL}/slot_count.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ station: item.Station_Code, month_yr : monthYear  }),
            });
            const fetchedData = await response.json();
            const formattedData = {
                ...fetchedData,
                id: idCounter++,
                station_code: item.Station_Code,
            };
            setData((prevData) => [...prevData, formattedData]);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};


    useEffect(() => {
        setData([]);
        fetchData();
    }, [monthYear]);

    const handleMonthYearChange = (date) => {
        setMonthYear(date);
    };

    const disabledDate = (current) => {
        return current && dayjs(current).isAfter(dayjs().endOf("month").subtract(1, "month"));
    };

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
        field: "Amazon Slot Count",
        headerName: "Amazon Slot Count",
        flex: 1,
      },
      {
        field: "M&M Count",
        headerName: "M&M Slot Count",
        flex: 1,
      },
      {
        field: "Slot Difference",
        headerName: "Slot Difference",
        flex: 1,
      },
      {
        field: "Amount Difference",
        headerName: "Amount Difference",
        flex: 1,
      },
      {
        field: "Status",
        headerName: "Status",
        flex: 1,
      },
    ];

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
                  isClear = "false"
                />
            {/* <Header
                category="CONTACTS"
                title="List of Contacts for Future Reference"
            /> */}
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
                    "& .error-row": {
                        backgroundColor: "#d40303",
                        color: "white",
                    },
                    "& .error-row:hover": {
                        color: "black",
                    }
                }}
            >
                <DataGrid
                    rows={data}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                    disableRowSelectionOnClick
                    getRowClassName={(params) =>
                        params.row.Status !== 'Ok' ? 'error-row' : ''
                    }
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
}

export default Map;
