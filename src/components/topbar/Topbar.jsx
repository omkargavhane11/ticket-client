import { useEffect, useState } from "react";
import "./topbar.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/user";

const Topbar = () => {
  const user = useSelector((state) => state.currentUser);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [heading, setHeading] = useState("");

  useEffect(() => {
    function headingSet(pathname) {
      switch (pathname) {
        case "/queries":
          setHeading("My Queries");
          break;

        case "/create":
          setHeading("Create");
          break;

        case `/query/*`:
          setHeading("Query");
          break;

        case `/pick_new_query`:
          setHeading("Pick Query");
          break;
      }
    }
    headingSet(window.location.pathname);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setOpen(false);
    navigate("/");
  };

  const username = user.name.split(" ")[0];

  return (
    <>
      <div className="queriesPage_top">
        <h3 className="pageHeading">{heading}</h3>
        <div className="user_avatar">
          <span className="username">{user?.name}</span>
          <span className="firstname">{username}</span>
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-vWL06qbKx_pfPr-bFrIjw1t7y5ogYgIiNITgPVmXcHS6DSN3T793hhNAWRngBnR3dec&usqp=CAU"
            alt="user"
            className="user_image"
            onClick={() => setOpen(!open)}
          />
          {open && (
            <div className="logout_modal">
              <div className="modal_item">Settings</div>
              <div className="modal_item" onClick={handleLogout}>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Topbar;
