import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';

function Admin() {
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All'); // Giá trị mặc định là 'All'
  const [showServiceId, setShowServiceId] = useState(false);
  const [loadingServiceId, setLoadingServiceId] = useState(null);

  // Fetch services from the backend
  useEffect(() => {
    api.get('/services')
      .then((response) => {
        setServices(response.data.services);
      })
      .catch((error) => {
        console.error('Lỗi khi lấy dịch vụ:', error);
      });
  }, []);

  // Handle adding a service to the database
  const handleAddServiceToDB = async (service) => {
    setLoadingServiceId(service.serviceId); // Cập nhật service đang được thêm

    try {
      await api.post('/addservices', { services: [service] });
      alert(`Dịch vụ ${service.name} đã được thêm vào CSDL thành công`);
    } catch (error) {
      console.error('Lỗi khi thêm dịch vụ:', error);
      alert(`Lỗi khi thêm dịch vụ ${service.name}`);
    } finally {
      setLoadingServiceId(null); // Reset trạng thái loading
    }
  };

  // Lọc dịch vụ theo category đã chọn
  const filteredServices = selectedCategory === 'All'
    ? services
    : services.filter((service) => service.category === selectedCategory);

  // Lấy các category duy nhất từ danh sách services
  const categories = ['All', ...new Set(services.map((service) => service.category))];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Dropdown để chọn category */}
      <section className="mb-4">
        <h2 className="text-xl font-bold mb-2">Lọc theo nhóm dịch vụ</h2>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </section>

      {/* Toggle Service ID visibility */}
      <section className="mb-4">
        <button
          onClick={() => setShowServiceId((prev) => !prev)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {showServiceId ? 'Ẩn Service ID' : 'Hiển thị Service ID'}
        </button>
      </section>

      {/* Hiển thị dịch vụ đã lọc */}
      {filteredServices.length === 0 ? (
        <p>Không có dịch vụ nào trong nhóm đã chọn.</p>
      ) : (
        <ul>
          {filteredServices.map((service) => (
            <li key={service.serviceId} className="mb-2 border p-2 rounded">
              {showServiceId && <div>Service ID: {service.serviceId}</div>}
              <div>Tên dịch vụ: {service.name}</div>
              <div>Danh mục: {service.category}</div>
              <div>Giá: ${service.rate}</div>
              <div>Min: {service.min}</div>
              <div>Max: {service.max}</div>
              <div>Trạng thái: {service.isActive ? 'Hoạt động' : 'Không hoạt động'}</div>

              {/* Nút thêm vào CSDL */}
              <button
                onClick={() => handleAddServiceToDB(service)}
                className={`mt-2 px-4 py-2 bg-green-500 text-white rounded ${loadingServiceId === service.serviceId ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={loadingServiceId === service.serviceId}
              >
                {loadingServiceId === service.serviceId ? 'Đang thêm...' : 'Thêm vào CSDL'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Admin;
