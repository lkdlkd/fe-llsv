import React, { useState, useEffect } from "react";
import { fetchUserInfo, fetchBanks } from "../../utils/api"; // Import các hàm API
// import "../../App.css"; // Import file CSS nếu cần
import Swal from "sweetalert2";

function Naptien() {
  const [banks, setBanks] = useState([]);
  const [user, setUser] = useState({});
  const username = localStorage.getItem("username");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  // Lấy thông tin người dùng khi component load
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await fetchUserInfo(username, token);
        setUser(userData);
      } catch (error) {
        setMessage(
          error.message || "Có lỗi xảy ra, vui lòng thử lại!"
        );
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

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => Swal.fire({
        title: "Thành công",
        text: `copy thành công `,
        icon: "success",
        confirmButtonText: "Xác nhận",
      }))
      .catch(err => console.error("Copy error:", err));
  };

  if (banks.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="row">
      {/* <div className="col-md-12 mb-3">
        <div className="row">
          <div className="col-6 d-grid gap-2">
            <a href="" className="btn btn-primary">Ngân hàng</a>
          </div>
          <div className="col-6 d-grid gap-2">
            <a href="" className="btn btn-outline-primary">Thẻ cào</a>
          </div>
        </div>
      </div> */}

      <div className="col-md-12">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Nạp tiền</h5>
          </div>
          <div className="card-body">
            <div className="alert alert-danger mb-0">
              <ul className="mb-0">
                <li className="fw-bold text-dark">Vui lòng nạp đúng tài khoản và nội dung</li>
                <li className="fw-bold text-dark">Sai nội dung hoặc quên không có nội dung bị phạt 20% (ví dụ nạp 100k còn 80k)</li>
                <li className="fw-bold text-dark">Nạp dưới min của web yêu cầu (mất tiền)</li>
                <li className="fw-bold text-dark">Không hỗ trợ nạp rồi rút ra với bất kì lý do gì</li>
                <li className="fw-bold text-dark">Sau 10p nếu chưa thấy tiền về tài khoản thì liên hệ trực tiếp Admin.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-12">
        {/* <div className="table-responsive">
          <table className="table table-striped table-bordered table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Số tiền lớn hơn hoặc bằng</th>
                <th>Khuyến mãi thêm</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>dd</td>
                <td>
                  <span className="badge bg-primary">100.000 VNĐ</span>
                </td>
                <td>
                  <span className="badge bg-success">10 %</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div> */}
        {banks.map((bank) => (
          <div key={bank._id} className="card">
            <div className="card-body">
              {/* <h4 className="card-title mb-3">Thanh toán hoá đơn - {bank.bank_name}</h4> */}
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
                          <p className="text-info fw-bolder ng-binding bank-name"
                            style={{ cursor: "pointer", color: "red", display: "inline-block" }}>
                            {bank.bank_name}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>Tên chủ tài khoản</td>
                        <td>
                          <p className="text-info fw-bolder ng-binding account-owner"
                            style={{ cursor: "pointer", color: "red", display: "inline-block" }}>
                            {bank.account_name}
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td>Số tài khoản</td>
                        <td>
                          <p className="text-info fw-bolder ng-binding account-number"
                            style={{ cursor: "pointer", color: "red", display: "inline-block" }}>
                            {bank.account_number}
                          </p>
                          <button
                            type="button"
                            className="btn btn-primary text-sm btn-sm ml-3 btn-copy"
                            onClick={() => handleCopy(bank.account_number)}
                          >
                            <span><i className="fas fa-copy"></i></span>
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>Nội dung chuyển khoản</td>
                        <td>
                          <p className="text-info fw-bolder ng-binding content-tranfer"
                            style={{ cursor: "pointer", color: "red", display: "inline-block" }}>
                            lsv {user.username}
                          </p>
                          <button
                            type="button"
                            className="btn btn-primary text-sm btn-sm ml-3 btn-copy"
                            onClick={() => handleCopy(`likesubviet ${user.username}`)}
                          >
                            <span><i className="fas fa-copy"></i></span>
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td>Nạp ít nhất</td>
                        <td>
                          <p
                            className="text-info fw-bolder ng-binding amount-money"
                            style={{ cursor: "pointer", color: "red", display: "inline-block" }}
                          >
                            {bank?.min_recharge ? Number(bank.min_recharge).toLocaleString("vi-VN") : "0"}đ
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
                      src={`https://img.vietqr.io/image/${bank.bank_name}-${bank.account_number}-qronly2.jpg?accountName=${bank.account_name}&addInfo=likesubviet ${username}&amount=${bank.min_recharge}`}
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
      </div>

      <div className="col-md-12">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Nạp thẻ cào</h5>
          </div>
          <div className="card-body">
            <form action="" method="POST">
              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">Loại thẻ</label>
                    <select name="card_type" id="card_type" className="form-control">
                      <option value="VIETTEL">Viettel</option>
                      <option value="MOBIFONE">Mobifone</option>
                      <option value="VINAPHONE">Vinaphone</option>
                      <option value="VIETNAMMOBILE">Vietnamobile</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">Mệnh giá</label>
                    <select name="card_value" id="card_value" className="form-control">
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
                    <input type="text" name="card_seri" id="card_seri" className="form-control" placeholder="Nhập dữ liệu...." />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label className="form-label">Mã thẻ</label>
                    <input type="text" name="card_code" id="card_code" className="form-control" placeholder="Nhập dữ liệu...." />
                  </div>
                </div>
                <div className="col-md-12">
                  <button type="submit" className="btn btn-primary col-12" id="btnRechargeCard">
                    Nạp thẻ cào
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* <div className="col-md-12">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title">Lịch sử nạp thẻ cào</h5>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-striped table-bordered table-hover">
                <thead>
                  <tr>
                    <th>ID</th>

                    <th>Loại thẻ</th>
                    <th>Mệnh giá</th>
                    <th>Seri</th>
                    <th>Mã thẻ</th>
                    <th>Thực nhận</th>
                    <th>Trạng thái</th>
                    <th>Thời gian gửi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colspan="12" class="text-center">
                      <div class="d-flex justify-content-center align-items-center">
                        <div class="text-center">
                          <img src="" alt="Không tìm thấy dữ liệu" class="img-fluid" style={{ maxwidth: "100px" }} />
                          <h4 class="text-muted">Không tìm thấy dữ liệu</h4>
                        </div>
                      </div>
                    </td>
                  </tr>

                </tbody>
              </table>
              <div class="d-flex justify-content-center align-items-center">

              </div>
            </div>
          </div>
        </div>
      </div> */}

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
                    <td colspan="12" class="text-center">
                      <div class="d-flex justify-content-center align-items-center">
                        <div class="text-center">
                          <h4 class="text-muted">Không tìm thấy dữ liệu</h4>
                        </div>
                      </div>
                    </td>
                  </tr>
                  {/* <tr>
                    <td>1</td>
                    <td>
                      <span className="badge bg-success"></span>
                      <span className="badge bg-primary">10000</span>
                    </td>
                    <td>22:22 20/10/2025</td>
                    <td>
                      <span className="badge bg-primary">Nạp tiền</span>
                    </td>
                    <td>ACB</td>
                    <td>Không xác định</td>
                    <td>100.000 VNĐ</td>
                    <td>
                      <span className="badge bg-success">Thành công</span>
                    </td>
                    <td>
                      <textarea className="form-control" rows="1" readOnly>
                        lê khánh đăng chuyển tiền nd : likesubviet user
                      </textarea>
                    </td>
                  </tr> */}
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
                  <tr>
                    <td colspan="12" class="text-center">
                      <div class="d-flex justify-content-center align-items-center">
                        <div class="text-center">
                          <h4 class="text-muted">Không tìm thấy dữ liệu</h4>
                        </div>
                      </div>
                    </td>
                  </tr>
                  {/* <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>VNĐ</td>
                    <td></td>
                    <td></td>
                    <td>VNĐ</td>
                    <td>
                      <span className="badge bg-warning">Chờ xử lý</span>
                      <span className="badge bg-success">Thành công</span>
                      <span className="badge bg-danger">Thất bại</span>
                    </td>
                  </tr> */}
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
