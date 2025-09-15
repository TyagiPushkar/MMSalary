import React, { createContext, useContext, useState, useEffect } from "react";

const StateContext = createContext();

const initialState = {
  chat: false,
  cart: false,
  userProfile: false,
  notification: false,
};

export const ContextProvider = ({ children }) => {
  const user = JSON.parse(sessionStorage.getItem("user-info"));

  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState(initialState);
  const [screenSize, setScreenSize] = useState(undefined);
  const [currentColor, setCurrentColor] = useState(
    user ? user.themeColor : "#1547bd"
  );
  const [currentMode, setCurrentMode] = useState(
    user ? user.themeOption : "Light"
  );
  const [themeSettings, setThemeSettings] = useState();

  const setMode = (e) => {
    setCurrentMode(e.target.value);
    localStorage.setItem("themeMode", e.target.value);
    const updatedUserData = {
      empId: user.empId,
      name: user.name,
      roleId: user.roleId,
      role: user.role,
      themeOption: currentMode,
      themeColor: currentColor,
      subject: user.subject,
    };
    sessionStorage.setItem("user-info", JSON.stringify(updatedUserData));
    setThemeSettings(false);
  };

  const setColor = (color) => {
    setCurrentColor(color);
    localStorage.setItem("colorMode", color);
    setThemeSettings(false);
  };

  const handleClick = (clicked) =>
    setIsClicked({ ...initialState, [clicked]: true });

  const closeUserProfile = () => {
    setIsClicked({ ...initialState, userProfile: false });
  };

  return (
    <StateContext.Provider
      value={{
        currentColor,
        currentMode,
        activeMenu,
        screenSize,
        setScreenSize,
        handleClick,
        isClicked,
        initialState,
        setIsClicked,
        setActiveMenu,
        setCurrentColor,
        setCurrentMode,
        setMode,
        setColor,
        themeSettings,
        setThemeSettings,
        closeUserProfile,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
