import React, { useState } from "react";
import { toast } from "react-toastify";
import "../../style/AddBalanceForm.css";
import { addUserBalance } from "../../utils/apiAdmin"; // Import hàm cộng tiền từ file API

const AddBalanceForm = ({ user, onClose, onUserUpdated }) => {
  const [amount, setAmount] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Vui lòng nhập số tiền hợp lệ");
      return;
    }
    try {
      await addUserBalance(user._id, parsedAmount, token);
      toast.success("Cộng tiền thành công!");
      onUserUpdated();
      onClose();
    } catch (error) {
      toast.error("Lỗi khi cộng tiền!");
    }
  };

  return (
    <div className="add-balance-form-container">
      <h3>Cộng tiền cho người dùng: {user.username}</h3>
      <form onSubmit={handleSubmit}>
        <label>Số tiền cần cộng:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Nhập số tiền"
        />
        <button type="submit">Cộng tiền</button>
        <button type="button" onClick={onClose}>Hủy</button>
      </form>
    </div>
  );
};

export default AddBalanceForm;
