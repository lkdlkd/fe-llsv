import React, { useEffect, useState } from "react";
import { fetchUserData } from "../utils/api"; // Import API từ file api.js
import $ from "jquery"; // Import jQuery
// import $ from "jquery";
// styles.scss
// @import "_utilities"; // nếu utilities nằm cùng thư mục hoặc đường dẫn chính xác
// Các style khác...
// import "../style/_utilities.scss";
import * as bootstrap from "bootstrap"; // Import Bootstrap dưới dạng module
import "../App.css";

function Home() {
  const [user, setUser] = useState({});
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");


  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await fetchUserData(username, token);
        setUser(data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin user", error);
      }
    };

    if (username && token) {
      getUser();
    }
  }, [username, token]);


  useEffect(() => {
    const time = 60 * 60 *1000; // 1 phút
    const savedTime = Number(localStorage.getItem("isNoticeModal"));
    const modalElement = document.getElementById("notiModal");

    if (modalElement) {
      if (!savedTime || new Date().getTime() - savedTime > time) {
        const notiModal = new bootstrap.Modal(modalElement, {
          backdrop: false, // không hiển thị backdrop
        });
        notiModal.show();

        // Sau khi modal ẩn xong, dispose modal để loại bỏ khỏi DOM
        modalElement.addEventListener("hidden.bs.modal", () => {
          notiModal.dispose();
        });
      }
    }

    const closeBtn = document.getElementById("btn-close-notice");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        localStorage.setItem("isNoticeModal", new Date().getTime());
        if (modalElement) {
          const notiModal = bootstrap.Modal.getInstance(modalElement);
          if (notiModal) {
            notiModal.hide();
          }
        }
      });
    }
  }, []);




  return (
    <>
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
                  <h4 className="mb-0">
                    {Number(user.balance || 0).toLocaleString("vi-VN")}đ
                  </h4>
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
                  <h4 className="mb-0">
                    {user ? user.tongnapthang : "Đang tải..."}
                  </h4>
                  <h6 className="mb-0">
                    Tổng nạp tháng{" "}
                    {new Date().toLocaleString("default", { month: "long" })}
                  </h6>
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
                  <h4 className="mb-0">
                    {Number(user.tongnap || 0).toLocaleString("vi-VN")}đ
                  </h4>
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
                  <h4 className="mb-0">{user.capbac || "Chưa có"}</h4>
                  <h6 className="mb-0">Cấp bậc</h6>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="scroll h-500px">
            <div className="alert bg-primary text-white fw-bold" role="alert">
              <div className="mb-0">Thông báo hệ thống</div>
            </div>
          </div>
          <div
            className="alert bg-fxt-btn-fill bg-white text-dark border border-primary text-white fw-bold"
            role="alert"
          >
            <div className="mb-0">
              <p></p>
              <p
                style={{ color: "#e74c3c" }}
                className="mb-2 text-[20px] font-bold"
              >
                CÁC TRẠNG THÁI DỊCH VỤ:
              </p>
              <ul>
                <li>
                  <span className="badge bg-success">Hoàn thành</span>{" "}
                  <span style={{ color: "#000000" }}>
                    : Hoàn thành đơn hàng.
                  </span>
                </li>
                <li>
                  <span className="badge bg-primary">Đang chạy</span>{" "}
                  <span style={{ color: "#000000" }}>
                    : Đơn hàng trong tiến trình chạy, vui lòng chờ.
                  </span>
                </li>
                <li>
                  <span className="badge bg-danger">Đã hủy</span>{" "}
                  <span style={{ color: "#000000" }}>
                    : Có lỗi trong tiến trình, liên hệ admin kiểm tra.
                  </span>
                </li>
                <li>
                  <span className="badge bg-warning">Chờ xử lý</span>{" "}
                  <span style={{ color: "#000000" }}>
                    : Đơn hàng đang chờ lên đơn.
                  </span>
                </li>

                <br />
                <li>
                  <span className="badge bg-warning">Chờ xử lý</span>{" "}
                  <span style={{ color: "#000000" }}>
                    : Thẻ cào đã được gửi đi và đang chờ xét thẻ.
                  </span>
                </li>
                <li>
                  <span className="badge bg-success">Thành công</span>{" "}
                  <span style={{ color: "#000000" }}>
                    : Thẻ gửi đúng và được cộng tiền.
                  </span>
                </li>
                <li>
                  <span className="badge bg-danger">Thất bại</span>{" "}
                  <span style={{ color: "#000000" }}>
                    : Thẻ gửi sai hoặc đã được sử dụng trước đó.
                  </span>
                </li>
              </ul>
              <p></p>
            </div>
          </div>

          {/* <div className="row">
            <h2 className="text-center fw-bold text-gray-700">Tên nền tảng</h2>
            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <a
                    href="#"
                    className="d-flex justify-content-center flex-column align-items-center gap-2"
                  >
                    <img
                      src="https://via.placeholder.com/50"
                      width="50"
                      height="50"
                      className="img-fluid"
                      alt="Dịch vụ"
                    />
                    <div className="text-center fw-bold text-gray-700">
                      Tên dịch vụ
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div> */}
        </div>

        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-header">
              <h5 className="card-title">Hoạt động gần đây</h5>
            </div>
            <div className="card-body">
              <div className="scroll h-350px">
                <div className="list-group list-group-flush">
                  <div className="list-group-item list-group-item-action py-2 px-3 cursor-pointer rounded">
                    <div className="media align-items-center gap-2">
                      <div className="chat-avtar">
                        <div className="avtar avtar-s bg-light-info">
                          <i className="ti ti-bell-ringing fs-4"></i>
                        </div>
                      </div>
                      <div className="media-body mx-2">
                        <span className="f-18 text-muted fw-bold mb-1">
                          Nội dung thông báo gần đây
                        </span>
                        <p className="f-12 text-muted">
                          <i className="ti ti-clock"></i> Thời gian tạo thông báo
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal thông báo */}
      <div
        className="modal fade modal-animate"
        id="notiModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              <div className="modal-body">
                <div className="modal-header">
                  <h4 className="modal-title">Thông báo</h4>
                </div>
                <p>
                  Admin website <strong>LIKESUBVIET.COM</strong>
                  {/* cọc bảo hiểm{" "}
                  <strong>CHECKSCAM.VN</strong> 30.000.000 vnđ cho ae yên tâm mua hàng
                  tại web nhé! */}
                </p>
                {/* <p>
                  Link check bảo hiểm:{" "}
                  <a
                    title="Bấm vào đây để check uy tín"
                    href="https://admin.checkscam.vn/doan-quang-chung/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    BẤM VÀO ĐÂY ĐỂ CHECK UY TÍN
                  </a>
                </p> */}
                {/* <p>
                  Website bán nguyên liệu clone, via facebook, tài nguyên MMO:&nbsp;{" "}
                  <a
                    href="https://shopviavn.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    SHOPVIAVN.COM
                  </a>
                </p> */}
                {/* <p>
                  Nhóm Thông Báo - Update - Giao Lưu:{" "}
                  <a
                    href="https://t.me/+P6IE8iqDELxmYjg9"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    BẤM VÀO ĐÂY ĐỂ THAM GIA NHÓM
                  </a>
                </p> */}
                <p>
                  Nạp Tiền Tự Động Ghi Đúng Nội Dung, Đúng STK 30s -1p Tiền Tự Vào Tài Khoản
                </p>
                <p>
                  <strong>Min nạp tiền tối thiểu: 10.000 vnđ</strong>
                </p>
                <div className="mt-2 d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-primary shadow-2"
                    id="btn-close-notice"
                  >
                    Tôi đã đọc
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
