import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../style/Map.css";
import { baseURL, phpBaseURL } from "./../config";
import { Button } from "@mui/material";
import { FaEye, FaDownload, FaUpload, FaSpinner } from "react-icons/fa";
import * as xlsx from "xlsx";
import dayjs from "dayjs";
import defaultStationFile from "../data/EdspStationFile.xlsx";

const EdspUploader = () => {
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(sessionStorage.getItem("user-info"));
  const [monthYear, setMonthYear] = useState(dayjs().subtract(1, "month"));
  const [selectedOfficeId, setSelectedOfficeId] = useState("");
  const officeIds = user.officeid.includes(",")
    ? user.officeid.split(",").map((id) => id.trim())
    : [user.officeid];


  const handleEdspPivotFile = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (!file) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      // const response = await fetch(`${baseURL}/api/upload_edsp_pivot`, {
        const response = await fetch(`${phpBaseURL}/upload_edsp_pivot.php`, {
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

  const handleEdspPacketLoss = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (!file) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      // const response = await fetch(`${baseURL}/api/upload_edsp_packet_loss`, {
      const response = await fetch(`${phpBaseURL}/upload_edsp_packet_loss.php`, {
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

  const handleStationFile = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (!file) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("stationCode", selectedOfficeId || user.officeid);


      // const response = await fetch(`${baseURL}/api/upload_edsp_station_data`, {
      const response = await fetch(`${phpBaseURL}/upload_edsp_station_data.php`, {
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

  const handleEdspCashShort = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (!file) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      // const response = await fetch(`${baseURL}/api/upload_edsp_cod`, {
      const response = await fetch(`${phpBaseURL}/upload_edsp_cod.php`, {
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

      // const response = await fetch(`${baseURL}/api/upload_rate_card`, {
      const response = await fetch(`${phpBaseURL}/upload_rate_card.php`, {
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

  const handleEdspSlpLoss = async (event) => {
    const fileInput = event.target;
    const file = fileInput.files[0];
    if (!file) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      // const response = await fetch(`${baseURL}/api/upload_edsp_slp`, {
      const response = await fetch(`${phpBaseURL}/upload_edsp_slp.php`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
      } else {
        toast.error(data.detail);
        console.error(data.detail);
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

      const response = await fetch(`${phpBaseURL}/edsp_rate_card.php`);
      const jsonData = await response.json();
      const worksheet = xlsx.utils.json_to_sheet(jsonData);
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      const buffer = xlsx.write(workbook, { bookType: "xlsx", type: "buffer" });
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "edsp_rate_card.xlsx");
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
                <label htmlFor="edspPivotFile" className="text-black b ml-20">
                  EDSP Pivot File
                </label>
              </div>
              <div style={{ flex: 1, right: 0 }}>
                <input
                  id="edspPivotFile"
                  type="file"
                  // accept=".csv"
                  accept=".xlsx"
                  onChange={handleEdspPivotFile}
                  style={{ display: "none" }}
                />
                <Button
                  component="label"
                  htmlFor="edspPivotFile"
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
                <label htmlFor="edsPpacketLoss" className="text-black b ml-20">
                  EDSP Packet Loss
                </label>
              </div>
              <div style={{ flex: 1, right: 0 }}>
                <input
                  id="edspPacketLoss"
                  type="file"
                  accept=".xlsx"
                  onChange={handleEdspPacketLoss}
                  style={{ display: "none" }}
                />
                <Button
                  component="label"
                  htmlFor="edspPacketLoss"
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
                <label htmlFor="edspCashShort" className="text-black b ml-20">
                  EDSP Cash Short
                </label>
              </div>
              <div style={{ flex: 1, right: 0 }}>
                <input
                  id="edspCashShort"
                  type="file"
                  accept=".xlsx"
                  onChange={handleEdspCashShort}
                  style={{ display: "none" }}
                />
                <Button
                  component="label"
                  htmlFor="edspCashShort"
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
                  EDSP Rate Card
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

            <div
              className="mt-0 mb-5 m-2 mr-10 ml-10 p-4 bg-gray-300 dark:bg-black rounded-2xl flex justify-between"
              style={{
                background: "#e7e9ec",
              }}
            >
              <div style={{ flex: 1 }}>
                <label htmlFor="edspSlpLoss" className="text-black b ml-20">
                  EDSP SLP Loss
                </label>
              </div>
              <div style={{ flex: 1, right: 0 }}>
                <input
                  id="edspSlpLoss"
                  type="file"
                  accept=".xlsx"
                  onChange={handleEdspSlpLoss}
                  style={{ display: "none" }}
                />
                <Button
                  component="label"
                  htmlFor="edspSlpLoss"
                  variant="outlined"
                  color="primary"
                >
                  Upload <FaUpload style={{ marginRight: "5px" }} />
                </Button>
              </div>
            </div>
          </>
        )}
        {user && user.officeid !== "HO" && (
          <div
            className="mt-0 mb-5 m-2 mr-10 ml-10 p-4 bg-gray-300 dark:bg-black rounded-2xl flex justify-between"
            style={{
              background: "#e7e9ec",
            }}
          >
            <div style={{ flex: 1 }}>
              <label htmlFor="stationFile" className="text-black b ml-20">
                EDSP Station File
              </label>
            </div>
            <div style={{ flex: 1, right: 0 }}>
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
              {/* <a href={defaultStationFile} download="StationFile.xlsx">
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ marginLeft: "20px" }}
                >
                  Download
                </Button>
              </a> */}
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

export default EdspUploader;
