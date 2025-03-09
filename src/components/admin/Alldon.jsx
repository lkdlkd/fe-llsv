import React, { useState, useEffect } from "react";
import axios from "axios";

const Alldon = () => {
  const [servers, setServers] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [link, setLink] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [quantity, setQuantity] = useState(100);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [orders, setOrders] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Số đơn hàng mỗi trang

  const token = localStorage.getItem('token'); // Lấy token từ localStorage

  // Lấy danh sách server từ API khi component load
  useEffect(() => {
    const fetchServers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/api/server`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setServers(response.data.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách server:", error);
      }
    };
    fetchServers();
  }, [token]);

  // Tạo danh sách type và category dựa theo danh sách server
  const uniqueTypes = Array.from(new Set(servers.map((server) => server.type)));
  const categoriesForType = selectedType
    ? Array.from(
        new Set(
          servers
            .filter((server) => server.type === selectedType)
            .map((server) => server.category)
        )
      )
    : [];

  // Lọc danh sách server theo type và category đã chọn
  const filteredServers = servers.filter(
    (server) =>
      server.type === selectedType &&
      (selectedCategory ? server.category === selectedCategory : true)
  );

  // Khi thay đổi type thì reset category, service đã chọn và tổng tiền
  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setSelectedCategory("");
    setServiceId("");
    setTotalCost(0);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setServiceId("");
    setTotalCost(0);
  };

  // Lấy danh sách đơn hàng của người dùng theo category đã chọn
  useEffect(() => {
    const fetchOrders = async () => {
      if (!selectedCategory) {
        setLoadingOrders(false);
        return;
      }
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/api/order/getOrder`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            },
            params: { category: selectedCategory, page: currentPage, limit }
          }
        );
        // Giả sử API trả về object { orders, currentPage, totalPages, totalOrders }
        setOrders(response.data.orders);
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        setMessage(
          error.response
            ? error.response.data.message
            : "Có lỗi xảy ra, vui lòng thử lại!"
        );
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, [selectedCategory, currentPage, token]);

  // Hàm xử lý xóa đơn hàng
  const handleDelete = async (orderId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này không?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_URL}/api/order/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setMessage("Xóa đơn hàng thành công!");
      // Làm mới lại danh sách đơn hàng sau khi xóa
      const response = await axios.get(
        `${process.env.REACT_APP_URL}/api/order/getOrder`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: { category: selectedCategory, page: currentPage, limit }
        }
      );
      setOrders(response.data.orders);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setMessage(
        error.response
          ? error.response.data.message
          : "Có lỗi xảy ra, vui lòng thử lại!"
      );
    }
  };

  return (
    <div className="col-md-12">
      <div className="card">
        {/* Header và form lựa chọn */}
        <div className="card-header">
          <h2 className="card-title">Lịch sử tạo đơn</h2>
          <form>
            <label>CHỌN NỀN TẢNG:</label>
            <select value={selectedType} onChange={handleTypeChange}>
              <option value="">Other</option>
              {uniqueTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {selectedType && (
              <>
                <label>PHÂN LOẠI:</label>
                <select value={selectedCategory} onChange={handleCategoryChange}>
                  <option value="">Other</option>
                  {categoriesForType.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </>
            )}
          </form>
        </div>
        {/* Bảng hiển thị đơn hàng */}
        <div className="card-body">
          {message && <p>{message}</p>}
          <div className="rps-table">
            {selectedCategory && (
              <div>
                {loadingOrders ? (
                  <p>Đang tải dữ liệu...</p>
                ) : orders.length > 0 ? (
                  <div className="orders-table-container">
                    <table className="orders-table">
                      <thead>
                        <tr>
                          <th>STT</th>
                          <th>Mã đơn</th>
                          <th>Username</th>
                          <th>Link</th>
                          <th>Server</th>
                          <th>Số lượng</th>
                          <th>Trạng thái</th>
                          {selectedCategory === "BÌNH LUẬN" && <th>Bình luận</th>}
                          <th>Ghi chú</th>
                          <th>Ngày tạo</th>
                          <th>Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order, index) => (
                          <tr key={order._id}>
                            <td>{index + 1}</td>
                            <td>{order.Madon}</td>
                            <td>{order.username}</td>
                            <td>{order.link}</td>
                            <td>{order.namesv}</td>
                            <td>{order.quantity}</td>
                            <td>{order.status}</td>
                            {selectedCategory === "BÌNH LUẬN" && (
                              <td>
                                {order.category === "BÌNH LUẬN"
                                  ? order.comments || "Không có bình luận"
                                  : ""}
                              </td>
                            )}
                            <td>{order.note}</td>
                            <td>{new Date(order.createdAt).toLocaleString()}</td>
                            <td>
                              <button onClick={() => handleDelete(order._id)}>
                                Xóa
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>Không có đơn hàng nào.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Phân trang */}
      {selectedCategory && orders.length > 0 && (
        <div className="pagination-controls">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Alldon;
