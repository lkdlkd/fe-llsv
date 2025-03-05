import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../App.css";


function Home() {
  const [user, setUser] = useState([]);
  const username = localStorage.getItem("username");
  const [message, setMessage] = useState("");
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/api/user/${username}`, {
          params: { username },
        });
        setUser(response.data);
      } catch (error) {
        setMessage(
          error.response ? error.response.data.message : "Có lỗi xảy ra, vui lòng thử lại!"
        );
        console.error("Lỗi khi lấy thông tin user", error);
      }
    };
    fetchUser();
  }, [username]);
  return (
    <div className="row">
      <div className="col-md-6 col-xxl-3">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                <div className="avtar bg-light-primary me-1">
                  <i className="ti ti-currency-dollar fs-2"></i>
                </div>
              </div>
              <div className="flex-grow-1 ms-3">
                <h4 className="mb-0">{Number(user.balance).toLocaleString("vi-VN")}đ</h4>
                <h6 className="mb-0">Số dư hiện tại</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-md-6 col-xxl-3">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                <div className="avtar bg-light-warning me-1">
                  <i className="ti ti-calendar-minus fs-2"></i>
                </div>
              </div>
              <div className="flex-grow-1 ms-3">
                <h4 className="mb-0">0đ</h4>
                <h6 className="mb-0">Tổng nạp tháng</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-md-6 col-xxl-3">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                <div className="avtar bg-light-success me-1">
                  <i className="ti ti-layers-intersect fs-2"></i>
                </div>
              </div>
              <div className="flex-grow-1 ms-3">
                <h4 className="mb-0">{Number(user.tongnap).toLocaleString("vi-VN")}đ</h4>
                <h6 className="mb-0">Tổng nạp</h6>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-6 col-xxl-3">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                <div className="avtar bg-light-info me-1">
                  <i className="ti ti-diamond fs-2"></i>
                </div>
              </div>
              <div className="flex-grow-1 ms-3">
                <h4 className="mb-0">{user.role}</h4>
                <h6 className="mb-0">Cấp bậc</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
