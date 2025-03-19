import React, { useState } from "react";
import { toast } from "react-toastify";
import { changePassword } from "../../utils/api";
import Swal from "sweetalert2";

const ChangePasswordForm = ({ userId, onPasswordChanged }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      Swal.fire({
        title: "Lỗi",
        text: "mật khẩu mới không khớp !",
        icon: "error",
        confirmButtonText: "Xác nhận",
      });      
      return;
    }
    try {
      const data = await changePassword(userId, oldPassword, newPassword, token);
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      Swal.fire({
        title: "Thành công",
        text: "Đổi mật khẩu thành công",
        icon: "success",
        confirmButtonText: "Xác nhận",
      });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      if (onPasswordChanged) onPasswordChanged();
    } catch (error) {
      const errorMessage = error.error || error.message || "Có lỗi xảy ra!";
      Swal.fire({
        title: "Lỗi",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "Xác nhận",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-12 form-group">
          <label htmlFor="current_password" className="form-label">
            Mật khẩu hiện tại:
          </label>
          <input
            id="current_password"
            className="form-control"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div className="col-md-12 form-group">
          <label htmlFor="new_password" className="form-label">
            Mật khẩu mới:
          </label>
          <input
            id="new_password"
            className="form-control"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="col-md-12 form-group">
          <label htmlFor="confirm_password" className="form-label">
            Xác nhận mật khẩu:
          </label>
          <input
            id="confirm_password"
            className="form-control"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="col-md-12 form-group">
          <button type="submit" className="btn btn-primary col-12">
            <i className="ti ti-lock"></i>
            Thay đổi mật khẩu
          </button>
        </div>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
