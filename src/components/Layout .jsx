import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import MenuAdmin from "./admin/AdminMenu";
import Footer from "./Footer";
import MenuUser from "./MenuUser";
import { fetchUserData } from "../utils/api"; // Import API từ file api.js

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null); // Thông tin người dùng
  const username = localStorage.getItem("username");


  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await fetchUserData(username, token);
        setUser(data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin user", error);
      }
    };

    if (username && token) {
      getUser();
    }
  }, [username, token]);


  return (
    <>
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} user={user} />
      {isMenuOpen &&
        (location.pathname.startsWith("/quantri") ? (
          <MenuAdmin user={user} />
        ) : (
          <MenuUser user={user} />
        ))}
      <div className="pc-container">
        <div className="pc-content">
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Layout;
