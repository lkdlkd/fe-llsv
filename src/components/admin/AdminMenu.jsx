import "../../App.css";
import React, { useState } from 'react';
import { Link } from "react-router-dom";

function AdminMenu() {
    const [activeMenu, setActiveMenu] = useState(null); // Lưu menu nào đang mở
  
    // Hàm chung để toggle menu
    const toggleMenu = (menuName) => { 
        setActiveMenu(activeMenu === menuName ? null : menuName);
    };

    return (
        <nav className="pc-sidebar">
        <div className="navbar-wrapper">
          <div className="m-header">
            <a href="" className="b-brand text-primary">
              {/* ========   Change your logo from here   ============ */}
              <span>LIKESUBVIET</span>
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
                  <span className="pc-arrow"><i data-feather="chevron-right"></i></span>
                </a>
                {activeMenu === "Menu" && (
                <ul className="pc-submenu" style={{ listStyleType: 'none' }}>
                  <li className="pc-item">
                    <a href="/quantri/doitac" className="pc-link">
                      <span className="pc-micon">
                        <img src="assets/pack-lbd/images/home.png" className="wid-35" alt="" />
                      </span>
                      <span className="pc-mtext">Thêm đối tác</span>
                    </a>
                  </li>
                  <li className="pc-item">
                    <a href="/quantri/dichvu" className="pc-link">
                      <span className="pc-micon">
                        <img src="assets/pack-lbd/images/profile.png" className="wid-35" alt="" />
                      </span>
                      <span className="pc-mtext">Thêm dịch vụ</span>
                    </a>
                  </li>
                  <li className="pc-item">
                    <a href="/quantri/bank-king" className="pc-link">
                      <span className="pc-micon">
                        <img src="assets/pack-lbd/images/profile.png" className="wid-35" alt="" />
                      </span>
                      <span className="pc-mtext">Thêm ngân hàng</span>
                    </a>
                  </li>
                </ul>
                )}
              </li>

              <li className="pc-item pc-hasmenu">
                <a onClick={() => toggleMenu("nguoidung")} className="pc-link">
                  <span className="pc-micon">
                    <img src="/dashboard.png" className="wid-35" alt="" />
                  </span>
                  <span className="pc-mtext">QUẢN LÝ NGƯỜI DÙNG</span>
                  <span className="pc-arrow"><i data-feather="chevron-right"></i></span>
                </a>
                {activeMenu === "nguoidung" && (
                <ul className="pc-submenu" style={{ listStyleType: 'none' }}>
                  <li className="pc-item">
                    <a href="/quantri/tai-khoan" className="pc-link">
                      <span className="pc-micon">
                        <img src="assets/pack-lbd/images/home.png" className="wid-35" alt="" />
                      </span>
                      <span className="pc-mtext">tài khoản</span>
                    </a>
                  </li>
                  <li className="pc-item">
                    <a href="/quantri/danhsachdon" className="pc-link">
                      <span className="pc-micon">
                        <img src="assets/pack-lbd/images/profile.png" className="wid-35" alt="" />
                      </span>
                      <span className="pc-mtext">danh sách đơn</span>
                    </a>
                  </li>
                </ul>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
}

export default AdminMenu;
