import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../App.css";
import Logout from "./Logout";

function Header({ isMenuOpen, setIsMenuOpen , user }) {
  const [activeMenu, setActiveMenu] = useState(null); // Lưu menu nào đang mở
  const token = localStorage.getItem("token"); // Hoặc cách lưu trữ khác

  // const [user, setUser] = useState([]);
  // const username = localStorage.getItem("username");
  // const [message, setMessage] = useState("");

  const handleActiveMenu = (e) => {
    // Ngăn chặn sự kiện lan truyền nếu cần
    e.stopPropagation();
    // Nếu màn hình nhỏ (mobile/tablet), toggle sidebar
    if (window.innerWidth <= 1024) {
      const sidebar = document.querySelector(".pc-sidebar");
      if (sidebar) {
        sidebar.classList.toggle("open");
      }
    }
  };

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${process.env.REACT_APP_URL}/api/user/${username}`,
  //         {
  //           headers: {
  //             "Authorization": `Bearer ${token}`,
  //           },
  //           params: { username },
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

  const toggleMenu = (menuName) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  return (
    <header className="pc-header">
      <div className="header-wrapper">
        {/* [Mobile Media Block] start */}
        <div className="me-auto pc-mob-drp">
          <ul onClick={handleActiveMenu} className="list-unstyled">
            {/* ======= Menu collapse Icon ===== */}
            <li className="pc-h-item pc-sidebar-collapse">
              <a className="pc-head-link ms-0" id="sidebar-hide">
                <i className="ti ti-menu-2"></i>
              </a>
            </li>
            <li className="pc-h-item pc-sidebar-popup">
              <a className="pc-head-link ms-0" id="mobile-collapse">
                <i className="ti ti-menu-2"></i>
              </a>
            </li>
            <li className="dropdown pc-h-item">
              <a
                className="pc-head-link dropdown-toggle arrow-none m-0 trig-drp-search"
                data-bs-toggle="dropdown"
                role="button"
                aria-haspopup="false"
                aria-expanded="false"
              >
                <svg className="pc-icon">
                  <use xlinkHref="#custom-search-normal-1" />
                </svg>
              </a>
              <div className="dropdown-menu pc-h-dropdown drp-search">
                <form className="px-3 py-2">
                  <input
                    type="search"
                    className="form-control border-0 shadow-none"
                    placeholder="Search here. . ."
                  />
                </form>
              </div>
            </li>
          </ul>
        </div>
        {/* [Mobile Media Block] end */}
        <div className="ms-auto">
          <ul>
            {/* User Block */}
            <li className="dropdown pc-h-item header-user-profile">
              <span className="pc-mtext">
                <label>Số dư: </label>
                {user.balance}
              </span>
              <a
                className="pc-head-link dropdown-toggle arrow-none me-0"
                data-bs-toggle="dropdown"
                role="button"
                aria-haspopup="false"
                data-bs-auto-close="outside"
                aria-expanded="false"
              >
                <img
                  src="https://ui-avatars.com/api/?background=random&name=User"
                  alt="user-image"
                  className="user-avtar"
                />
              </a>
            </li>
            {/* End user block */}
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;
