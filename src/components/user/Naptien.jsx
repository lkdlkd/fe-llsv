import React, { useState, useEffect } from "react";
import axios from "axios";
import { fetchUserInfo, fetchBanks, rechargeCard, getThecao } from "../../utils/api";
import Swal from "sweetalert2";

function Naptien() {
  const [banks, setBanks] = useState([]);
  const [user, setUser] = useState({});
  const [message, setMessage] = useState("");
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const [thecao, setTransactions] = useState([]);
  // State lưu thông tin thẻ cào
  const [cardData, setCardData] = useState({
    card_type: "VIETTEL",
    card_value: "10000",
    card_seri: "",
    card_code: "",
  });

  // Lấy thông tin người dùng khi component load
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await fetchUserInfo(username, token);
        setUser(userData);
      } catch (error) {
        setMessage(error.message || "Có lỗi xảy ra, vui lòng thử lại!");
        console.error("Lỗi khi lấy thông tin user", error);
      }
    };
    if (username && token) loadUser();
  }, [username, token]);

  // Lấy danh sách ngân hàng khi component load
  useEffect(() => {
    const loadBanks = async () => {
      try {
        const banksData = await fetchBanks(token);
        setBanks(banksData);
      } catch (error) {
        console.error("Error fetching bank info:", error);
      }
    };
    if (token) loadBanks();
  }, [token]);


  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getThecao(token);
        setTransactions(data);
      } catch (err) {
        setMessage(err);
      }
    };

    if (token) {
      fetchTransactions();
    } else {
      setMessage("Chưa có token đăng nhập.");
    }
  }, [token]);
  const handleCopy = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() =>
        Swal.fire({
          title: "Thành công",
          text: `Copy thành công`,
          icon: "success",
          confirmButtonText: "Xác nhận",
        })
      )
      .catch((err) => console.error("Copy error:", err));
  };

  // Cập nhật state cho từng input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Hàm xử lý nạp thẻ cào sử dụng state thay vì FormData
  const handleRechargeCard = async (e) => {
    e.preventDefault();
    const { card_type, card_value, card_seri, card_code } = cardData;
    // console.log("da", cardData)
    try {
      const res = await rechargeCard({
        card_type,
        card_value,
        card_seri,
        card_code,
        token: token,
      });
      Swal.fire({
        title: "Thành công",
        text: res.message,
        icon: "success",
        confirmButtonText: "OK",
      });
      // Reset form sau khi nạp thành công (nếu muốn)
      setCardData({
        card_type: "VIETTEL",
        card_value: "10000",
        card_seri: "",
        card_code: "",
      });
    } catch (error) {
      console.error("Lỗi nạp thẻ:", error);
      Swal.fire({
        title: "Lỗi",
        text: error.error || "Có lỗi xảy ra",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  if (banks.length === 0) {
    return <div>Loading...</div>;
  }
  console.log("tc ", thecao)
  return (
    <div className="row">
      {/* Phần thông tin ngân hàng và nạp tiền qua chuyển khoản, quét mã QR */}
      <div className="col-md-12">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Nạp tiền</h5>
          </div>
          <div className="card-body">
            <div className="alert alert-danger mb-0">
              <ul className="mb-0">
                <li className="fw-bold text-dark">
                  Vui lòng nạp đúng tài khoản và nội dung
                </li>
                <li className="fw-bold text-dark">
                  Sai nội dung hoặc quên không có nội dung bị phạt 20% (ví dụ nạp
                  100k còn 80k)
                </li>
                <li className="fw-bold text-dark">
                  Nạp dưới min của web yêu cầu (mất tiền)
                </li>
                <li className="fw-bold text-dark">
                  Không hỗ trợ nạp rồi rút ra với bất kì lý do gì
                </li>
                <li className="fw-bold text-dark">
                  Sau 10p nếu chưa thấy tiền về tài khoản thì liên hệ trực tiếp Admin.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {banks.map((bank) => (
        <div key={bank._id} className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="py-3 text-center bg-light-primary rounded-2 fw-bold mb-4">
                  Nạp tiền qua chuyển khoản
                </div>
                <table className="table table-row-dashed table-row-gray-300 gy-7">
                  <tbody>
                    <tr>
                      <td>Ngân Hàng</td>
                      <td>
                        <p
                          className="text-info fw-bolder ng-binding bank-name"
                          style={{
                            cursor: "pointer",
                            color: "red",
                            display: "inline-block",
                          }}
                        >
                          {bank.bank_name}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>Tên chủ tài khoản</td>
                      <td>
                        <p
                          className="text-info fw-bolder ng-binding account-owner"
                          style={{
                            cursor: "pointer",
                            color: "red",
                            display: "inline-block",
                          }}
                        >
                          {bank.account_name}
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td>Số tài khoản</td>
                      <td>
                        <p
                          className="text-info fw-bolder ng-binding account-number"
                          style={{
                            cursor: "pointer",
                            color: "red",
                            display: "inline-block",
                          }}
                        >
                          {bank.account_number}
                        </p>
                        <button
                          type="button"
                          className="btn btn-primary text-sm btn-sm ml-3 btn-copy"
                          onClick={() => handleCopy(bank.account_number)}
                        >
                          <span>
                            <i className="fas fa-copy"></i>
                          </span>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>Nội dung chuyển khoản</td>
                      <td>
                        <p
                          className="text-info fw-bolder ng-binding content-tranfer"
                          style={{
                            cursor: "pointer",
                            color: "red",
                            display: "inline-block",
                          }}
                        >
                          lsv {user.username}
                        </p>
                        <button
                          type="button"
                          className="btn btn-primary text-sm btn-sm ml-3 btn-copy"
                          onClick={() =>
                            handleCopy(`likesubviet ${user.username}`)
                          }
                        >
                          <span>
                            <i className="fas fa-copy"></i>
                          </span>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>Nạp ít nhất</td>
                      <td>
                        <p
                          className="text-info fw-bolder ng-binding amount-money"
                          style={{
                            cursor: "pointer",
                            color: "red",
                            display: "inline-block",
                          }}
                        >
                          {bank?.min_recharge
                            ? Number(bank.min_recharge).toLocaleString("en-US")
                            : "0"}
                          đ
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="col-md-6">
                <div className="py-3 text-center bg-light-primary rounded-2 fw-bold mb-4">
                  Nạp tiền qua quét mã QR
                </div>
                <div className="text-center mb-3">
                  <img
  src={`https://img.vietqr.io/image/${bank.bank_name}-${bank.account_number}-qronly2.jpg?accountName=${encodeURIComponent(bank.account_name)}&addInfo=${encodeURIComponent(`lsv ${username}`)}`}
  alt="QR CODE"
  width="300"
/>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {message && <p className="text-danger">{message}</p>}

      <div className="col-md-12">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Nạp thẻ cào</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleRechargeCard}>
              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">Loại thẻ</label>
                    <select
                      name="card_type"
                      id="card_type"
                      className="form-control"
                      value={cardData.card_type}
                      onChange={handleInputChange}
                    >
                      <option value="VIETTEL">Viettel (Chiết khấu 25%)</option>
                      <option value="MOBIFONE">Mobifone (Chiết khấu 25%)</option>
                      <option value="VINAPHONE">Vinaphone (Chiết khấu 25%)</option>
                      <option value="VIETNAMMOBILE">Vietnamobile (Chiết khấu 25%)</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">Mệnh giá</label>
                    <select
                      name="card_value"
                      id="card_value"
                      className="form-control"
                      value={cardData.card_value}
                      onChange={handleInputChange}
                    >
                      <option value="10000">10,000 VNĐ</option>
                      <option value="20000">20,000 VNĐ</option>
                      <option value="30000">30,000 VNĐ</option>
                      <option value="50000">50,000 VNĐ</option>
                      <option value="100000">100,000 VNĐ</option>
                      <option value="200000">200,000 VNĐ</option>
                      <option value="300000">300,000 VNĐ</option>
                      <option value="500000">500,000 VNĐ</option>
                      <option value="1000000">1,000,000 VNĐ</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">Seri</label>
                    <input
                      type="text"
                      name="card_seri"
                      id="card_seri"
                      className="form-control"
                      placeholder="Nhập dữ liệu...."
                      value={cardData.card_seri}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">Mã thẻ</label>
                    <input
                      type="text"
                      name="card_code"
                      id="card_code"
                      className="form-control"
                      placeholder="Nhập dữ liệu...."
                      value={cardData.card_code}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <button type="submit" className="btn btn-primary col-12">
                    Nạp thẻ cào
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Các bảng lịch sử giao dịch */}
      <div className="col-md-12">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Lịch sử nạp tiền ngân hàng</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Mã giao dịch</th>
                    <th>Thời gian</th>
                    <th>Loại giao dịch</th>
                    <th>Cổng thanh toán</th>
                    <th>Người chuyển</th>
                    <th>Số tiền</th>
                    <th>Trạng thái</th>
                    <th>Nội dung</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="12" className="text-center">
                      <div className="d-flex justify-content-center align-items-center">
                        <div className="text-center">
                          <h4 className="text-muted">Không tìm thấy dữ liệu</h4>
                        </div>
                      </div>
                    </td>
                  </tr>
                  {/* Các dòng dữ liệu lịch sử */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-12">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Lịch sử nạp thẻ cào</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped table-bordered table-hover">
                <thead>

                  <tr>
                    <th>ID</th>
                    <th>Thời gian</th>
                    <th>Loại thẻ</th>
                    <th>Mệnh giá</th>
                    <th>Seri</th>
                    <th>Mã thẻ</th>
                    <th>Thực nhận</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {thecao.map((thecao, index) => (

                    <tr key={index}>
                      {/* <td colSpan="12" className="text-center">
                      <div className="d-flex justify-content-center align-items-center">
                        <div className="text-center">
                          <h4 className="text-muted">Không tìm thấy dữ liệu</h4>
                        </div>
                      </div>
                    </td> */}
                      <td>{index + 1}</td>
                      <td>
                        {new Date(thecao.createdAt).toLocaleString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                      <td>{thecao.type}</td>
                      <td>{thecao.amount}</td>
                      <td>{thecao.serial}</td>
                      <td>{thecao.code}</td>
                      <td>{thecao.real_amount}</td>
                      <td>
                        {thecao.status === "success" ? (
                          <span className="badge badge-success">Hoàn thành</span>
                        ) : thecao.status === "pending" ? (
                          <span className="badge bg-primary">Đang xử lý</span>
                        ) : thecao.status === "warning" ? (
                          <span className="badge bg-primary">Sai mệnh giá</span>
                        ) : thecao.status === "failed" ? (
                          <span className="badge badge-danger">Thẻ lỗi</span>
                        ) : (
                          <span>{thecao.status}</span>
                        )}
                      </td>                      </tr>
                  ))}
                  {/* Các dòng dữ liệu lịch sử */}
                </tbody>
              </table>
              <div className="d-flex justify-content-center align-items-center"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Naptien;
