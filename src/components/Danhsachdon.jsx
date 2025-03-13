import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import "../dichvu.css";

const Danhsachdon = () => {
  const [servers, setServers] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [message, setMessage] = useState("");
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Số đơn hàng mỗi trang

  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  // Lấy danh sách server từ API khi component load
  useEffect(() => {
    const fetchServers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/api/server`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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

  // Khi thay đổi type thì reset category
  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setSelectedCategory("");
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Hàm fetchOrders: Nếu có searchTerm hoặc selectedCategory thì dùng endpoint /api/order/screach, ngược lại dùng endpoint /api/order/orders
  const fetchOrders = async () => {
    if (!username) {
      setLoadingOrders(false);
      return;
    }
    setLoadingOrders(true);
    try {
      const isSearching = searchTerm.trim() !== "" || selectedCategory;
      const endpoint = isSearching
        ? `${process.env.REACT_APP_URL}/api/order/screach`
        : `${process.env.REACT_APP_URL}/api/order/orders`;

      const params = {
        page: currentPage,
        limit,
        username,
        ...(selectedCategory && { category: selectedCategory }),
        ...(searchTerm.trim() !== "" && { search: searchTerm }),
      };

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      // Giả sử API trả về object { orders, currentPage, totalPages, totalOrders }
      setOrders(response.data.orders);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
      setMessage("");
    } catch (error) {
      Swal.fire({
        title: "Lỗi",
        text: error.response
          ? error.response.data.message
          : "Có lỗi xảy ra, vui lòng thử lại!",
        icon: "error",
        confirmButtonText: "Xác nhận",
      });
    } finally {
      setLoadingOrders(false);
    }
  };

  // Khi nhấn nút tìm kiếm, reset trang về 1 và gọi fetchOrders
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchOrders();
  };

  // Load dữ liệu mặc định khi component mount và mỗi khi currentPage thay đổi
  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, currentPage]);

  return (
    <div className="col-md-12">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Lịch sử tạo đơn</h2>
        </div>
        <div class="card-body">
          <h5 className="card-title">nếu muốn xem đơn của loại nào thì chọn - ấn tìm (mặc định sẽ hiện tất cả)</h5>

          <div className="row">
            <div class="col-md-6 col-lg-3">
              <div className="form-group">
                <label>CHỌN NỀN TẢNG:</label>
                <select className="form-select" value={selectedType} onChange={handleTypeChange}>
                  <option value="">Chọn</option>
                  {uniqueTypes.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div class="col-md-6 col-lg-3">
              <div className="form-group">
                {selectedType && (
                  <>
                    <label>PHÂN LOẠI:</label>
                    <select
                      className="form-select"
                      value={selectedCategory}
                      onChange={handleCategoryChange}
                    >
                      <option value="">Chọn</option>
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
            <div class="col-md-6 col-lg-3">
              <div class="form">
                <label for="order_code" class="form-label">Mã đơn hàng hoặc link</label>
                <div class="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm dữ liệu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-primary d-flex align-items-center"
                    onClick={handleSearch}
                  >
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </div>

            </div>
          </div>

          <div className="table-responsive">
            {loadingOrders ? (
              // Spinner / Loading indicator
              <div className="spinner-container">
                <div className="spinner"></div>
                <p>Đang tải dữ liệu...</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-bordered table-hover table-striped fw-bold">
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Mã đơn</th>
                      <th>Username</th>
                      <th>Link</th>
                      <th>Server</th>
                      <th>Bắt đầu</th>
                      <th>đã chạy</th>
                      <th>Số lượng mua</th>
                      <th>Trạng thái</th>
                      {selectedCategory === "BÌNH LUẬN" && (
                        <th>Bình luận</th>
                      )}
                      <th>Ghi chú</th>
                      <th>Ngày tạo</th>
                    </tr>
                  </thead>
                  <tbody className="fw-bold">
                    {orders.map((order, index) => (
                      <tr key={order.id}>
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
                            <span className="badge badge-badge badge-success">
                              Hoàn thành
                            </span>
                          ) : order.status === "In progress" || order.status === "Processing"|| order.status === "Pending" ? (
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
                        <td>
                          {new Date(order.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {orders.length > 0 && (
                  <div className="pagination-controls">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    <span>
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, totalPages)
                        )
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p>Không có đơn hàng nào.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Danhsachdon;
