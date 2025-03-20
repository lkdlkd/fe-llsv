import React, { useState, useEffect } from "react";
import "../../SmmForm.css"; // Import file CSS riêng
import {
  fetchSmmPartners,
  fetchServers,
  addServerService,
  updateServerService,
  deleteServerService
} from "../../utils/apiAdmin";
import axios from 'axios';

const Smmdv = () => {
  const [formData, setFormData] = useState({
    type: "",
    name: "",
    description: "",
    maychu: "",
    getid: "off",
    comment: "off",
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
  const token = localStorage.getItem("token");

  const [smmPartners, setSmmPartners] = useState([]);
  const [services, setServices] = useState([]); // Dữ liệu từ API bên SMM sẽ lấy về làm danh sách dịch vụ (nếu cần)
  const [server, setServer] = useState([]); // Danh sách dịch vụ SMM (server)
  const [editMode, setEditMode] = useState(false);
  const [editService, setEditService] = useState(null);

  useEffect(() => {
    loadSmmPartners();
    loadServers();
  }, []);

  // New useEffect to update service info when serviceId changes
  useEffect(() => {
    // Only proceed if there's a non-empty serviceId and services list available
    if (formData.serviceId && services.length > 0) {
      // Find service by comparing service id (casting to string if necessary)
      const selectedService = services.find(
        (service) => String(service.service) === String(formData.serviceId)
      );
      if (selectedService) {
        setFormData(prev => ({
          ...prev,
          min: selectedService.min,
          max: selectedService.max,
          rate: selectedService.rate * 25, // Adjust multiplier if needed
          serviceName: selectedService.name
        }));
      }
    }
  }, [formData.serviceId, services]);

  const loadSmmPartners = async () => {
    try {
      const data = await fetchSmmPartners(token);
      setSmmPartners(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách đối tác:", error);
    }
  };

  const loadServers = async () => {
    try {
      const data = await fetchServers(token);
      setServer(data);
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
        await updateServerService(editService.id, formData, token);
        alert("Đã sửa dịch vụ thành công!");
      } else {
        await addServerService(formData, token);
        alert("Đã thêm dịch vụ thành công!");
      }
      loadServers();
      setEditMode(false);
      setEditService(null);
      setFormData({
        type: "",
        name: "",
        description: "",
        maychu: "",
        getid: "off",
        comment: "off",
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
      matlive: serverItem.matlive,
      category: serverItem.category,
      type: serverItem.type,
      description: serverItem.description,
      isActive: serverItem.isActive
    };
    setFormData(newFormData);
  };

  const handleDelete = async (id) => {
    try {
      await deleteServerService(id, token);
      loadServers();
    } catch (error) {
      console.error("Lỗi khi xóa dịch vụ:", error);
    }
  };

  // Handler for Domain change which fetches services from a partner
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

  // This function is kept in case you prefer selecting a service from a dropdown.
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
        rate: selectedService.rate * 25,
        serviceId: selectedService.service,
        serviceName: selectedService.name
      });
    }
  };

  return (
    <div className="main-content">
      <div className="col-md-12">
        <div className="card">
          <div className="card-body">
            <h2 className="smmdv-title">
              {editMode ? "Sửa Dịch Vụ" : "Thêm Dịch Vụ SMM"}
            </h2>
            <div className="form-group mb-3">
              <form className="smmdv-form" onSubmit={handleSubmit}>
                <label>Loại dịch vụ:</label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  list="serviceTypes"
                  required
                />
                <datalist id="serviceTypes">
                  <option value="FACEBOOK" />
                  <option value="TIKTOK" />
                  <option value="INSTAGRAM" />
                  <option value="YOUTUBE" />
                  <option value="THREAD" />
                  <option value="TELEGRAM" />
                  <option value="SHOPPE" />
                </datalist>
                <label>Danh mục:</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />

                <label>Máy chủ:</label>
                <input
                  type="text"
                  name="maychu"
                  value={formData.maychu}
                  onChange={handleChange}
                />

                <label>Tên dịch vụ:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <label>Mô tả:</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />

                <label>Mã gói:</label>
                <input
                  type="text"
                  name="Magoi"
                  value={formData.Magoi}
                  onChange={handleChange}
                  required
                />

                <label>Link dịch vụ:</label>
                <input
                  type="text"
                  name="Linkdv"
                  value={formData.Linkdv}
                  onChange={handleChange}
                  required
                />

                <h2>CÁC CHỨC NĂNG</h2>

                <label>Chức năng Get ID:</label>
                <select
                  name="getid"
                  value={formData.getid}
                  onChange={handleChange}
                >
                  <option value="on">Bật</option>
                  <option value="off">Tắt</option>
                </select>

                <label>Chức năng Comment:</label>
                <select
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                >
                  <option value="on">Bật</option>
                  <option value="off">Tắt</option>
                </select>

                <label>Chức năng Reaction:</label>
                <select
                  name="reaction"
                  value={formData.reaction}
                  onChange={handleChange}
                >
                  <option value="on">Bật</option>
                  <option value="off">Tắt</option>
                </select>

                <label>Chức năng Matlive:</label>
                <select
                  name="matlive"
                  value={formData.matlive}
                  onChange={handleChange}
                >
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
                  disabled={editMode}
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
                  <select
                    name="serviceId"
                    value={formData.serviceId}
                    onChange={handleServiceChange}
                    required
                    disabled={editMode}
                  >
                    <option value="">Chọn Dịch Vụ</option>
                    {services.map((service) => (
                      <option key={service.service} value={service.service}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                )}

                {/* If you want to allow manual entry of serviceId */}
                <label>Service ID (nhập trực tiếp):</label>
                <input
                  type="text"
                  name="serviceId"
                  value={formData.serviceId}
                  onChange={handleChange}
                  required
                  disabled={editMode}
                />

                <label>Giới hạn Min:</label>
                <input
                  type="number"
                  name="min"
                  value={formData.min}
                  onChange={handleChange}
                  required
                  disabled={editMode}
                />

                <label>Giới hạn Max:</label>
                <input
                  type="number"
                  name="max"
                  value={formData.max}
                  onChange={handleChange}
                  required
                />

                <label>Giá:</label>
                <input
                  type="number"
                  name="rate"
                  value={formData.rate}
                  onChange={handleChange}
                  required
                />

                <label>Trạng thái:</label>
                <select
                  name="isActive"
                  value={formData.isActive}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isActive: e.target.value === "true"
                    })
                  }
                >
                  <option value="true">Hiển thị</option>
                  <option value="false">Ẩn</option>
                </select>
                <button type="submit">
                  {editMode ? "Sửa Dịch Vụ" : "Thêm Dịch Vụ"}
                </button>
              </form>
            </div>
            <div className="form-group mb-3">
              <h2 className="smmdv-title">Danh Sách Dịch Vụ</h2>
              <div className="rsp-table">
                <table className="server-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Mã gói</th>
                      <th>Tên dịch vụ</th>
                      <th>Danh mục</th>
                      <th>Giá</th>
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
                        <td>{serverItem.Magoi}</td>
                        <td>{serverItem.name}</td>
                        <td>{serverItem.category}</td>
                        <td>{serverItem.rate}</td>
                        <td>{serverItem.Linkdv}</td>
                        <td>{serverItem.DomainSmm}</td>
                        <td>{serverItem.serviceName}</td>
                        <td>{serverItem.isActive ? "Hiển thị" : "Ẩn"}</td>
                        <td>
                          <button onClick={() => handleEdit(serverItem)}>Sửa</button>
                          <button onClick={() => handleDelete(serverItem._id)}>Xóa</button>
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
