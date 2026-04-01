import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { MdOutlineCancel } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { useSelector, useDispatch } from "react-redux";
import { fetchMenuData } from "../redux/actions/menuActions";
import { useStateContext } from "../contexts/ContextProvider";
import { useMenuContext } from "../contexts/menuContext";
import "../style/sidebar.css";

const Sidebar = () => {
  const user = JSON.parse(sessionStorage.getItem("user-info")) || {};
  const { activeMenu, setActiveMenu, screenSize, currentColor, currentMode } =
    useStateContext();
  const menuData = useSelector((state) => state.menu.menuData);
  const isLoading = useSelector((state) => state.isLoading);
  const error = useSelector((state) => state.error);
  const dispatch = useDispatch();
  const { setSelectedMenuId } = useMenuContext();

  const [cashShortData, setCashShortData] = useState([]);

  const img = user?.logoUrl || "/default-logo.png";

  const isHO = user.officeid === "HO";
  const isDualRole = user.officeid.includes(",");
  const isDSP = user.station_type === "DSP" || isDualRole;
  const isEDSP = user.station_type === "EDSP" || isDualRole;

  useEffect(() => {
    dispatch(fetchMenuData());

    const fetchCashShortData = async () => {
      try {
        const response = await fetch(
          "http://164.52.220.66:8001/show_station_cash_short",
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setCashShortData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCashShortData();
  }, [dispatch]);

  const hasPendingCashShort = cashShortData.some(
    (entry) => entry.station_code === user.officeid && entry.status === 0,
  );

  const handleCloseSidebar = () => {
    if (activeMenu && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const activeLink = `flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg dark:text-white text-md m-2 dark:bg-${currentColor}`;
  const normalLink = `flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-200 dark:text-gray-200 hover:text-black dark:hover:text-white hover:bg-white dark:hover:bg-black m-2`;

  const menuLinks = [
    // DSP specific
    {
      path: "/",
      label: "DSP Upload File",
      show: isHO || isDualRole || isDSP,
    },
    {
      path: "/Station",
      label: "DSP Supervisor Data",
      show: isHO || isDSP,
    },
    {
      path: "/PackageLoss",
      label: "DSP Package Loss",
      show: isHO || isDSP,
    },
    {
      path: "/CashShort",
      label: "DSP Cash Loss",
      show: isHO || isDSP,
      badge: hasPendingCashShort,
    },
    {
      path: "/CashShortSubmitted",
      label: "DSP Submitted Cash Loss",
      show: isDSP,
    },
    // HO specific
    {
      path: "/edspuploader",
      label: "EDSP Upload File",
      // show: isHO || isEDSP,
    },
    {
      path: "/Data",
      label: "DSP ID Comparision",
      show: isHO,
    },
    {
      path: "/SlotData",
      label: "Slot Data Comparision",
      show: isHO,
    },
    {
      path: "/TypeData",
      label: "Detail Slot Data Comparision",
      show: isHO,
    },
    {
      path: "/Salary",
      label: "DSP Slot Salary",
      show: isHO,
    },
    {
      path: "/DspSummary",
      label: "DSP Summary",
      show: isHO,
    },
    {
      path: "/FixedSalary",
      label: "DSP/EDSP Fixed Salary",
      show: isHO || isDualRole,
    },
    {
      path: "/PermanentSalary",
      label: "Employees Salary",
      show: isHO || isDualRole,
    },
    {
      path: "/Employee",
      label: "Login Details",
      show: isHO,
    },
    {
      path: "/ManageEmployee",
      label: "Employee Master",
      show: isHO,
    },
    // EDSP station-specific
    {
      path: "/EdspCashShort",
      label: "EDSP Cash Loss",
      // show: isEDSP,
    },
    {
      path: "/EdspPacketLoss",
      label: "EDSP Packet Loss",
      // show: isEDSP,
    },
    {
      path: "/EdspStation",
      label: "EDSP Supervisor Data",
      // show: isEDSP,
    },
    {
      path: "/EdspSalary",
      label: "EDSP DA packet Salary",
      show: isHO,
    },
    {
      path: "/EdspSummary",
      label: "EDSP Summary",
      show: isHO,
    },
    {
      path: "/EdspPivot",
      label: "EDSP Package Count Comparision",
      show: isHO,
    },
    {
      path: "/EdspSLP",
      label: "EDSP SLP Loss",
      // show: isHO || isEDSP,
    },
    {
      path: "/EdspRedispute",
      label: "EDSP Redispute",
      show: isHO,
    },
    {
      path: "/AddEmployee",
      label: "Add Employee",
      show: isEDSP,
    },
  ];

  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            {/* <TooltipComponent content="Home" position="BottomCenter">
              <Link
                to="/"
                onClick={handleCloseSidebar}
                className="items-center justify-center gap-3 mt-2 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900"
              >
                <img src={img} width="300" alt="logo" loading="lazy" />
              </Link>
            </TooltipComponent> */}

            <TooltipComponent content="Menu" position="BottomCenter">
              <button
                type="button"
                onClick={() => setActiveMenu((prev) => !prev)}
                className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
              >
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>

          <div>
            <p className="text-gray-400 m-3 mt-4 uppercase">Menu</p>

            {isLoading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error loading menu data.</p>
            ) : (
              menuLinks
                .filter((item) => item.show)
                .map(({ path, label, badge }) => (
                  <NavLink
                    key={path}
                    to={path}
                    onClick={handleCloseSidebar}
                    className={({ isActive }) =>
                      isActive ? activeLink : normalLink
                    }
                    style={({ isActive }) =>
                      isActive
                        ? {
                            background:
                              currentMode === "Dark" ? currentColor : "white",
                          }
                        : {}
                    }
                  >
                    <span>{label}</span>
                    {badge && (
                      <span className="absolute right-0 w-3 mr-10 h-3 bg-red-800 rounded-full"></span>
                    )}
                  </NavLink>
                ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
