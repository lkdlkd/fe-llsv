import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../../style/UserEdit.css";  // Import file CSS

const UserEdit = ({ user, onClose, onUserUpdated }) => {
  const [formData, setFormData] = useState(user);
  const token = localStorage.getItem('token'); // Hoặc cách lưu trữ khác

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${process.env.REACT_APP_URL}/api/user/update/${user._id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      toast.success("Cập nhật thành công!");
      onUserUpdated();
      onClose();
    } catch (error) {
      toast.error("Lỗi khi cập nhật!");
    }
  };

  return (
    <div className="user-form-container">
      <h3>Cập nhật người dùng</h3>
      <form onSubmit={handleSubmit}>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          disabled
        /><br />
        
        <label>Role:</label>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select><br />
        
        <label>Balance:</label>
        <input
          type="number"
          name="balance"
          value={formData.balance}
          onChange={handleChange}
        /><br />
        
        <button type="submit">Lưu</button>
        <button type="button" onClick={onClose}>Hủy</button>
      </form>
    </div>
  );
};

export default UserEdit;
