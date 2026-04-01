import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { Navbar, Footer, Sidebar, ThemeSettings } from "./components";
import {
  Ecommerce,
  Employee,
  Customers,
  Submenu,
  Station,
  Editor,
  Login,
  EmployeeCashShort,
  CashShort,
  Salary,
  PackageLoss,
  EdspUploader,
  EdspCashShort,
  EdspPacketLoss,
  EdspPivotTable,
  EdspStationFile,
  EdspSlpLoss,
  EdspSalary,
  EdspRedispute,
  ManageEmployee,
  FixedSalary,
  PermanentSalary,
  DspSummary,
  EdspSummary,
} from "./pages";
import { useStateContext } from "./contexts/ContextProvider";
import { FiSettings } from "react-icons/fi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import "./App.css";
import CashShortSubmitted from "./pages/CashShortSubmitted";
import { AddEmployee } from "./pages/AddEmployee";

const App = () => {
  const {
    activeMenu,
    setThemeSettings,
    themeSettings,
    currentColor,
    currentMode,
  } = useStateContext();

  const navigate = useNavigate();

  // Check if there is user info in session storage
  const userInfo = JSON.parse(sessionStorage.getItem("user-info"));
  const isDualRole = userInfo?.officeid?.includes(",");

  useEffect(() => {
    // If there is no user info, navigate to the login page
    if (!userInfo) {
      navigate("/login");
    }
    function handleContextMenu(e) {
      e.preventDefault();
    }

    const rootElement = document.getElementById("my-component");
    rootElement.addEventListener("contextmenu", handleContextMenu);
    // remove the event listener when the component is unmounted

    return () => {
      rootElement.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [userInfo, navigate]);

  return (
    <div className={currentMode === "Dark" ? "dark" : ""} id="my-component">
      <div
        className="flex relative dark:bg-main-dark-bg bg-main-dark-bg"
        style={{ backgroundColor: "#1547bd" }}
      >
        {userInfo ? (
          <>
            {/* <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
              <TooltipComponent content="Settings" position="Top">
                <button
                  type="button"
                  className="text-3xl p-3 hover:drop-shadow-xl hover:bg-light-gray text-white"
                  onClick={() => setThemeSettings(true)}
                  style={{ background: currentColor, borderRadius: "50%" }}
                >
                  <FiSettings />
                </button>
              </TooltipComponent>
            </div> */}

            <div
              className="w-72 fixed sidebar dark:bg-secondary-dark-bg"
              style={{
                background: currentMode === "Dark" ? "#33373e" : currentColor,
              }}
            >
              {activeMenu && <Sidebar />}
            </div>
            <div
              className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full
                ${activeMenu ? "md:ml-72" : "flex-2"}
              `}
            >
              <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
                <Navbar />
              </div>
              <div>
                {/* {themeSettings && <ThemeSettings />} */}
                <Routes>
                  <Route
                    path="/"
                    element={
                      userInfo &&
                      (userInfo.station_type === "DSP" ||
                        userInfo.officeid === "HO" ||
                        userInfo.officeid.includes(",")) ? (
                        <Ecommerce />
                      ) : (
                        // <EdspUploader />
                        " "
                      )
                    }
                  />
                  <Route path="/edspuploader" element={<EdspUploader />} />
                  <Route path="/EdspSLP" element={<EdspSlpLoss />} />
                  {userInfo && userInfo.officeid === "HO" && (
                    <>
                      <Route path="/SlotData" element={<Submenu />} />
                      <Route path="/TypeData" element={<Customers />} />
                      <Route path="/Data" element={<Editor />} />
                      <Route
                        path="/EmployeeCashShort"
                        element={<EmployeeCashShort />}
                      />
                      <Route path="/Salary" element={<Salary />} />
                      <Route path="/DspSummary" element={<DspSummary />} />
                      <Route path="/Employee" element={<Employee />} />
                      <Route
                        path="/ManageEmployee"
                        element={<ManageEmployee />}
                      />
                      <Route path="/EdspSalary" element={<EdspSalary />} />
                      <Route path="/EdspSummary" element={<EdspSummary />} />
                      <Route path="/EdspPivot" element={<EdspPivotTable />} />

                      <Route
                        path="/EdspRedispute"
                        element={<EdspRedispute />}
                      />
                    </>
                  )}
                  {userInfo && (userInfo.officeid === "HO" || isDualRole) && (
                    <>
                      <Route path="/FixedSalary" element={<FixedSalary />} />
                      <Route
                        path="/PermanentSalary"
                        element={<PermanentSalary />}
                      />
                    </>
                  )}
                  <Route path="/Station" element={<Station />} />
                  <Route path="/CashShort" element={<CashShort />} />
                  <Route
                    path="/CashShortSubmitted"
                    element={<CashShortSubmitted />}
                  />
                  <Route path="/PackageLoss" element={<PackageLoss />} />
                  <Route path="/AddEmployee" element={<AddEmployee />} />
                  <Route path="/EdspCashShort" element={<EdspCashShort />} />
                  <Route path="/EdspPacketLoss" element={<EdspPacketLoss />} />
                  <Route path="/EdspStation" element={<EdspStationFile />} />
                  <Route path="*" element={<notFound />} />
                </Routes>
              </div>
            </div>
          </>
        ) : (
          <div className="w-screen h-screen flex relative items-center justify-center">
            <Routes>
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
