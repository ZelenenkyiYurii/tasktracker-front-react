import React from "react";
import { Link } from "react-router-dom";

const NavigationBar = ({ currentUser, showModeratorBoard, showAdminBoard, logOut }) => {
  return (
    <nav className="bg-green-900 p-4 flex justify-between item-center">
      <Link to={"/"} className="text-white text-lg font-semibold hover:scale-110  hover:text-green-300">
        Task Tracker
      </Link>
      <div className="flex space-x-4">
        {/* <Link to={"/home"} className="text-white hover:text-green-300">
          Home
        </Link> */}

        

        {currentUser && (
          <Link to={"/boards"} className="text-white hover:text-green-300 ">
            Boards
          </Link>
        )}
      </div>

      {currentUser ? (
        <div className="flex space-x-4">
          <Link to={"/profile"} className="text-white hover:text-green-300">
            {currentUser.username}
          </Link>
          <a href="/login" className="text-white hover:text-green-300" onClick={logOut}>
            LogOut
          </a>
        </div>
      ) : (
        <div className="flex space-x-4">
          <Link to={"/login"} className="text-white hover:text-green-300">
            Login
          </Link>
          <Link to={"/register"} className="text-white hover:text-green-300">
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;
