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
                setData([]);
                for (const item of rateCardData) {
                    const response = await fetch(`${phpBaseURL}/vehical_count.php`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ station: item.Station_Code, month_yr : monthYear }),
                    });
                    const fetchedData = await response.json();
                    const formattedData = fetchedData.map((dataItem, index) => ({
                        ...dataItem,
                        id:  idCounter++,
                        station_code: item.Station_Code,
                    }));
                    setData((prevData) => [...prevData, ...formattedData]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
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


    const columns = [
      {
        field: "id",
        headerName: "Sr No.",
        width: 80,
        sortable: false,
        renderCell: (params) =>
          params.api.getSortedRowIds().indexOf(params.id) + 1,
      },
      { field: "station_code", headerName: "Station Code", width: 150 },
      { field: "data", headerName: "Data", width: 150 },
      { field: "bike_a", headerName: "Bike A", width: 100 },
      { field: "bike_b", headerName: "Bike B", width: 100 },
      { field: "bike_c", headerName: "Bike C", width: 100 },
      { field: "bike_d", headerName: "Bike D", width: 100 },
      { field: "van_a", headerName: "Van A", width: 100 },
      { field: "van_b", headerName: "Van B", width: 100 },
      { field: "van_c", headerName: "Van C", width: 100 },
      { field: "van_d", headerName: "Van D", width: 100 },
      { field: "evan_a", headerName: "Evan A", width: 100 },
      { field: "evan_b", headerName: "Evan B", width: 100 },
      { field: "evan_c", headerName: "Evan C", width: 100 },
      { field: "evan_d", headerName: "Evan D", width: 100 },
      { field: "vandcd_a", headerName: "Vandcd A", width: 100 },
      { field: "vandcd_b", headerName: "Vandcd B", width: 100 },
      { field: "vandcd_c", headerName: "Vandcd C", width: 100 },
      { field: "vandcd_d", headerName: "Vandcd D", width: 100 },
      { field: "total", headerName: "Total", width: 100 },
    ];


    //   console.log(data);

      const getCellClassName = (params) => {
            const colField = params.field;
            const row = params.row;
            if (colField !== "id") {
                if (row.data === "Supervisor") {
                    const invoiceRow = data.find(item => item.station_code === row.station_code && item.data === "Invoice");
                    if (invoiceRow) {
                        const colValue = parseFloat(row[colField]);
                        const invoiceValue = parseFloat(invoiceRow[colField]);
                        // console.log(colValue,invoiceValue);
                        if (!isNaN(colValue) && !isNaN(invoiceValue) && colValue > invoiceValue) {
                            return "even-greater-cell";
                        }
                    }
                }
            }
            return "";
        };



  return (
    <div>
        <Box m="20px">
            {/* <Header
                category="CONTACTS"
                title="List of Contacts for Future Reference"
            /> */}
            <DatePicker
                  picker="month"
                  onChange={handleMonthYearChange}
                  className="h-10"
                  value={monthYear}
                  disabledDate={disabledDate}
                  style={{ backgroundColor: 'white' }}
                  isClear = "false"
                />
            <Box
                m="20px 0 0 0"
                height="80vh"
                width="75vw"
                sx={{
                    overflowX: "auto",
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
                    "& .even-greater-cell": {
                        backgroundColor: "#d40303",
                        color: "white",
                    },
                }}
            >
                <DataGrid
                    rows={data}
                    columns={columns}
                    components={{ Toolbar: GridToolbar }}
                    disableRowSelectionOnClick
                    getCellClassName={getCellClassName}
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


// import React, { useState, useEffect } from "react";
// import { Box } from "@mui/material";
// import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import { styled } from "@mui/material/styles";
// import {
//   Select,
//   MenuItem,
//   OutlinedInput,
//   FormControl,
//   InputLabel,
//   TableContainer,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   Paper,
//   TablePagination,
//   Button,
//   TextField
// } from "@mui/material";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { baseURL } from './../config';

// const Map = () => {
//     const [data, setData] = useState([]);

//     const fetchData = async () => {
//         const user = JSON.parse(sessionStorage.getItem("user-info"));
//         const response = await fetch(`${baseURL}/vehical_count`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ station: user.city, }),
//         });

//         const dataF = await response.json();
//         const data1 = [{ id: 1, ...dataF}];
//         setData(data1);
//     };
//     useEffect(() => {
//         fetchData();
//     }, []);

//     const columns = [
//         {
//             field: "id",
//             headerName: "Sr No.",
//             flex: 0.2,
//         },
//         {
//             field: "station_code",
//             headerName: "Station Code",
//             flex: 1,
//             // width: 180,
//         },
//         {
//             field: "amazon_bike_a",
//             headerName: "Amazon Bike A",
//             flex: 1,
//         },
//         {
//             field: "bike_a_count",
//             headerName: "Bike A",
//             flex: 1,
//         },
//         {
//             field: "amazon_bike_b",
//             headerName: "Amazon Bike B",
//             flex: 1,
//         },
//         {
//             field: "bike_b_count",
//             headerName: "Bike B",
//             flex: 1,
//         },
//         {
//             field: "amazon_bike_c",
//             headerName: "Amazon Bike C",
//             flex: 1,
//         },
//         {
//             field: "bike_c_count",
//             headerName: "Bike C",
//             flex: 1,
//         },
//         {
//             field: "amazon_van_a",
//             headerName: "Amazon Van A",
//             flex: 1,
//         },
//         {
//             field: "sp_van_a_count",
//             headerName: "Van A",
//             flex: 1,
//         },
//         {
//             field: "amazon_van_b",
//             headerName: "Amazon Van B",
//             flex: 1,
//         },
//         {
//             field: "sp_van_b_count",
//             headerName: "Van B",
//             flex: 1,
//         },
//         {
//             field: "amazon_Evan_a",
//             headerName: "Amazon Evan A",
//             flex: 1,
//         },
//         {
//             field: "ev_van_a_count",
//             headerName: "Evan A",
//             flex: 1,
//         },
//         {
//             field: "amazon_Evan_b",
//             headerName: "Amazon Evan B",
//             flex: 1,
//         },
//         {
//             field: "ev_van_b_count",
//             headerName: "Evan B",
//             flex: 1,
//         },
//         {
//             field: "amazon_Vandcd_a",
//             headerName: "Amazon Vandcd A",
//             flex: 1,
//         },
//         {
//             field: "vancd_a_count",
//             headerName: "Vandcd A",
//             flex: 1,
//         },
//         {
//             field: "amazon_Vandcd_b",
//             headerName: "Amazon Vandcd B",
//             flex: 1,
//         },
//         {
//             field: "vancd_b_count",
//             headerName: "Vandcd B",
//             flex: 1,
//         },
//       ];

//   return (
//     <div>
//         <Box m="20px">
//             {/* <Header
//                 category="CONTACTS"
//                 title="List of Contacts for Future Reference"
//             /> */}
//             <Box
//                 m="20px 0 0 0"
//                 height="80vh"
//                 width="100%"
//                 sx={{
//                     "& .MuiDataGrid-root": {
//                         border: "none",
//                     },
//                     "& .MuiDataGrid-cell": {
//                         borderBottom: "none",
//                     },
//                     "& .name-column--cell": {
//                         color: "black",
//                     },
//                     "& .MuiDataGrid-columnHeaders": {
//                         color: "white",
//                         backgroundColor: "#1547bd",
//                         borderBottom: "none",
//                     },
//                     "& .MuiDataGrid-virtualScroller": {
//                         backgroundColor: "white",
//                     },
//                     "& .MuiDataGrid-footerContainer": {
//                         borderTop: "none",
//                         color: "white",
//                         backgroundColor: "#1547bd",
//                     },
//                     "& .MuiCheckbox-root": {
//                         color: `#1547bd !important`,
//                     },
//                     "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
//                         color: `#1547bd !important`,
//                     },
//                     "& .MuiTablePagination-toolbar" : {
//                       backgroundColor: "#1547bd",
//                       color: "white",
//                     },
//                 }}
//             >
//                 <DataGrid
//                     rows={data}
//                     columns={columns}
//                     components={{ Toolbar: GridToolbar }}
//                     disableRowSelectionOnClick
//                 />
//             </Box>
//         </Box>
//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//         theme="colored"
//         />
//     </div>
//   );
// }

// export default Map;
