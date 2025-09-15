import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import {
  DataGrid,
//   GridToolbar,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import { phpBaseURL } from "./../config";
import { DatePicker } from "antd";
import dayjs from "dayjs";

const EdspSummary = () =>{
    const [data, setData] = useState([]);
    const [monthYear, setMonthYear] = useState(dayjs().subtract(1, "month"));

    const fetchData = async () => {
        const date = new Date(monthYear);
        const formattedMonthYear = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;
        const response = await fetch(`${phpBaseURL}/edsp_summary.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            month: formattedMonthYear,
          }),
        });
    
        const dataF = await response.json();
        let rowsWithId = dataF.data?.map((row, index) => ({
          ...row,
          id: index + 1,
        }));
        setData(rowsWithId || []);
    };

    useEffect(() => {
        fetchData();
    }, [monthYear]);

    const handleMonthYearChange = (date) => {
        setMonthYear(date);
    };
    const disabledDate = (current) => {
        return (
          current &&
          dayjs(current).isAfter(dayjs().endOf("month").subtract(1, "month"))
        );
    };

    const columns = [
        { field: "id", headerName: "Sr No.",
            flex: 0.5,
        },
        { field: "Month", headerName: "Month",
            flex: 0.5,
         },
        { field: "station_code", headerName: "Station Code",
            flex: 0.5,
         },
        { field: "initial_salary", headerName: "Initial Salary",
            flex: 0.5,
         },
        { field: "cash_short", headerName: "Cash Short", flex: 0.5, },
        { field: "package_loss", headerName: "Package Loss", flex: 0.5, },
        { field: "slp", headerName: "SLP", flex: 0.5, },
        { field: "total_salary", headerName: "Total Salary", flex: 0.5, },
    ].filter(Boolean);

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
                <Box display="flex" alignItems="center">
                    <Box flexGrow={1}>
                        <div className="flex items-center"></div>
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
            
                <Box
                    m="20px 0 0 0"
                    height="70vh"
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
                    <div style={{ height: "70vh", maxWidth: "75vw" }}>
                        <DataGrid
                        rows={data}
                        columns={columns}
                        slots={{
                            toolbar: CustomToolbar,
                        }}
                        disableRowSelectionOnClick
                        autoHeight={false}
                        />
                    </div>
                </Box>
            </Box>
        </div>
    );
}

export default EdspSummary;