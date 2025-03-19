import React, { useState } from "react";
import Swal from "sweetalert2";
import { deductBalance } from "../../utils/apiAdmin";

const DeductBalanceForm = ({ user, onClose, onUserUpdated }) => {
  const [amount, setAmount] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Swal.fire({
        icon: "error",
        title: "Số tiền không hợp lệ",
      });
      return;
    }
    try {
      const data = await deductBalance(user._id, numericAmount, token);
      Swal.fire({
        icon: "success",
        title: data.message || "Trừ tiền thành công",
      });
      onUserUpdated(); // Cập nhật lại danh sách hoặc thông tin người dùng
      onClose(); // Đóng form
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.message || "Lỗi khi trừ tiền",
      });
    }
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Chỉnh sửa số dư</h5>
          </div>
          <div className="card-body">
            <div className="deduct-balance-form">
              <h4>Trừ tiền cho {user.username}</h4>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Số tiền cần trừ: {Number(amount).toLocaleString("en-US")}</label>
                  <input
                    type="number"
                    className="form-control"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Nhập số tiền"
                  />
                </div>
                <div className="form-group mt-2">
                  <button type="submit" className="btn btn-danger">
                    Trừ tiền
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={onClose}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeductBalanceForm;
