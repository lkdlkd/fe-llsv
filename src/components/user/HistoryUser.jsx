import React, { useState, useEffect } from "react";
import { fetchUserHistory } from "../../utils/api"; // Import hàm từ file API
import "../../App.css";

const HistoryUser = () => {
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const [history, setHistory] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10); // Mặc định 10 bản ghi mỗi trang
  const [message, setMessage] = useState("");

  // Hàm lấy dữ liệu lịch sử hoạt động
  const loadHistory = async (page, limit) => {
    setLoadingOrders(true);
    try {
      const data = await fetchUserHistory(token, username, page, limit);
      const { history: historyData, currentPage: cp, totalPages: tp } = data;
      setHistory(historyData);
      setCurrentPage(cp);
      setTotalPages(tp);
    } catch (error) {
      setMessage(error.message || "Có lỗi xảy ra, vui lòng thử lại!");
      console.error("Error fetching history:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Load dữ liệu mỗi khi currentPage, username, token hoặc limit thay đổi
  useEffect(() => {
    if (username && token) {
      loadHistory(currentPage, limit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, username, token, limit]);

  // Xử lý thay đổi số bản ghi mỗi trang
  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1); // reset trang về 1
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h2 className="card-title">Lịch sử hoạt động</h2>
            <div className="form-group mb-0">
              <label className="me-2">Số bản ghi/trang:</label>
              <select className="form-select d-inline-block w-auto" value={limit} onChange={handleLimitChange}>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              {loadingOrders ? (
                <p>Đang tải dữ liệu...</p>
              ) : history && history.length > 0 ? (
                <div className="orders-table-container">
                  <table className="table table-bordered table-hover table-striped fw-bold">
                    <thead>
                      <tr>
                        <th>STT</th>
                        <th>Mã đơn</th>
                        <th>Username</th>
                        <th>Hành động</th>
                        <th>Link</th>
                        <th>Số tiền</th>
                        <th>Ngày tạo</th>
                        <th>Diễn giải</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((item, index) => (
                        <tr key={item._id}>
                          <td>{(currentPage - 1) * limit + index + 1}</td>
                          <td>{item.madon}</td>
                          <td>{item.username}</td>
                          <td>{item.hanhdong}</td>
                          <td>{item.link}</td>
                          <td>
                            <span
                              className="badge badge-info"
                              style={{ backgroundColor: "#43bfe5" }}
                            >
                              {item.tienhientai}
                            </span>{" "}
                            {item.hanhdong === "Cộng tiền" ? (
                              <>
                                +<span className="badge" style={{ backgroundColor: "#e53935" }}>
                                  {item.tongtien}
                                </span>{" "}
                              </>
                            ) : (
                              <>
                                -<span className="badge" style={{ backgroundColor: "#e53935" }}>
                                  {item.tongtien}
                                </span>{" "}
                              </>
                            )}
                            ={" "}
                            <span className="badge badge-success">
                              {item.tienconlai}
                            </span>
                          </td>
                          <td>
                            {new Date(item.createdAt).toLocaleString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </td>
                          <td>{item.mota || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>Không có đơn hàng nào.</p>
              )}
            </div>
          </div>
          {history && history.length > 0 && (
            <div className="pagination-controls ">
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

      </div>
    </div>
  );
};

export default HistoryUser;
