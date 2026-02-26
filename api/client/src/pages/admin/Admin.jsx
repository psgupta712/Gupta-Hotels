// src/pages/admin/Admin.jsx
//
// Protected: redirects if user is not logged in OR not isAdmin
// Two tabs: Hotels | Rooms

import { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext.jsx";
import Navbar        from "../../components/navbar/Navbar.jsx";
import Footer        from "../../components/footer/Footer.jsx";
import HotelManager  from "./components/HotelManager.jsx";
import RoomManager   from "./components/RoomManager.jsx";
import "./Admin.css";

const TABS = ["Hotels", "Rooms"];

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Use URL param to track active tab: /admin?tab=Rooms
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "Hotels";

  // Redirect if not admin
  useEffect(() => {
    if (!user)          navigate("/login");
    else if (!user.isAdmin) navigate("/");
  }, [user]);

  if (!user?.isAdmin) return null;

  return (
    <div className="admin-page">
      <Navbar />

      <div className="admin-content">

        {/* Page header */}
        <div className="admin-header">
          <div>
            <span className="admin-header__eyebrow">ADMIN PANEL</span>
            <h1 className="admin-header__title">Manage Properties</h1>
          </div>
          <div className="admin-header__meta">
            <span className="admin-header__user">Logged in as <strong>{user.username}</strong></span>
          </div>
        </div>

        {/* Tab bar */}
        <div className="admin-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`admin-tab ${activeTab === tab ? "admin-tab--active" : ""}`}
              onClick={() => setSearchParams({ tab })}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="admin-body">
          {activeTab === "Hotels" && <HotelManager />}
          {activeTab === "Rooms"  && <RoomManager  />}
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default Admin;
