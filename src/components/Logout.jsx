// File Logout.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();  // Sử dụng hook ở trong component

  const handleLogout = () => {
    // Xóa thông tin đăng nhập (ví dụ: token)
    localStorage.removeItem('token');  // Hoặc sessionStorage.removeItem('token');
    localStorage.removeItem('role');  // Hoặc sessionStorage.removeItem('token');
    localStorage.removeItem('username');  // Hoặc sessionStorage.removeItem('token');
    // Chuyển hướng người dùng về trang đăng nhập
    navigate('/dang-nhap');
  };

  return (
    <>
      <span className="pc-micon">
        {/* <img src="/transactions.png" className="wid-35" alt="Service Platform 1" /> */}
      </span>
      <button onClick={handleLogout}>Đăng xuất</button>
      <span className="pc-arrow">
        <i data-feather="chevron-right"></i>
      </span>
    </>

  );
};

export default Logout;
