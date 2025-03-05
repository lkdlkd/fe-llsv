import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../SmmForm.css"; // Import file CSS riêng

const Smmdv = () => {
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    description: "",
    maychu: "",
    getid: "off",
    comment: "off",    // mặc định tắt (off)
    reaction: "off",
    matlive: "off",
    min: "",
    max: "",
    rate: "",
    DomainSmm: "",
    Linkdv: "",
    serviceId: "",
    serviceName: "",
    Magoi: "",
    isActive: true,
    category: ""
  });

  const [smmPartners, setSmmPartners] = useState([]);
  const [services, setServices] = useState([]);
  const [server, setServer] = useState([]);
  const [editMode, setEditMode] = useState(false); // Chế độ sửa hay thêm mới
  const [editService, setEditService] = useState(null); // Lưu thông tin dịch vụ cần sửa

  useEffect(() => {
    fetchSmmPartners();
    fetchServer();
  }, []);

  const fetchSmmPartners = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/api/smm`);
      setSmmPartners(response.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách đối tác:", error);
    }
  };

  const fetchServer = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/api/server`);
      setServer(response.data.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách máy chủ:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        // Sửa dịch vụ
        await axios.put(`${process.env.REACT_APP_URL}/api/server/update/${editService.id}`, formData);
        alert("Đã sửa dịch vụ thành công!");
      } else {
        // Thêm mới dịch vụ
        await axios.post(`${process.env.REACT_APP_URL}/api/server/add`, formData);
        alert("Đã thêm dịch vụ thành công!");
      }
      fetchSmmPartners(); // Cập nhật lại danh sách sau khi thêm/sửa
      setEditMode(false);
      setEditService(null);
    } catch (error) {
      console.error("Lỗi khi xử lý dữ liệu:", error);
      alert("Có lỗi xảy ra!");
    }
  };

  const handleEdit = (serverItem) => {
    setEditMode(true);
    setEditService(serverItem);
    const newFormData = {
      ...serverItem,
      DomainSmm: serverItem.DomainSmm,
      serviceId: serverItem.serviceId,
      name: serverItem.name,
      min: serverItem.min,
      max: serverItem.max,
      rate: serverItem.rate,
      Magoi: serverItem.Magoi,
      maychu: serverItem.maychu,
      Linkdv: serverItem.Linkdv,
      comment: serverItem.comment,
      reaction: serverItem.reaction,
      matlive: serverItem.matlive
    };
    console.log(newFormData);
    setFormData(newFormData);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_URL}/api/server/delete/${id}`);
      fetchSmmPartners();
    } catch (error) {
      console.error("Lỗi khi xóa dịch vụ:", error);
    }
  };

  const handleDomainChange = async (e) => {
    const domain = e.target.value;
    setFormData({ ...formData, DomainSmm: domain, serviceId: "", serviceName: "" });
    setServices([]);

    const smmPartner = smmPartners.find((partner) => partner.name === domain);
    if (!smmPartner) {
      console.error("Không tìm thấy đối tác với domain:", domain);
      return;
    }
    try {
      const response = await axios.post(smmPartner.url_api, {
        key: smmPartner.api_token,
        action: "services"
      });
      setServices(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu từ bên thứ 3:", error);
    }
  };

  const handleServiceChange = (e) => {
    const selectedServiceId = e.target.value;
    const selectedService = services.find(
      (service) => String(service.service) === selectedServiceId
    );
    if (selectedService) {
      setFormData({
        ...formData,
        min: selectedService.min,
        max: selectedService.max,
        // rate : Number(selectedService.rate).toLocaleString("vi-VN"),
        rate: selectedService.rate * 25,
        serviceId: selectedService.service,
        serviceName: selectedService.name
      });
    }
  };

  return (
    <div class="main-content">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h2 className="smmdv-title">{editMode ? "Sửa Dịch Vụ" : "Thêm Dịch Vụ SMM"}</h2>
              <div class="form-group mb-3">
                <form className="smmdv-form" onSubmit={handleSubmit}>
                  <label>Loại dịch vụ:</label>
                  <input type="text" name="type" value={formData.type} onChange={handleChange} required />

                  <label>Danh mục:</label>
                  <input type="text" name="category" value={formData.category} onChange={handleChange} required />

                  <label>Máy chủ:</label>
                  <input type="text" name="maychu" value={formData.maychu} onChange={handleChange} />

                  <label>Tên dịch vụ:</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required />

                  <label>Mô tả:</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} />

                  <label>Mã gói:</label>
                  <input type="text" name="Magoi" value={formData.Magoi} onChange={handleChange} required />

                  <label>Link dịch vụ:</label>
                  <input type="text" name="Linkdv" value={formData.Linkdv} onChange={handleChange} required />

                  <h2>CÁC CHỨC NĂNG</h2>

                  <label>Chức năng Get ID:</label>
                  <select name="getid" value={formData.getid} onChange={handleChange}>
                    <option value="on">Bật</option>
                    <option value="off">Tắt</option>
                  </select>

                  {/* Các trường bổ sung chức năng */}
                  <label>Chức năng Comment:</label>
                  <select name="comment" value={formData.comment} onChange={handleChange}>
                    <option value="on">Bật</option>
                    <option value="off">Tắt</option>
                  </select>

                  <label>Chức năng Reaction:</label>
                  <select name="reaction" value={formData.reaction} onChange={handleChange}>
                    <option value="on">Bật</option>
                    <option value="off">Tắt</option>
                  </select>

                  <label>Chức năng Matlive:</label>
                  <select name="matlive" value={formData.matlive} onChange={handleChange}>
                    <option value="on">Bật</option>
                    <option value="off">Tắt</option>
                  </select>

                  <h2>CHỌN SERVER BÊN SMM</h2>
                  <label>Domain SMM:</label>
                  <select
                    name="DomainSmm"
                    value={formData.DomainSmm}
                    onChange={handleDomainChange}
                    required
                    disabled={editMode} // disable editing in update mode

                  >
                    <option value="">Chọn domain</option>
                    {smmPartners.map((partner) => (
                      <option key={partner.id} value={partner.name}>
                        {partner.name}
                      </option>
                    ))}
                  </select>

                  <label>Tên dịch vụ bên SMM:</label>
                  {services.length > 0 && (
                    <select name="serviceId" value={formData.serviceId} onChange={handleServiceChange} required   disabled={editMode} >
                      <option value="">Chọn Dịch Vụ</option>
                      {services.map((service) => (
                        <option key={service.service} value={service.service}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                  )}

                  <label>Giới hạn Min:</label>
                  <input type="number" name="min" value={formData.min} onChange={handleChange} required   disabled={editMode}  />

                  <label>Giới hạn Max:</label>
                  <input type="number" name="max" value={formData.max} onChange={handleChange} required  disabled={editMode} />

                  <label>Giá:</label>
                  <input type="number" name="rate" value={formData.rate} onChange={handleChange} required />

                  <label>Service ID:</label>
                  <input type="text" name="serviceId" value={formData.serviceId} onChange={handleChange} required    />

                  <label>Trạng thái:</label>
                  <select
                    name="isActive"
                    value={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.value === "true" })
                    }
                  >
                    <option value="true">Hiển thị</option>
                    <option value="false">Ẩn</option>
                  </select>
                  <button type="submit">{editMode ? "Sửa Dịch Vụ" : "Thêm Dịch Vụ"}</button>
                </form>
              </div>
              <div class="form-group mb-3">
                <h2 className="smmdv-title">Danh Sách Dịch Vụ</h2>
                <div className="rsp-table">
                  <table className="server-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Service ID</th>
                        <th>Tên dịch vụ</th>
                        <th>Danh mục</th>
                        <th>giá</th>
                        <th>Link dịch vụ</th>
                        <th>Tên dịch vụ bên SMM</th>
                        <th>Domain SMM</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {server.map((serverItem, index) => (
                        <tr key={serverItem.id}>
                          <td>{index + 1}</td>
                          <td>{serverItem.serviceId}</td>
                          <td>{serverItem.name}</td>
                          <td>{serverItem.category}</td>
                          <td>{serverItem.rate}</td>
                          <td>{serverItem.Linkdv}</td>
                          <td>{serverItem.DomainSmm}</td>
                          <td>{serverItem.serviceName}</td>
                          <td>{serverItem.isActive ? "Hiển thị" : "Ẩn"}</td>
                          <td>
                            <button onClick={() => handleEdit(serverItem)}>Sửa</button>
                            <button onClick={() => handleDelete(serverItem.id)}>Xóa</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Smmdv;
