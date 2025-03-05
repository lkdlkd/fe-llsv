import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import '../App.css';

export const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/api/user/login`, { username, password });
      const { token, role } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('username', username);
      // Chuyển hướng dựa trên vai trò
      if (role === "admin") {
        navigate('/quantri');
      } else {
        navigate('/');
      }
    } catch (err) {
      if (err.response) {
        console.error("Lỗi từ server:", err.response.data);
        setError(err.response.data.message || "Đăng nhập thất bại");
      } else {
        console.error("Lỗi không xác định:", err);
        setError("Lỗi kết nối đến máy chủ");
      }
    }
  };

  return (
    <div className="login-form">
      <h2>Đăng nhập</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <FaUser className="icon" />
          <input
            type="text"
            placeholder="Tài khoản"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input-group">
          <FaLock className="icon" />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="options">
          <label>
            <input type="checkbox" />
            Nhớ tài khoản
          </label>
          <Link to="/quen-mat-khau">Quên mật khẩu?</Link>
        </div>
        <button type="submit" className="login-button">
          Đăng nhập
        </button>
      </form>
      <div className="divider">HOẶC</div>
      <button className="create-account-button">
        <Link to="/dang-ky">Tạo tài khoản mới</Link>
      </button>
    </div>
  );
};
