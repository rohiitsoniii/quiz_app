import React from "react";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const Sidebar = ({ activeComponent, setActiveComponent }) => {
  const [showLogoutPopup, setShowLogoutPopup] = useState("");
  const navigate = useNavigate();

  const handleItemClick = (item) => {
    setActiveComponent(item);
  };

  const handlelogout = () => {
    setShowLogoutPopup(true);
  };

  const Logout = () => {
    localStorage.removeItem("token");
    console.log(localStorage.getItem("token"));
    navigate("/");
  };

  const closeLogoutPopup = () => {
    setShowLogoutPopup(false);
  };

  return (
    <>
      <div className="sidebar">
        <p className="sidebar-header">QUIZZIE</p>
        <ul className="sidebar-list">
          {["Dashboard", "Quiz Analysis", "Create Quiz"].map((item, index) => (
            <li
              key={index}
              className={`sidebar-item ${
                (activeComponent === "Question Analysis" &&
                  item === "Quiz Analysis") ||
                activeComponent === item
                  ? "active"
                  : ""
              }`}
              onClick={() => handleItemClick(item)}
            >
              {item}
            </li>
          ))}
        </ul>
        <p onClick={handlelogout} className="logout">
          Logout
        </p>
      </div>
      {showLogoutPopup && (
        <div className="popup">
          <div className="popup_content">
            <p className="popup_heading">
              Are you confirm you
              <br />
              want to logout?
            </p>
            <div className="popup_btns">
              <button className="popup_yes" onClick={Logout}>
                Confirm
              </button>
              <button className="popup_No" onClick={closeLogoutPopup}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
