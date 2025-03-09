import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import '../style/Resgister.css'; // Import your CSS file

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [animationClass, setAnimationClass] = useState("fade-in");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Start fade-out animation before navigating
    setAnimationClass("fade-out");

    try {
      await axios.post(`${process.env.REACT_APP_URL}/api/user/register`, form);
      setMessage("Đăng ký thành công!");

      // Wait for the fade-out animation to complete (0.8s)
      setTimeout(() => {
        navigate('/dang-nhap'); // Chuyển hướng đến trang đăng nhập
      }, 800);
    } catch (error) {
      setLoading(false);
      setAnimationClass("fade-in"); // Reset animation if there is an error
      setMessage(
        error.response?.data?.error 
      );
    }
  };

  return (
    <>
      {loading && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
      <div className={`container ${animationClass}`}>
        <div className="illustration">
          <img src="/login-page-img.png" alt="banner" />
        </div>
        <div className="login-form">
          <h2>Đăng ký</h2>
          <div className="error-message">{message}</div>
          <div className="input-group">
            <FaUser className="icon" />
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="tài khoản"
            />
          </div>
          <div className="input-group">
            <FaLock className="icon" />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Mật khẩu"
            />
          </div>
          <div className="options">
            <label>
              <input type="checkbox" />
              Nhớ tài khoản
            </label>
            <a href="#">Quên mật khẩu?</a>
          </div>
          <button onClick={handleSubmit} className="login-button">Đăng ký</button>
          <div className="divider">HOẶC</div>
          <button className="create-account-button">
            <a href='/dang-nhap'>Đã có tài khoản</a>
          </button>
        </div>
      </div>
    </>
  );
};

export default Register;
