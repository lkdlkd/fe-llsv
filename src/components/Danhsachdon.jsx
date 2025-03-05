import React, { useState, useEffect } from "react";
import axios from "axios";
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

  // Lấy danh sách server từ API khi component load
  useEffect(() => {
    const fetchServers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/api/server`);
        setServers(response.data.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách server:", error);
      }
    };
    fetchServers();
  }, []);

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

  // Hàm lấy đơn hàng: sử dụng endpoint tìm kiếm, trong đó nếu selectedCategory rỗng sẽ không truyền điều kiện đó
  const fetchOrders = async () => {
    if (!username) {
      setLoadingOrders(false);
      return;
    }
    setLoadingOrders(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_URL}/api/order/screach`, {
        params: {
          username,
          ...(selectedCategory && { category: selectedCategory }),
          page: currentPage,
          limit,
          search: searchTerm,
        },
      });
      // Giả sử API trả về object { orders, currentPage, totalPages, totalOrders }
      setOrders(response.data.orders);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
      setMessage("");
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

  // Khi nhấn nút tìm kiếm, đặt lại trang về 1 và gọi fetchOrders
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchOrders();
  };

  // Gọi lại fetchOrders mỗi khi thay đổi selectedCategory hoặc currentPage
  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, selectedCategory, currentPage]);

  return (
    <div className="col-md-12">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Lịch sử tạo đơn</h2>
          {/* Form tìm kiếm */}
          <form onSubmit={handleSearch}>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm dữ liệu.."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-primary d-flex align-items-center"
              >
                <i className="fas fa-search"></i>
              </button>
            </div>
          </form>
          {/* Form chọn nền tảng và phân loại */}
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
        <div className="card-body">
          {message && <p>{message}</p>}
          <div className="table-responsive">
            {selectedCategory || searchTerm.trim() !== "" ? (
              loadingOrders ? (
                // Spinner / Loading indicator
                <div className="spinner-container">
                  <div className="spinner"></div>
                  <p>Đang tải dữ liệu...</p>
                </div>
              ) : orders.length > 0 ? (
                <div className="orders-table-container">
                  <table className="table table-bordered table-hover table-striped fw-bold">
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
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, index) => (
                        <tr key={order.id}>
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
                          setCurrentPage((prev) => Math.min(prev + 1, totalPages))
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
              )
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Danhsachdon;
