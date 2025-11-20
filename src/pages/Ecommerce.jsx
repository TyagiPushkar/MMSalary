import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../style/Map.css";
import { baseURL, phpBaseURL } from "./../config";
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Typography, 
  Box, 
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from "@mui/material";
import { FaEye, FaDownload, FaUpload, FaSpinner, FaTimes, FaExclamationTriangle, FaFileCsv } from "react-icons/fa";
import defaultStationFile from "../data/StationFile.xlsx";
import * as xlsx from "xlsx";
import dayjs from "dayjs";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [uploadSummary, setUploadSummary] = useState({});
  const user = JSON.parse(sessionStorage.getItem("user-info"));
  const [monthYear, setMonthYear] = useState(dayjs().subtract(1, "month"));
  const [selectedOfficeId, setSelectedOfficeId] = useState("");
  const officeIds = user.officeid.includes(",")
    ? user.officeid.split(",").map((id) => id.trim())
    : [user.officeid];

  // Validation Errors Popup Modal Component
  const ValidationErrorModal = () => (
    <Dialog 
      open={showErrorModal} 
      onClose={() => setShowErrorModal(false)}
      maxWidth="lg"
      fullWidth
      scroll="paper"
      PaperProps={{
        style: {
          minHeight: '600px',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle style={{ backgroundColor: '#fef2f2', borderBottom: '1px solid #fecaca' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <FaExclamationTriangle style={{ color: '#dc2626', marginRight: '8px' }} />
            <Typography variant="h6" component="span" style={{ color: '#dc2626', fontWeight: 'bold' }}>
              File Validation Failed
            </Typography>
          </Box>
          <Button 
            onClick={() => setShowErrorModal(false)} 
            size="small"
            style={{ minWidth: 'auto' }}
          >
            <FaTimes />
          </Button>
        </Box>
      </DialogTitle>
      
      <DialogContent style={{ padding: 0 }}>
        {/* Upload Summary */}
        {uploadSummary && (uploadSummary.total_rows_processed || uploadSummary.successful_rows !== undefined) && (
          <Paper elevation={1} style={{ margin: '16px', padding: '16px', backgroundColor: '#fffbeb', border: '1px solid #fcd34d' }}>
            <Typography variant="subtitle1" style={{ fontWeight: 'bold', color: '#92400e', marginBottom: '8px' }}>
              Upload Summary
            </Typography>
            <Box display="flex" gap={4} flexWrap="wrap">
              {uploadSummary.total_rows_processed !== undefined && (
                <Typography variant="body2" style={{ color: '#374151' }}>
                  <strong>Total Rows Processed:</strong> {uploadSummary.total_rows_processed}
                </Typography>
              )}
              {uploadSummary.successful_rows !== undefined && (
                <Chip 
                  label={`Successful Rows: ${uploadSummary.successful_rows}`}
                  variant="outlined"
                  style={{ color: '#166534', borderColor: '#16a34a' }}
                />
              )}
              <Chip 
                label={`Validation Errors: ${validationErrors.length}`}
                variant="outlined"
                style={{ color: '#dc2626', borderColor: '#dc2626' }}
              />
              {uploadSummary.failed_rows !== undefined && (
                <Chip 
                  label={`Failed Rows: ${uploadSummary.failed_rows}`}
                  variant="outlined"
                  style={{ color: '#dc2626', borderColor: '#dc2626' }}
                />
              )}
            </Box>
          </Paper>
        )}

        {/* Errors List */}
        <Box style={{ padding: '16px' }}>
          <Typography variant="subtitle2" style={{ fontWeight: 'bold', color: '#374151', marginBottom: '12px' }}>
            Detailed Validation Errors ({validationErrors.length} errors found):
          </Typography>
          
          <TableContainer 
            component={Paper} 
            style={{ 
              maxHeight: '400px', 
              border: '1px solid #e5e7eb',
              overflow: 'auto'
            }}
          >
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f9fafb' }}>
                    Row Number
                  </TableCell>
                  <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f9fafb' }}>
                    Error Reason
                  </TableCell>
                  <TableCell style={{ fontWeight: 'bold', backgroundColor: '#f9fafb' }}>
                    Additional Information
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {validationErrors.map((error, index) => (
                  <TableRow 
                    key={index} 
                    style={{ 
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc'
                    }}
                  >
                    <TableCell style={{ fontWeight: 'medium', color: '#dc2626' }}>
                      {error.row || 'N/A'}
                    </TableCell>
                    <TableCell style={{ color: '#374151' }}>
                      {error.reason || 'Unknown error'}
                    </TableCell>
                    <TableCell style={{ color: '#6b7280' }}>
                      <Box>
                        {error.emp_code && (
                          <div>
                            <strong>Employee Code:</strong> {error.emp_code}
                          </div>
                        )}
                        {error.field && (
                          <div>
                            <strong>Field:</strong> {error.field}
                          </div>
                        )}
                        {error.value && (
                          <div>
                            <strong>Value:</strong> {error.value}
                          </div>
                        )}
                        {!error.emp_code && !error.field && !error.value && (
                          <span style={{ color: '#9ca3af' }}>No additional information</span>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          
        </Box>
      </DialogContent>
      
      <DialogActions style={{ borderTop: '1px solid #e5e7eb', padding: '16px' }}>
        <Button 
          onClick={() => setShowErrorModal(false)} 
          variant="outlined" 
          color="primary"
          style={{ marginRight: '8px' }}
        >
          Close
        </Button>
        {/* <Button 
          onClick={downloadErrorReport} 
          variant="contained" 
          color="secondary"
          startIcon={<FaFileCsv />}
          disabled={validationErrors.length === 0}
        >
          Download Error Report
        </Button> */}
      </DialogActions>
    </Dialog>
  );

  // Function to download error report as CSV
  const downloadErrorReport = () => {
    if (validationErrors.length === 0) return;

    const csvHeaders = ['Row Number', 'Error Reason', 'Employee Code', 'Field', 'Value'];
    const csvData = validationErrors.map(error => [
      error.row || '',
      `"${(error.reason || '').replace(/"/g, '""')}"`,
      error.emp_code || '',
      error.field || '',
      error.value || ''
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `validation_errors_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.info("Error report downloaded successfully");
  };

  // Updated handleStationFile function
  const handleStationFile = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (!file) return;

    try {
      setLoading(true);
      setValidationErrors([]);
      setUploadSummary({});

      const formData = new FormData();
      formData.append("file", file);
      formData.append("location", selectedOfficeId || user.officeid);

      const response = await fetch(`${phpBaseURL}/upload_excel_statiob_file.php`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        // Success case - but might have validation warnings
        if (data.validation_errors && data.validation_errors.length > 0) {
          // File processed but with validation errors
          setValidationErrors(data.validation_errors);
          setUploadSummary({
            total_rows_processed: data.total_rows_processed,
            successful_rows: data.total_rows_processed - data.validation_errors.length,
            failed_rows: data.validation_errors.length
          });
          setShowErrorModal(true);
          
          toast.warning(
            `File processed with ${data.validation_errors.length} validation errors. ${data.total_rows_processed - data.validation_errors.length} rows successful.`
          );
        } else {
          // Complete success
          toast.success(data.message || "File uploaded successfully");
        }

        // Proceed with salary calculation after successful upload
        setTimeout(async () => {
          const month = parseInt(monthYear.format("M"), 10).toString();
          const year = monthYear.format("YYYY");

          const salaryData = {
            month: month,
            year: year,
            station: selectedOfficeId || user.officeid,
          };

          try {
            const salaryResponse = await fetch(`${phpBaseURL}/salary_calculation.php`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(salaryData),
            });

            if (salaryResponse.ok) {
              toast.success("Salary calculation completed.");
            } else {
              const salaryError = await salaryResponse.json();
              toast.error(`Salary calculation failed: ${salaryError.message}`);
            }
          } catch (err) {
            console.error("Error during salary calculation:", err);
            toast.error("Error during salary calculation.");
          }
        }, 2000);

      } else {
        // Error case - validation failed completely
        if (data.validation_errors && data.validation_errors.length > 0) {
          setValidationErrors(data.validation_errors);
          setUploadSummary({
            total_rows_processed: data.total_rows_processed,
            successful_rows: 0,
            failed_rows: data.validation_errors.length
          });
          setShowErrorModal(true);
          
          toast.error(
            `Validation failed: ${data.validation_errors.length} errors found. No data inserted.`
          );
        } else {
          toast.error(data.detail || "Upload failed");
        }
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file");
    } finally {
      setLoading(false);
      fileInput.value = "";
    }
  };

  // All other file handling functions remain the same
  const handleFileInputChange = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (!file) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${phpBaseURL}/upload_excel_monthly_consolidate.php`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
      } else {
        toast.error(data.detail);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file");
    } finally {
      setLoading(false);
      fileInput.value = "";
    }
  };

  const handleDSPFile = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (!file) return;

    try {
      setLoading(true);

      // Show progress indicator for large files
      if (file.size > 5 * 1024 * 1024) {
        // 5MB
        toast.info("Processing large file, please wait...");
      }

      const formData = new FormData();
      formData.append("file", file);

      // Add timeout for large files
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes

      const response = await fetch(
        `${phpBaseURL}/upload_excel_mmmm_daily_blast.php`,
        {
          method: "POST",
          body: formData,
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        if (data.failed > 0) {
          toast.warning(`${data.failed} rows failed to process`);
        }
      } else {
        toast.error(data.detail || "Upload failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      if (error.name === "AbortError") {
        toast.error("Upload timeout - file too large");
      } else {
        toast.error("Error uploading file in backend");
      }
    } finally {
      setLoading(false);
      fileInput.value = "";
    }
  };

  const handleDSPLoss = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (!file) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${phpBaseURL}/upload_dsp_loss.php`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
      } else {
        toast.error(data.detail);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file");
    } finally {
      setLoading(false);
      fileInput.value = "";
    }
  };

  const handleCashShort = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (!file) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${phpBaseURL}/upload_dsp_cash_short.php`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        fetch(`${phpBaseURL}/total_cash_short_sum.php`);
      } else {
        toast.error(data.detail);
        console.error(data);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file");
    } finally {
      setLoading(false);
      fileInput.value = "";
    }
  };

  const handleRateCard = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (!file) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${phpBaseURL}/upload_dsp_rate_card.php`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
      } else {
        toast.error(data.detail);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file");
    } finally {
      setLoading(false);
      fileInput.value = "";
    }
  };

  const downloadFile = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${phpBaseURL}/dsp_rate_card.php`);
      const jsonData = await response.json();

      if (!Array.isArray(jsonData) || jsonData.length === 0) {
        toast.error("No data available for download");
        setLoading(false);
        return;
      }

      // Define the desired column order, including the new Z columns
      const columnOrder = [
        "Station_Code",
        "Bike_A",
        "Bike_B",
        "Bike_C",
        "Bike_D",
        "Van_A",
        "Van_B",
        "Van_C",
        "Van_D",
        "Van_Z",
        "Van_DCD_A",
        "Van_DCD_B",
        "Van_DCD_C",
        "Van_DCD_D",
        "Van_DCD_Z",
        "E_Van_A",
        "E_Van_B",
        "E_Van_C",
        "E_Van_D",
        "E_Van_Z",
      ];

      // Reorder columns based on the desired sequence
      const orderedData = jsonData.map((row) => {
        const orderedRow = {};
        columnOrder.forEach((col) => {
          orderedRow[col] = row[col] !== undefined ? row[col] : "";
        });
        return orderedRow;
      });

      // Create Excel sheet
      const worksheet = xlsx.utils.json_to_sheet(orderedData);
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, "Rate Card");

      // Download file
      xlsx.writeFile(workbook, "dsp_rate_card.xlsx");

      toast.success("Rate Card downloaded successfully");
    } catch (error) {
      console.error("Error downloading file: ", error);
      toast.error("Error downloading file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <FaSpinner className="text-white animate-spin" size={40} />
          </div>
        )}

        {/* Validation Error Modal */}
        <ValidationErrorModal />

        {user && user.officeid === "HO" && (
          <>
            <div
              className="mt-0 mb-5 m-2 mr-10 ml-10 p-4 bg-gray-300 dark:bg-black rounded-2xl flex justify-between"
              style={{
                background: "#e7e9ec",
              }}
            >
              <div style={{ flex: 1 }}>
                <label htmlFor="monthlyReport" className="text-black b ml-20">
                  Monthly report
                </label>
              </div>
              <div style={{ flex: 1, right: 0 }}>
                <input
                  id="monthlyReport"
                  type="file"
                  accept=".xlsx"
                  onChange={handleFileInputChange}
                  style={{ display: "none" }}
                />
                <Button
                  component="label"
                  htmlFor="monthlyReport"
                  variant="outlined"
                  color="primary"
                >
                  Upload <FaUpload style={{ marginRight: "5px" }} />
                </Button>
              </div>
            </div>

            <div
              className="mt-0 mb-5 m-2 mr-10 ml-10 p-4 bg-gray-300 dark:bg-black rounded-2xl flex justify-between"
              style={{
                background: "#e7e9ec",
              }}
            >
              <div style={{ flex: 1 }}>
                <label htmlFor="dspReport" className="text-black b ml-20">
                  DSP Slot
                </label>
              </div>
              <div style={{ flex: 1, right: 0 }}>
                <input
                  id="dspReport"
                  type="file"
                  accept=".xlsx"
                  onChange={handleDSPFile}
                  style={{ display: "none" }}
                />
                <Button
                  component="label"
                  htmlFor="dspReport"
                  variant="outlined"
                  color="primary"
                >
                  Upload <FaUpload style={{ marginRight: "5px" }} />
                </Button>
              </div>
            </div>

            <div
              className="mt-0 mb-5 m-2 mr-10 ml-10 p-4 bg-gray-300 dark:bg-black rounded-2xl flex justify-between"
              style={{
                background: "#e7e9ec",
              }}
            >
              <div style={{ flex: 1 }}>
                <label htmlFor="dspLoss" className="text-black b ml-20">
                  DSP Loss
                </label>
              </div>
              <div style={{ flex: 1, right: 0 }}>
                <input
                  id="dspLoss"
                  type="file"
                  accept=".xlsx"
                  onChange={handleDSPLoss}
                  style={{ display: "none" }}
                />
                <Button
                  component="label"
                  htmlFor="dspLoss"
                  variant="outlined"
                  color="primary"
                >
                  Upload <FaUpload style={{ marginRight: "5px" }} />
                </Button>
              </div>
            </div>

            <div
              className="mt-0 mb-5 m-2 mr-10 ml-10 p-4 bg-gray-300 dark:bg-black rounded-2xl flex justify-between"
              style={{
                background: "#e7e9ec",
              }}
            >
              <div style={{ flex: 1 }}>
                <label htmlFor="cashShort" className="text-black b ml-20">
                  Cash Short
                </label>
              </div>
              <div style={{ flex: 1, right: 0 }}>
                <input
                  id="cashShort"
                  type="file"
                  accept=".xlsx"
                  onChange={handleCashShort}
                  style={{ display: "none" }}
                />
                <Button
                  component="label"
                  htmlFor="cashShort"
                  variant="outlined"
                  color="primary"
                >
                  Upload <FaUpload style={{ marginRight: "5px" }} />
                </Button>
              </div>
            </div>

            <div
              className="mt-0 mb-5 m-2 mr-10 ml-10 p-4 bg-gray-300 dark:bg-black rounded-2xl flex justify-between"
              style={{
                background: "#e7e9ec",
              }}
            >
              <div style={{ flex: 1 }}>
                <label htmlFor="rateCard" className="text-black b ml-20">
                  Rate Card
                </label>
              </div>
              <div style={{ flex: 1, right: 0 }}>
                <input
                  id="rateCard"
                  type="file"
                  accept=".xlsx"
                  onChange={handleRateCard}
                  style={{ display: "none" }}
                />
                <Button
                  component="label"
                  htmlFor="rateCard"
                  variant="outlined"
                  color="primary"
                >
                  Upload <FaUpload style={{ marginRight: "5px" }} />
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ marginLeft: "20px" }}
                  onClick={downloadFile}
                >
                  Download
                </Button>
              </div>
            </div>
          </>
        )}
        {user && user.officeid !== "HO" && (
          <div
            className="mt-0 mb-5 m-2 mr-10 ml-10 p-4 bg-gray-300 dark:bg-black rounded-2xl flex justify-between"
            style={{ background: "#e7e9ec" }}
          >
            <div style={{ flex: 1 }}>
              <label htmlFor="stationFile" className="text-black b ml-20">
                Station File
              </label>
            </div>
            <div
              style={{
                flex: 1,
                right: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              {officeIds.length > 1 && (
                <select
                  value={selectedOfficeId}
                  onChange={(e) => setSelectedOfficeId(e.target.value)}
                  style={{
                    marginRight: "20px",
                    padding: "6px",
                    borderRadius: "5px",
                  }}
                >
                  <option value="">Select Office ID</option>
                  {officeIds.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
              )}
              <input
                id="stationFile"
                type="file"
                accept=".xlsx"
                onChange={handleStationFile}
                style={{ display: "none" }}
              />
              <Button
                component="label"
                htmlFor="stationFile"
                variant="outlined"
                color="primary"
              >
                Upload <FaUpload style={{ marginRight: "5px" }} />
              </Button>
              <a href={defaultStationFile} download="StationFile.xlsx">
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ marginLeft: "20px" }}
                >
                  Download
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
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

export default Home;