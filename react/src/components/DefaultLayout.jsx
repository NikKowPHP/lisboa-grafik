import React, { useEffect, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import axiosClient from "../axios-client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import Calendar from "./Calendar";

function DefaultLayout() {
  const { user, token, notification, errors, setUser, setToken } =
    useStateContext();

  const navigate = useNavigate();

  // show calendar in aside section 
  const location = useLocation().pathname;
  const isCalendar = location.includes("calendar");
  // show/hide aside 
  const [asideShown, setAsideShown] = useState(true);


  if (!token) {
    return <Navigate to="/login" />;
  }

  // get user data
  useEffect(() => {
    axiosClient.get("/user").then(({ data }) => {
      setUser(data);
    });
  }, []);

  // hide/show aside
  const handleToggleAside = () => {
    setAsideShown(!asideShown);
  }
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 970) {
        setAsideShown(false);
      } else {
        setAsideShown(true);
      }
    }
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize)
    };

  }, []);

  const onLogout = (ev) => {
    ev.preventDefault();

    axiosClient.post("/logout").then(() => {
      setUser({});
      setToken(null);
    });
  };

  // select type of calendar to show
  const handleOptionSelect = (option) => {
    navigate(`/calendar/${option}`);
  };


  return (
    <div id="defaultLayout">
      <ToastContainer />
      {asideShown && (
        <aside className='default-aside'>
          <Link to={"/dashboard"}>Dashboard</Link>
          <Link to={"/users"}>Users</Link>
          <Link to={"/calendar"}>Calendar</Link>
          <Link to={"/tasks"}>Tasks</Link>

          {user &&
            user.hasOwnProperty("roles") &&
            user.roles.includes("admin") && (
              <>
                <Link to={"/roles"}>Roles</Link>
                <Link to={"/roles/all"}>Role names</Link>
              </>
            )}

          {isCalendar && <Calendar size={"calendar-small"} />}
        </aside>
      )}

      <div className="content">
        <header>
          <button
            className="btn-hamburger"
            onClick={() => handleToggleAside()}
          >
            <i className="fa fa-bars"></i>
          </button>
          <div>{user && user.name}</div>

            {/* show selection of calendar types */}
          {isCalendar && (
            <>
              <select onChange={(e) => handleOptionSelect(e.target.value)}>
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="agenda">Agenda</option>
              </select>
            </>
          )}

          <a href="#" onClick={onLogout} className="btn btn-logout">
            Logout
          </a>
        </header>
        <main>
          <Outlet />
        </main>
        {notification && <div className="notification">{notification}</div>}
        {errors.message && (
          <div className="notification notification-error">
            {errors.message}
          </div>
        )}
      </div>
    </div>
  );
}

export default DefaultLayout;
