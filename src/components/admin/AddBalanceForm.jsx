import React, { useState } from "react";
import Swal from "sweetalert2";
import "../../style/AddBalanceForm.css";
import { addUserBalance } from "../../utils/apiAdmin";

const AddBalanceForm = ({ user, onClose, onUserUpdated }) => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Swal.fire({
        icon: "error",
        title: "Vui lòng nhập số tiền hợp lệ",
      });
      return;
    }
    try {
      setLoading(true);
      await addUserBalance(user._id, parsedAmount, token);
      Swal.fire({
        icon: "success",
        title: "Cộng tiền thành công!",
      });
      onUserUpdated();
      onClose();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.message || "Lỗi khi cộng tiền!",
      });
    } finally {
      setLoading(false);
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
            <div className="add-balance-form-container">
              <h3>Cộng tiền cho người dùng: {user.username}</h3>
              <form onSubmit={handleSubmit}>
                <label>
                  Số tiền cần cộng:{" "}
                  {Number(amount).toLocaleString("en-US")}
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Nhập số tiền"
                  disabled={loading}
                />
                <button type="submit" disabled={loading}>
                  {loading ? "Đang xử lý..." : "Cộng tiền"}
                </button>
                <button type="button" onClick={onClose} disabled={loading}>
                  Hủy
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBalanceForm;
