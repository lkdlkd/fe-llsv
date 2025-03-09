import React, { useState, useEffect } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Login } from "./components/Login";
import Register from "./components/Register";
import Home from "./Page/Home";
import Layout from "./components/Layout ";
import Quantri from "./components/admin/Quantri";
import SmmForm from "./components/admin/SmmForm";
import Smmdv from "./components/admin/Smmdv";
import ServerFilterForm from "./Page/ServerFilterForm ";
import UserList from "./components/admin/UserList";
import Danhsachdon from "./components/Danhsachdon";
import Alldon from "./components/admin/Alldon";
import HistoryUser from "./components/user/HistoryUser";
import Naptien from "./components/user/Naptien";
import Banking from "./components/admin/Banking";

(function () {
  debugger;  // Khi DevTools mở, trình duyệt sẽ dừng lại ở đây
  // Thêm các lệnh khác ở đây
  console.log("Hàm đã chạy");
})();

const getRole = () => {
  return localStorage.getItem("role") || "";
};

const getToken = () => {
  return localStorage.getItem("token") || "";
};

function App() {
  const [role, setRole] = useState(getRole());
  const [token, setToken] = useState(getToken());

  useEffect(() => {
    const handleStorageChange = () => {
      setRole(getRole());
      setToken(getToken());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const isAdmin = () => token && role === "admin";

  return (
    <Router>
      <Routes>

        {/* Các trang không có Layout */}
        <Route path="/dang-nhap" element={<Login />} />
        <Route path="/dang-ky" element={<Register />} />

        {/* Các trang có Layout */}
        <Route path="/" element={token ? <Layout /> : <Navigate to="/dang-nhap" />}>
          <Route index element={<Home />} />

          <Route path="dichvu" element={token ? <ServerFilterForm /> : <Navigate to="/quantri" />} />
          <Route path="danh-sach-don" element={token ? <Danhsachdon /> : <Navigate to="/quantri" />} />
          <Route path="lich-su-hoat-dong" element={token ? <HistoryUser /> : <Navigate to="/quantri" />} />
          <Route path="nap-tien" element={token ? <Naptien /> : <Navigate to="/quantri" />} />



          <Route path="quantri" element={isAdmin() ? <Quantri /> : <Navigate to="/dang-nhap" />} />
          <Route path="quantri/doitac" element={isAdmin() ? <SmmForm /> : <Navigate to="/dang-nhap" />} />
          <Route path="quantri/dichvu" element={isAdmin() ? <Smmdv /> : <Navigate to="/dang-nhap" />} />
          <Route path="quantri/server" element={isAdmin() ? <Quantri /> : <Navigate to="/dang-nhap" />} />
          <Route path="quantri/tai-khoan" element={isAdmin() ? <UserList /> : <Navigate to="/dang-nhap" />} />
          <Route path="quantri/danhsachdon" element={isAdmin() ? <Alldon /> : <Navigate to="/dang-nhap" />} />
          <Route path="quantri/bank-king" element={isAdmin() ? <Banking /> : <Navigate to="/dang-nhap" />} />


        </Route>

        {/* Trang 404 */}
        <Route path="*" element={<h1>404 - Không tìm thấy trang</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
