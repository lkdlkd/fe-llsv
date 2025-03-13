import React, { useState, useEffect } from "react";
import { fetchServers, fetchOrders, deleteOrder } from "../../utils/apiAdmin";
import axios from "axios"; // Nếu bạn vẫn cần sử dụng axios cho một số trường hợp khác
// import "../../App.css"; // Import file CSS nếu cần

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

  const token = localStorage.getItem("token");

  // Lấy danh sách server khi component load
  useEffect(() => {
    const loadServers = async () => {
      try {
        const data = await fetchServers(token);
        setServers(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách server:", error);
      }
    };
    loadServers();
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

  // Lấy danh sách đơn hàng dựa vào category đã chọn, page hiện tại, và limit
  useEffect(() => {
    const loadOrders = async () => {
      if (!selectedCategory) {
        setLoadingOrders(false);
        return;
      }
      try {
        const data = await fetchOrders(token, selectedCategory, currentPage, limit);
        setOrders(data.orders);
        setCurrentPage(data.currentPage);
        setTotalPages(data.totalPages);
      } catch (error) {
        setMessage(
          error.message || "Có lỗi xảy ra, vui lòng thử lại!"
        );
      } finally {
        setLoadingOrders(false);
      }
    };
    loadOrders();
  }, [selectedCategory, currentPage, token]);

  // Hàm xử lý xóa đơn hàng
  const handleDelete = async (orderId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này không?")) return;
    try {
      await deleteOrder(token, orderId);
      setMessage("Xóa đơn hàng thành công!");
      // Làm mới lại danh sách đơn hàng sau khi xóa
      const data = await fetchOrders(token, selectedCategory, currentPage, limit);
      setOrders(data.orders);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      setMessage(
        error.message || "Có lỗi xảy ra, vui lòng thử lại!"
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
                            <td>
                              {order.status === "Completed" ? (
                                <span className="badge badge-badge badge-success">
                                  Hoàn thành
                                </span>
                              ) : order.status === "In progress" || order.status === "Processing" || order.status === "Pending" ? (
                                <span className="badge badge-badge badge-primary">
                                  Đang chạy
                                </span>
                              ) : order.status === "Canceled" ? (
                                <span className="badge badge-badge badge-danger">
                                  Đã hủy
                                </span>
                              ) : (
                                <span>{order.status}</span>
                              )}
                            </td>
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
