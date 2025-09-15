import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseURL } from "./../config";

import { Cart, Chat, Notification, UserProfile } from '.';
import { useStateContext } from '../contexts/ContextProvider';

import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { Link } from "react-router-dom";

import { AiOutlineMenu } from 'react-icons/ai';
import { FiShoppingCart } from 'react-icons/fi';
import { BsChatLeft } from 'react-icons/bs';
import { RiNotification3Line } from 'react-icons/ri';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { color } from '@amcharts/amcharts4/core';

const img = "http://www.trinityapplab.in/MnM/MnMLogo.png";
const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={() => customFunc()}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-gray-300 dark:hover:bg-light-gray"
    >
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
      {icon}
    </button>
  </TooltipComponent>
);

const Navbar = () => {
  const navigate = useNavigate();
  const { activeMenu, setActiveMenu, isClicked, setIsClicked, handleClick, screenSize, setScreenSize, currentColor, currentMode } = useStateContext();
  const user = JSON.parse(sessionStorage.getItem("user-info"));
  const inactivityTimeout = 10 * 60 * 1000;
  let logoutTimer;

  const handleActiveMenu = () => setActiveMenu(!activeMenu);

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseOver = (event) => {
    event.target.style.background = currentColor;
  };
  const handleMouseOut = (event) => {
    event.target.style.background = "transparent";
  };

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  const handleUserActivity = () => {
    clearTimeout(logoutTimer);
    logoutTimer = setTimeout(() => {
      handleLogout();
    }, inactivityTimeout);
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);
    window.addEventListener('resize', handleResize);
    handleResize();

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);

    logoutTimer = setTimeout(() => {
      handleLogout();
    }, inactivityTimeout);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      clearTimeout(logoutTimer);
    };
  }, []);

  return (
    <div className='flex justify-between p-5 mb-6 static mb-15 bg-gray-200 dark:bg-gray-800' >

      {/* Hide/Show Sidebar */}
     <div className="flex items-center">
      {/* <NavButton title="Menu" customFunc={handleActiveMenu} color={currentColor} icon={<AiOutlineMenu />} /> */}
      <h4 className='text-black dark:text-white font-bold ml-1 text-24'>M&M</h4>
    </div>

     <div className='flex'>

        {/* <NavButton title="Cart" customFunc={() => handleClick('cart')} color={currentColor} icon={<FiShoppingCart />} />
        
        <NavButton title="Chat" dotColor="#03C9D7" customFunc={() => handleClick('chat')} color={currentColor} icon={<BsChatLeft />} />
        
        <NavButton title="Notification" dotColor="rgb(254, 201, 15)" customFunc={() => handleClick('notification')} color={currentColor} icon={<RiNotification3Line />} /> */}
        {/* <Link
          to="/"
          className="text-gray-500 dark:text-white hover:text-white flex items-center gap-2 cursor-pointer p-1  rounded-lg mr-20 font-bold"
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >Home</Link>

        <Link
          to="/map"
          className={`text-gray-500 dark:text-white hover:text-white flex items-center gap-2 cursor-pointer p-1 rounded-lg mr-20 font-bold`}
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
        >Map</Link> */}
        <div
            className="flex items-center gap-2 text-24 cursor-pointer p-1 hover:bg-light-purple rounded-lg "
            onClick={() => handleClick('userProfile')}
            style={{ color: currentMode === "Dark" ? "white" : "black"}}
          >
        {/* <TooltipComponent content="Profile" position="BottomCenter"> */}
          <p className="font-bold ml-1 text-24">
                {user.admin_name}
              </p>
        {/* </TooltipComponent> */}

              
            <MdKeyboardArrowDown className="text-gray-400 text-24" style={{ color: currentMode === "Dark" ? "white" : "black"}} />
          </div>
          
        {/* Profile button */}
        <TooltipComponent content="Profile" position="BottomCenter">
          <div
            className="flex items-center gap-2 text-24 cursor-pointer p-1 hover:bg-light-purple rounded-lg "
            onClick={() => handleClick('userProfile')}
          >
            {/* Image */}
            {/* <img
              className="rounded-full w-8 h-8"
              src={img}
              alt="user-profile"
            /> */}

            {/* Text */}
            {/* <p className='text-24'> */}
              {/* <span className="text-gray-400 text-24">Hi,</span>{' '} */}
              {/* <span className="text-white font-bold ml-1 text-24">
                {user[0].empName}
              </span> */}
            {/* </p> */}

            {/* Arrow down */}
            {/* <MdKeyboardArrowDown className="text-gray-400 text-24" /> */}
          </div>
        </TooltipComponent>

        {isClicked.userProfile && (<UserProfile />)}

     </div>
    </div>
  )
}

export default Navbar