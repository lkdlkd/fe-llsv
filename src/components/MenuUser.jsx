import "../App.css";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logout from "./Logout";
import axios from "axios";

function MenuUser() {
  const [activeMenu, setActiveMenu] = useState(null); // Lưu menu nào đang mở
  // const [user, setUser] = useState([]); // Thông tin người dùng
  // const username = localStorage.getItem("username");
  // const [message, setMessage] = useState("");
  // const token = localStorage.getItem("token"); // Hoặc cách lưu trữ khác

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${process.env.REACT_APP_URL}/api/user/${username}`,
  //         {
  //           headers: {
  //             "Authorization": `Bearer ${token}`
  //           },
  //           params: { username } // Gửi username tới API
  //         }
  //       );
  //       setUser(response.data);
  //     } catch (error) {
  //       setMessage(
  //         error.response
  //           ? error.response.data.message
  //           : "Có lỗi xảy ra, vui lòng thử lại!"
  //       );
  //       console.error("Lỗi khi lấy thông tin user", error);
  //     }
  //   };
  //   fetchUser();
  // }, [username, token]);

  // Lắng nghe sự kiện click ngoài sidebar để đóng nó lại trên mobile
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (window.innerWidth <= 1024) {
        const sidebar = document.querySelector(".pc-sidebar");
        if (sidebar && !sidebar.contains(e.target)) {
          sidebar.classList.remove("open");
        }
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Hàm chung để toggle menu
  const toggleMenu = (menuName) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  return (
    <nav className="pc-sidebar">
      <div className="navbar-wrapper">
        <div className="m-header">
          <a href="/" className="b-brand text-primary">
            {/* ========   Change your logo from here   ============ */}
            <span>WEB CHÍNH SUBVIET.VN</span>
          </a>
        </div>
        <div className="navbar-content mb-3">
          <ul className="pc-navbar">
            {/* Phần dành cho admin (nếu cần) */}
            {/* <li className="pc-item pc-caption">
              <label>Admin</label>
            </li>
            <li className="pc-item">
              <a href="/admin/dashboard" className="pc-link">
                <span className="pc-micon">
                  <img src="assets/images/world.png" className="wid-35" alt="" />
                </span>
                <span className="pc-mtext">Trang Quản Trị</span>
              </a>
            </li> */}
            
            <li className="pc-item pc-caption">
              <label>Bảng Điều Khiển</label>
            </li>

            <li className="pc-item pc-hasmenu">
              <a onClick={() => toggleMenu("Menu")} className="pc-link">
                <span className="pc-micon">
                  <img src="/dashboard.png" className="wid-35" alt="" />
                </span>
                <span className="pc-mtext">MENU HỆ THỐNG</span>
                <span className="pc-arrow">
                  <i data-feather="chevron-right"></i>
                </span>
              </a>
              {activeMenu === "Menu" && (
                <ul className="pc-submenu" style={{ listStyleType: "none" }}>
                  <li className="pc-item">
                    <a href="/" className="pc-link">
                      <span className="pc-micon">
                        <img src="/home.png" className="wid-35" alt="" />
                      </span>
                      <span className="pc-mtext">Trang Chủ</span>
                    </a>
                  </li>
                  {/* <li className="pc-item">
                    <a href="/account/profile" className="pc-link">
                      <span className="pc-micon">
                        <img src="assets/pack-lbd/images/profile.png" className="wid-35" alt="" />
                      </span>
                      <span className="pc-mtext">Thông Tin Cá Nhân</span>
                    </a>
                  </li> */}
                  <li className="pc-item">
                    <a href="/nap-tien" className="pc-link">
                      <span className="pc-micon">
                        <img src="/payment-method.png" className="wid-35" alt="" />
                      </span>
                      <span className="pc-mtext">Nạp Tiền</span>
                    </a>
                  </li>
                  <li className="pc-item">
                    <a href="/lich-su-hoat-dong" className="pc-link">
                      <span className="pc-micon">
                        <img src="/transactions.png" className="wid-35" alt="" />
                      </span>
                      <span className="pc-mtext">Lịch Sử Hoạt Động</span>
                    </a>
                  </li>
                  {/* <li className="pc-item">
                    <a href="/account/progress" className="pc-link">
                      <span className="pc-micon">
                        <img src="assets/pack-lbd/images/bills.png" className="wid-35" alt="" />
                      </span>
                      <span className="pc-mtext">Tiến Trình</span>
                    </a>
                  </li> */}
                </ul>
              )}
            </li>
            
            <li className="pc-item pc-caption">
              <label>Danh Sách Dịch Vụ</label>
            </li>
            
            <li className="pc-item pc-hasmenu">
              <a href="dichvu" className="pc-link">
                <span className="pc-micon">
                  <img src="https://i.imgur.com/LtJfhAt.gif" className="wid-35" alt="Service Platform 1" />
                </span>
                <span className="pc-mtext">MUA DỊCH VỤ</span>
                <span className="pc-arrow">
                  <i data-feather="chevron-right"></i>
                </span>
              </a>
            </li>
            <li className="pc-item pc-hasmenu">
              <a href="danh-sach-don" className="pc-link">
                <span className="pc-micon">
                  <img src="/transactions.png" className="wid-35" alt="Service Platform 1" />
                </span>
                <span className="pc-mtext">DANH SÁCH ĐƠN</span>
                <span className="pc-arrow">
                  <i data-feather="chevron-right"></i>
                </span>
              </a>
            </li>
          </ul>
          <Logout />
        </div>
      </div>
    </nav>
  );
}

export default MenuUser;
