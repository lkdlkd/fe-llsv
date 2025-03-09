import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import MenuAdmin from "./admin/AdminMenu";
import Footer from "./Footer";
import MenuUser from "./MenuUser";
import  {  useEffect } from "react";
import axios from "axios";

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const location = useLocation();
    const token = localStorage.getItem("token"); // Hoặc cách lưu trữ khác
    const [user, setUser] = useState([]); // Thông tin người dùng
      const username = localStorage.getItem("username");
      const [message, setMessage] = useState("");
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/api/user/${username}`,
          {
            headers: {
              "Authorization": `Bearer ${token}`
            },
            params: { username } // Gửi username tới API
          }
        );
        setUser(response.data);
      } catch (error) {
        setMessage(
          error.response
            ? error.response.data.message
            : "Có lỗi xảy ra, vui lòng thử lại!"
        );
        console.error("Lỗi khi lấy thông tin user", error);
      }
    };
    fetchUser();
  }, [username, token]);
  return (
    <>
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}  user={user} />
      {isMenuOpen && (location.pathname.startsWith("/quantri") ? <MenuAdmin  user={user} /> : <MenuUser  user={user} />)}
      <div class="pc-container">
        <div class="pc-content">
          {/* <div class="page-header mb-0">
            <div class="page-block">
              <div class="row align-items-center">
                <div class="col-md-12">

                </div>
              </div>
            </div>
          </div> */}
          <Outlet /> {/* Dùng Outlet để hiển thị nội dung của Route con */}
        </div>
      </div>          
      <Footer/>
      {/* {isMenuOpen && (location.pathname.startsWith("/quantri") ? <d/>: <Profile /> )}       */}
    </>
  );
};

export default Layout;
