import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "../style/muahang.scss";
import "../dichvu.css";
import { fetchServers, getUID, addOrder } from "../utils/api";

const ServerFilterForm = () => {
  const [servers, setServers] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [rawLink, setRawLink] = useState("");
  const [convertedUID, setConvertedUID] = useState("");
  const [selectedMagoi, setSelectedMagoi] = useState("");
  const [quantity, setQuantity] = useState(100);
  const [comments, setComments] = useState("");
  const [note, setNote] = useState("");
  const [orders, setOrders] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [min, setMin] = useState(100);
  const [max, setMax] = useState(10000);
  const [rate, setRate] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  // Lấy danh sách server từ API khi component load
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

  // Khi thay đổi type thì reset category, dịch vụ đã chọn và tổng tiền
  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setSelectedCategory("");
    setSelectedMagoi("");
    setTotalCost(0);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedMagoi("");
    setTotalCost(0);
  };

  // Tính tổng chi phí dựa vào dịch vụ được chọn
  useEffect(() => {
    if (selectedMagoi) {
      const selectedService = filteredServers.find(
        (service) => service.Magoi === selectedMagoi
      );
      if (selectedService) {
        if (selectedService.iscomment === "on") {
          const lines = comments.split(/\r?\n/).filter((line) => line.trim() !== "");
          setTotalCost(lines.length * selectedService.rate);
        } else {
          setTotalCost(selectedService.rate * quantity);
        }
      }
    } else {
      setTotalCost(0);
    }
  }, [selectedMagoi, quantity, filteredServers, comments]);

  // Chuyển đổi rawLink thành UID tự động sau debounce 500ms
  useEffect(() => {
    if (!rawLink) {
      setConvertedUID("");
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await getUID(rawLink);
        if (res.status !== "error" && res.uid) {
          setConvertedUID(res.uid);
        } else {
          setConvertedUID("");
        }
      } catch (error) {
        console.error("Lỗi chuyển đổi UID:", error);
        setConvertedUID("");
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [rawLink]);

  // Hiển thị link: nếu có UID chuyển đổi thì ưu tiên nó
  const displayLink = convertedUID || rawLink;

  // Xử lý gửi đơn hàng
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) {
      Swal.fire({
        title: "Lỗi",
        text: "Bạn cần đăng nhập trước khi mua hàng!",
        icon: "error",
        confirmButtonText: "Xác nhận",
      });
      return;
    }

    const finalLink = convertedUID || rawLink;
    if (!finalLink || !selectedMagoi) {
      Swal.fire({
        title: "Lỗi",
        text: "Vui lòng chọn dịch vụ và nhập link.",
        icon: "error",
        confirmButtonText: "Xác nhận",
      });
      return;
    }

    // Popup xác nhận thanh toán
    Swal.fire({
      title: "Xác nhận thanh toán",
      text: `Bạn sẽ tăng ${quantity} lượng với giá ${rate} đ. Tổng thanh toán: ${totalCost.toLocaleString("vi-VN")} VNĐ.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsSubmitting(true);
        const selectedService = filteredServers.find(
          (service) => service.Magoi === selectedMagoi
        );
        const payload = {
          link: finalLink,
          username,
          category: selectedCategory,
          magoi: selectedMagoi,
          note,
        };
        if (selectedService && selectedService.iscomment === "on") {
          const computedQty = comments
            .split(/\r?\n/)
            .filter((line) => line.trim() !== "").length;
          payload.quantity = computedQty;
          payload.comments = comments;
        } else {
          payload.quantity = quantity;
        }
        try {
          const res = await addOrder(payload, token);
          Swal.fire({
            title: "Thành công",
            text: "Mua dịch vụ thành công",
            icon: "success",
            confirmButtonText: "Xác nhận",
          });
          setOrders((prevOrders) => [...prevOrders, res]);
        } catch (error) {
          Swal.fire({
            title: "Lỗi",
            text: error.message || "Có lỗi xảy ra, vui lòng thử lại!",
            icon: "error",
            confirmButtonText: "Xác nhận",
          });
          console.error("Lỗi khi mua dịch vụ", error);
        } finally {
          setIsSubmitting(false);
        }
      }
    });
  };



  return (
    <div className="main-content">
      <div className="row">
        <div className="col-md-12 col-lg-8">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title d-flex align-items-center gap-2 mb-5">
                <span className="text-primary">Tạo đơn hàng mới: </span>
              </h3>
              <div className="form-group mb-3">
                <label>CHỌN NỀN TẢNG:</label>
                <select className="form-select"
                  value={selectedType}
                  onChange={handleTypeChange}>
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
                    <select className="form-select"
                      value={selectedCategory} 
                      onChange={handleCategoryChange}>
                      <option value="">Other</option>
                      {categoriesForType.map((category, index) => (
                        <option key={index} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </div>
              <form onSubmit={handleSubmit}>
                {selectedType && selectedCategory && (
                  <>
                    <div className="form-group mb-3">
                      <label htmlFor="object_id" className="form-label">
                        <strong>Link Hoặc UID:</strong>
                      </label>
                      <input
                        type="text"
                        value={displayLink}
                        onChange={(e) => {
                          setRawLink(e.target.value);
                          setConvertedUID("");
                        }}
                        placeholder="Nhập link hoặc ID tùy các máy chủ"
                      />
                    </div>
                    <h3>Danh sách dịch vụ</h3>
                    <div className="form-group mb-3">
                      <label className="form-label">
                        <strong>Máy chủ:</strong>
                      </label>
                      {filteredServers.map((server) => (
                        <div key={server.Magoi} className="form-check mb-2 d-flex align-items-center gap-2">
                          <input
                            id={`server-${server.Magoi}`}
                            className="form-check-input"
                            type="radio"
                            name="server"
                            value={server.Magoi}
                            checked={selectedMagoi === server.Magoi}
                            onChange={(e) => {
                              setSelectedMagoi(e.target.value);
                              setMin(server.min);
                              setMax(server.max);
                              setRate(server.rate);
                            }}
                          />
                          <label className="form-check-label" htmlFor={`server-${server.Magoi}`}>
                            <span className="badge badge-success">{server.maychu}</span>
                            <span>{server.name}</span>
                            <span className="badge badge-primary">
                              {Number(server.rate).toLocaleString("vi-VN")}đ
                            </span>
                            <span className="badge badge-success">
                              {server.trangthai ? "Hoạt động" : "Không hoạt động"}
                            </span>
                          </label>
                          {selectedMagoi === server.Magoi && (
                            <div
                              className="server-description"
                              dangerouslySetInnerHTML={{ __html: server.description }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    {(() => {
                      const selectedService = filteredServers.find(
                        (service) => service.Magoi === selectedMagoi
                      );
                      if (selectedService && selectedService.iscomment === "on") {
                        return (
                          <div className="form-group mb-3 comments" id="comments_type" style={{ display: "block" }}>
                            <label htmlFor="comments" className="form-label">
                              <strong>Nội dung bình luận: </strong>
                            </label>
                            <textarea
                              className="form-control"
                              name="comments"
                              id="comments"
                              rows="3"
                              placeholder="Nhập nội dung bình luận, mỗi dòng là 1 comment"
                              value={comments}
                              onChange={(e) => setComments(e.target.value)}
                            ></textarea>
                          </div>
                        );
                      } else {
                        return (
                          <div className="form-group mb-3 quantity" id="quantity_type">
                            <label htmlFor="quantity" className="form-label">
                              <strong>
                                Số lượng: <span id="quantity_limit">({min} ~ {max})</span>
                              </strong>
                            </label>
                            <input
                              type="number"
                              value={quantity}
                              onChange={(e) => setQuantity(e.target.value)}
                            />
                          </div>
                        );
                      }
                    })()}
                    <div className="form-group mb-3">
                      <label htmlFor="note" className="form-label">
                        <strong>Ghi chú:</strong>
                      </label>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Ghi chú đơn hàng"
                      />
                    </div>
                    <div className="form-group mb-3">
                      <div className="alert bg-primary text-center text-white">
                        <h3 className="alert-heading">
                          Tổng thanh toán:{" "}
                          <span className="text-danger">
                            {Number(totalCost).toLocaleString("vi-VN")}
                          </span>{" "}
                          VNĐ
                        </h3>
                        <p className="fs-4 mb-0">
                          Bạn sẽ tăng <span className="text-danger">{quantity} </span>số
                          lượng với giá <span className="text-danger">{rate}</span> đ
                        </p>
                      </div>
                    </div>
                    <div className="form-group">
                      <button
                        type="submit"
                        className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                      >
                        <i className="fas fa-shopping-cart"></i>
                        <span>Tạo đơn hàng</span>
                      </button>
                    </div>
                  </>
                )}
              </form>
              {/* Không còn hiển thị inline message */}
              {isSubmitting && (
                <div className="overlay">
                  <div className="spinner-container">
                    <div className="spinner load"></div>
                    <p>Đang mua đơn</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-12 col-lg-4">
          <div className="alert alert-danger bg-danger text-white mb-3">
            <h5 className="alert-heading">Lưu ý</h5>
            <span>
              Nghiêm cấm buff các đơn có nội dung vi phạm pháp luật, chính trị, đồ trụy...
              Nếu cố tình buff bạn sẽ bị trừ hết tiền và ban khỏi hệ thống vĩnh viễn, và phải chịu hoàn toàn trách nhiệm trước pháp luật.
              Nếu đơn đang chạy trên hệ thống mà bạn vẫn mua ở các hệ thống bên khác hoặc đè nhiều đơn, nếu có tình trạng hụt, thiếu số lượng giữa 2 bên thì sẽ không được xử lí.
              Đơn cài sai thông tin hoặc lỗi trong quá trình tăng hệ thống sẽ không hoàn lại tiền.
              Nếu gặp lỗi hãy nhắn tin hỗ trợ phía bên phải góc màn hình hoặc vào mục liên hệ hỗ trợ để được hỗ trợ tốt nhất.
            </span>
          </div>
          <div className="alert alert-primary bg-primary text-white">
            <h5 className="alert-heading">Các trường hợp huỷ đơn hoặc không chạy</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerFilterForm;
