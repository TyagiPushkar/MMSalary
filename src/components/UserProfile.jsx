import React, { useEffect } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { Button } from '.';
import { useStateContext } from '../contexts/ContextProvider';
import { useNavigate } from 'react-router-dom';
import { baseURL } from "./../config";

const img = "http://www.trinityapplab.in/MnM/MnMLogo.png";

const UserProfile = () => {
  const { currentColor, closeUserProfile } = useStateContext();
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('user-info'));

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
    closeUserProfile();
  };

  return (
    <div className="nav-item absolute right-1 top-16 bg-gray-200 dark:bg-gray-500 p-8 rounded-lg w-96">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg dark:text-white">User Profile</p>
        <Button
          icon={<MdOutlineCancel />}
          color={currentColor}
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
        />
      </div>
      <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
        <img className="rounded-full h-14 w-14 bg-white" src={img} alt="user-profile" />
        <div>
          <p className="font-semibold text-xl dark:text-white">{user.admin_name}</p>
          <p className="font-semibold text-xl dark:text-white" style={{fontSize:'14px'}}>{user.allOffice}</p>
        </div>
      </div>
      <div className="mt-5 flex justify-center">
        <button
          onClick={() => logout()}
          className="text-white hover:bg-blue-600 rounded-lg px-4 py-2 items-center"
          style={{ backgroundColor: "#1547bd" }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
