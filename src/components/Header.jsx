import React from "react";
import "../App.css";

function Header({ user }) {
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
                className="pc-head-link  arrow-none m-0 trig-drp-search"
                data-bs-toggle="dropdown"
                role="button"
                aria-haspopup="false"
                aria-expanded="false"
              >
                <svg className="pc-icon">
                  <i className="ti ti-menu-2"></i>
                </svg>
              </a>
              <div className="dropdown-menu  drp-search">
                <form className="px-3 py-2">
                  <i className="ti ti-menu-2"></i>

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
                <label>Số dư :</label>
                {user ? Number(user.balance).toLocaleString("en-US") : "Đang tải..."} đ
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
