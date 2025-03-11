import React, { useState, useContext } from 'react';
import { loginUser } from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import '../App.css';
import { AuthContext } from './AuthContext';

export const Login = () => {
  const navigate = useNavigate();
  const { updateAuth } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [animationClass, setAnimationClass] = useState('fade-in');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAnimationClass('fade-out');
  
    try {
      const { token, role } = await loginUser(username, password);
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('username', username);
  
      updateAuth({ token, role, username });
  
      setTimeout(() => {
        setLoading(false);
        if (role === 'admin') {
          navigate('/quantri');
        } else {
          navigate('/home');
        }
      }, 800);
    } catch (error) {
      setLoading(false);
      setAnimationClass('fade-in');
      setError(error.error);
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
          <h2>Đăng nhập</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <FaUser className="icon" />
              <input
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Tài khoản"
              />
            </div>
            <div className="input-group">
              <FaLock className="icon" />
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mật khẩu"
              />
            </div>
            <div className="options">
              <label>
                <input type="checkbox" />
                Nhớ tài khoản
              </label>
              <Link to="#">Quên mật khẩu?</Link>
            </div>
            <button type="submit" className="login-button">
              Đăng nhập
            </button>
          </form>
          <div className="divider">HOẶC</div>
          <button className="create-account-button">
            <Link to="/dang-ky">Chưa có tài khoản</Link>
          </button>
        </div>
      </div>
    </>
  );
};
