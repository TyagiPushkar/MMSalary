import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../style/Login.css";
import { baseURL, phpBaseURL } from './../config';
import { FaEnvelope, FaKey, FaLock, FaArrowLeft, FaSpinner } from "react-icons/fa";
import { useStateContext } from '../contexts/ContextProvider';
const img = "http://www.trinityapplab.in/MnM/MnMLogo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showLoginCard, setShowLoginCard] = useState(true);
  const [loading, setLoading] = useState(false);
  const { setMode, setColor } = useStateContext();
  const navigate = useNavigate();

  const proceedLoginusingAPI = async (e) => {
    e.preventDefault();

    if (validate()) {
      setLoading(true);

      const inputobj = { email: email, admin_password: password };
      // sessionStorage.setItem("login-info", JSON.stringify(inputobj));

      try {
        const response = await fetch(
          `${phpBaseURL}/login.php`,
          {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(inputobj),
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const resp = await response.json();

        if (resp.message !== 'login Success') {
          toast.error(resp.message);
        } else {
          sessionStorage.setItem("user-info", JSON.stringify(resp));
          toast.success("Success");
          navigate("/");
        }
      } catch (error) {
        toast.error("Error during login");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.warning("Please Enter a Valid Email");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${baseURL}/sendOtpToMail.php`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email: email }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const resp = await response.json();

      if (resp.code === 200) {
        toast.success("OTP sent to your email id.");
        setShowLoginCard(false);
      } else {
        toast.error(resp.message);
      }
    } catch (error) {
      toast.error("Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    if (otp === "" || otp === null) {
      toast.warning("Enter a Valid OTP");
      return;
    }

    if (newPassword === "" || newPassword === null) {
      toast.warning("Enter a password");
      return;
    }

    if (confirmPassword === "" || confirmPassword === null) {
      toast.warning("Confirm your password");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.warning("Password did not match");
      return;
    }

    setLoading(true);

    const inputobj = {
      otp: otp,
      email: email,
      newPassword: btoa(newPassword),
    };

    try {
      const response = await fetch(
        `${baseURL}/changePassword.php`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(inputobj),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const resp = await response.json();

      if (resp.code === 200) {
        toast.success("Password changed successfully.");
        setShowLoginCard(true);
      } else {
        toast.error(resp.message);
      }
    } catch (error) {
      toast.error("Error changing password");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (showLoginCard) {
        proceedLoginusingAPI(e);
      } else {
        changePassword();
      }
    }
  };

  const handleBackToLogin = () => {
    setShowLoginCard(true);
  }

  const validate = () => {
    let result = true;
    if (email === "" || email === null) {
      result = false;
      toast.warning("Please Enter Email");
    }
    if (password === "" || password === null) {
      result = false;
      toast.warning("Please Enter Password");
    }
    return result;
  };

  return (
    <div className="container flex relative w-full h-full"
      style={{ width: "100%", height: "100%",  backgroundSize: 'cover'}}>
        {loading && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <FaSpinner className="text-white animate-spin" size={40} />
            </div>
        )}
    
      <div className="img-card">
        <img src={img} width="80%" alt="" loading="lazy"/>
      </div>
      {showLoginCard ? (
        <div className="login-card" style={{ backgroundColor: "white"}}>
          <h2 className="login-title">Login</h2>
          <div className="login-divider"></div>
          <div className="form-group">
            <label className="form-label flex items-center"><FaEnvelope style={{ color: "#1547bd", marginRight: '8px'}} />Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="form-control"
              onKeyPress={handleKeyPress}
            />
          </div>
          <div className="form-group">
            <label className="form-label flex items-center">
              <FaLock style={{ color: "#2052ca", marginRight: '8px'}} />Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="form-control"
              onKeyPress={handleKeyPress}
            />
          </div>
          <button
            className="login-button btn btn-success"
            onClick={proceedLoginusingAPI}
          >
            LOGIN
          </button>
          {/* <div style={{ textAlign: "center", marginTop: "10px"}}>
            <button onClick={handleForgotPassword} style={{ color: "#2052ca", fontWeight: "600" }}>Forgot password?</button>
          </div> */}
        </div>
      ) : (
        <div className="login-card" style={{ backgroundColor: "white" }}>
          <div className="form-group">
            <label className="form-label flex items-center"><FaKey style={{ color: "#1547bd", marginRight: '8px'}} />OTP</label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              type="text"
              className="form-control"
              onKeyPress={handleKeyPress}
            />
          </div>
          <div className="form-group">
            <label className="form-label flex items-center"><FaLock style={{ color: "#1547bd", marginRight: '8px' }} />New Password</label>
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              className="form-control"
              onKeyPress={handleKeyPress}
            />
          </div>
          <div className="form-group">
            <label className="form-label flex items-center"><FaLock style={{ color: "#1547bd", marginRight: '8px'}} />Confirm Password</label>
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              className="form-control"
              onKeyPress={handleKeyPress}
            />
          </div>
          <button
            className="login-button btn btn-success"
            onClick={changePassword}
          >
            Submit
          </button>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
            <button onClick={handleBackToLogin} style={{ color: '#2052ca', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
              <FaArrowLeft style={{ color: '#1547bd', marginRight: '8px' }} />
              Back to Login
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Login;
