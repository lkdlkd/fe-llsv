import React, { useState, useEffect } from "react";
import { fetchServers, fetchOrders, deleteOrder } from "../../utils/apiAdmin";
import Swal from "sweetalert2"; // Import SweetAlert2

const Alldon = () => {
  const [servers, setServers] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State cho tìm kiếm đơn hàng

  const [orders, setOrders] = useState([]);
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
        Swal.fire({
          icon: "error",
          title: "Lỗi tải server",
          text: error.message || "Có lỗi xảy ra khi tải danh sách server.",
        });
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

  // Khi thay đổi type thì reset category, search, trang hiện tại
  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setSelectedCategory("");
    setSearchQuery(""); // Reset tìm kiếm khi thay đổi type
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  // Khi thay đổi tìm kiếm, reset trang về 1 và gọi API sau debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setCurrentPage(1);
      loadOrders();
    }, 800);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Lấy danh sách đơn hàng dựa vào selectedCategory, searchQuery, currentPage, và limit
  useEffect(() => {
    loadOrders();
  }, [selectedCategory, currentPage, token]);

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      // Gửi searchQuery qua tham số 'search'
      const data = await fetchOrders(token, selectedCategory, currentPage, limit, searchQuery);
      setOrders(data.orders);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi tải đơn hàng",
        text: error.message || "Có lỗi xảy ra, vui lòng thử lại!",
      });
    } finally {
      setLoadingOrders(false);
    }
  };

  // Hàm xử lý xóa đơn hàng với xác nhận Swal
  const handleDelete = async (orderId) => {
    const result = await Swal.fire({
      title: "Bạn có chắc muốn xóa đơn hàng này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteOrder(token, orderId);
      Swal.fire({
        icon: "success",
        title: "Xóa đơn hàng thành công!",
      });
      loadOrders();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi khi xóa",
        text: error.message || "Có lỗi xảy ra, vui lòng thử lại!",
      });
    }
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Lịch sử tạo đơn</h2>
          </div>

          <div className="card-body">
            <div className="row">
              <form >
                <div className="col-md-6 ">
                  <div className="form-group mb-3">
                    <label>Tìm kiếm:</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nhập từ khóa tìm kiếm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="form-group mb-3">
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    onClick={(e) => {
                      e.preventDefault();
                      loadOrders();
                    }}
                  >
                    <i className="fas fa-search"></i> Tìm kiếm
                  </button>
                </div>
                </div>
                
                <div className="col-md-4 ">
                  <div className="form-group mb-3">
                    <label>CHỌN NỀN TẢNG:</label>
                    <select value={selectedType} className="form-select" onChange={handleTypeChange}>
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
                        <select value={selectedCategory} className="form-select" onChange={handleCategoryChange}>
                          <option value="">Tất cả</option>
                          {categoriesForType.map((category, index) => (
                            <option key={index} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </>
                    )}
                  </div>
                </div>
              </form>
            </div>
            {/* Bảng hiển thị đơn hàng */}

            <div className="table-responsive">
              {loadingOrders ? (
                <p>Đang tải dữ liệu...</p>
              ) : orders.length > 0 ? (
                <div className="orders-table-container">
                  <table className="table-hover table-bordered table-striped table-vcenter orders-table">
                    <thead>
                      <tr>
                      <th>STT</th>
                      <th>Mã đơn</th>
                      <th>Username</th>
                      <th>Link</th>
                      <th>Server</th>
                      <th>Bắt đầu</th>
                      <th>Đã chạy</th>
                      <th>Số lượng mua</th>
                      <th>Trạng thái</th>
                      {selectedCategory === "BÌNH LUẬN" && <th>Bình luận</th>}
                      <th>Ghi chú</th>
                      <th>Ngày tạo</th>
                      <th>Hành động</th>

                        {/* <th>STT</th>
                        <th>Mã đơn</th>
                        <th>Username</th>
                        <th>Link</th>
                        <th>Server</th>
                        <th>Số lượng</th>
                        <th>Trạng thái</th>
                        {selectedCategory === "BÌNH LUẬN" && <th>Bình luận</th>}
                        <th>Ghi chú</th>
                        <th>Ngày tạo</th> */}
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
                          <td>{order.start}</td>
                          <td>{order.dachay}</td>
                          <td>{order.quantity}</td>
                          <td>
                            {order.status === "Completed" ? (
                              <span className="badge badge-success">Hoàn thành</span>
                            ) : order.status === "In progress" ||
                              order.status === "Processing" ||
                              order.status === "Pending" ? (
                              <span className="badge badge-primary">Đang chạy</span>
                            ) : order.status === "Canceled" ? (
                              <span className="badge badge-danger">Đã hủy</span>
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
                            <button className="btn btn-danger" onClick={() => handleDelete(order._id)}>
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
            {orders.length > 0 && (
              <div className="pagination d-flex justify-content-between align-items-center mt-3">
                <button
                  className="btn btn-secondary"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>
                  Trang {currentPage} / {totalPages}
                </span>
                <button
                  className="btn btn-secondary"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Sau
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

  );
};

export default Alldon;
