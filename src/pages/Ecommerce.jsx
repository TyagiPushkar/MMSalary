import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../style/Map.css";
import { baseURL, phpBaseURL} from "./../config";
import { Button } from "@mui/material";
import { FaEye, FaDownload, FaUpload, FaSpinner } from "react-icons/fa";
import defaultStationFile from "../data/StationFile.xlsx";
import * as xlsx from "xlsx";
import dayjs from "dayjs";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(sessionStorage.getItem("user-info"));
  const [monthYear, setMonthYear] = useState(dayjs().subtract(1, "month"));
  const [selectedOfficeId, setSelectedOfficeId] = useState("");
  const officeIds = user.officeid.includes(",")
    ? user.officeid.split(",").map((id) => id.trim())
    : [user.officeid];

  const handleFileInputChange = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (!file) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        // `${baseURL}/api/upload_excel_monthly_consolidate`,
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

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        // `${baseURL}/api/upload_excel_mmmm_daily_blast`,
        `${phpBaseURL}/upload_excel_mmmm_daily_blast.php`,
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

  const handleStationFile = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (!file) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("location", selectedOfficeId || user.officeid);

      // const response = await fetch(`${baseURL}/api/upload_excel_statiob_file`, {
      const response = await fetch(`${phpBaseURL}/upload_excel_statiob_file.php`, {
        method: "POST",
        body: formData,
      });

      // if (response.ok) {
      //   toast.success(data.message);
      // } else {
      //   toast.error(data.detail || "Upload failed");
      // }

      if (response.ok) {
        toast.success(response.message);
      } else {
        toast.error(response.detail || "Upload failed");
      }

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
          toast.error("Error during salary calculation.");
        }
      }, 2000);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file");
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

      // const response = await fetch(`${baseURL}/api/upload_dsp_loss`, {
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

      // const response = await fetch(`${baseURL}/api/upload_dsp_cash_short`, {
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

      // const response = await fetch(`${baseURL}/api/dsp_rate_card`, {
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
      const worksheet = xlsx.utils.json_to_sheet(jsonData);
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      const buffer = xlsx.write(workbook, { bookType: "xlsx", type: "buffer" });
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "dsp_rate_card.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

      toast.success("File downloaded successfully");
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
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <FaSpinner className="text-white animate-spin" size={40} />
          </div>
        )}

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
                  // accept=".csv"
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
                  // accept=".CSV"
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
                  // accept=".csv"
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
                  // accept=".csv"
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
