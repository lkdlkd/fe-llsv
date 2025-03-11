import React, { useState, useEffect } from "react";
import "../../SmmForm.css"; // Import file CSS
import { fetchSmmPartners, addSmmPartner, deleteSmmPartner } from "../../utils/apiAdmin";

const SmmForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    url_api: "",
    api_token: "",
    price_update: "",
    status: "on",
    update_price: "on"
  });
  const token = localStorage.getItem('token');

  const [smmPartners, setSmmPartners] = useState([]);

  // Lấy danh sách đối tác từ API khi load trang
  useEffect(() => {
    loadSmmPartners();
  }, []);

  const loadSmmPartners = async () => {
    try {
      const data = await fetchSmmPartners(token);
      setSmmPartners(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách đối tác:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addSmmPartner(formData, token);
      alert("Đã thêm đối tác thành công!");
      loadSmmPartners(); // Cập nhật danh sách sau khi thêm
      setFormData({
        name: "",
        url_api: "",
        api_token: "",
        price_update: "",
        status: "on",
        update_price: "on"
      });
    } catch (error) {
      console.error("Lỗi khi thêm đối tác:", error);
      alert("Có lỗi xảy ra!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSmmPartner(id, token);
      loadSmmPartners(); // Cập nhật danh sách sau khi xóa
    } catch (error) {
      console.error("Lỗi khi xóa đối tác:", error);
    }
  };

  return (
    <div className="smm-form-container">
      <h2 className="smm-form-title">Thêm Đối Tác SMM</h2>
      <form className="smm-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tên Đối Tác:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>URL API:</label>
          <input
            type="text"
            name="url_api"
            value={formData.url_api}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>API Token:</label>
          <input
            type="text"
            name="api_token"
            value={formData.api_token}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Cập Nhật Giá:</label>
          <input
            type="text"
            name="price_update"
            value={formData.price_update}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Trạng Thái:</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="on">Bật</option>
            <option value="off">Tắt</option>
          </select>
        </div>

        <div className="form-group">
          <label>Cập Nhật Giá Tự Động:</label>
          <select
            name="update_price"
            value={formData.update_price}
            onChange={handleChange}
          >
            <option value="on">Bật</option>
            <option value="off">Tắt</option>
          </select>
        </div>

        <button type="submit" className="submit-btn">
          Thêm Đối Tác
        </button>
      </form>
      <h2 className="smm-list-title">Danh Sách Đối Tác SMM</h2>

      <div className="rsp-table">
        {/* Hiển thị danh sách đối tác */}
        <table className="smm-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>URL API</th>
              <th>Trạng Thái</th>
              <th>Cập Nhật Giá</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {smmPartners.map((partner, index) => (
              <tr key={partner._id}>
                <td>{index + 1}</td>
                <td>{partner.name}</td>
                <td>{partner.url_api}</td>
                <td>{partner.status}</td>
                <td>{partner.update_price}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(partner._id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SmmForm;
