import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/muahang.scss";

import "../dichvu.css";

const ServerFilterForm = () => {
  const [servers, setServers] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Sử dụng rawLink để lưu giá trị người dùng nhập, và convertedUID để lưu UID chuyển đổi (nếu có)
  const [rawLink, setRawLink] = useState("");
  const [convertedUID, setConvertedUID] = useState("");
  // Sử dụng selectedMagoi để lưu giá trị Magoi của dịch vụ được chọn
  const [selectedMagoi, setSelectedMagoi] = useState("");
  // Sử dụng quantity khi dịch vụ không bật iscomment
  const [quantity, setQuantity] = useState(100);
  // Sử dụng comments khi dịch vụ bật iscomment
  const [comments, setComments] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
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

  // Tính tổng chi phí dựa vào dịch vụ được chọn:
  // - Nếu không bật iscomment: tổng = rate * quantity.
  // - Nếu bật iscomment: tổng = (số dòng trong textarea, loại bỏ dòng trống) * rate.
  useEffect(() => {
    if (selectedMagoi) {
      const selectedService = filteredServers.find(
        (service) => service.Magoi === selectedMagoi
      );
      if (selectedService) {
        if (selectedService.iscomment === "on") {
          const lines = comments.split(/\r?\n/).filter(
            (line) => line.trim() !== ""
          );
          setTotalCost(lines.length * selectedService.rate);
        } else {
          setTotalCost(selectedService.rate * quantity);
        }
      }
    } else {
      setTotalCost(0);
    }
  }, [selectedMagoi, quantity, filteredServers, comments]);

  // Chuyển đổi rawLink thành UID tự động sau 500ms debounce
  useEffect(() => {
    if (!rawLink) {
      setConvertedUID("");
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_URL}/api/tool/getUid`, { link: rawLink });
        // API trả về { status, uid, message }
        if (response.data.status !== "error" && response.data.uid) {
          setConvertedUID(response.data.uid);
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

  // Khi đã có UID chuyển đổi, hiển thị trực tiếp trong ô input bằng cách sử dụng convertedUID
  const displayLink = convertedUID || rawLink;

  // Xử lý gửi đơn hàng
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username) {
      alert("Bạn cần đăng nhập trước khi mua hàng!");
      return;
    }
    // Sử dụng UID chuyển đổi nếu có, nếu không thì dùng rawLink gốc
    const finalLink = convertedUID || rawLink;
    if (!finalLink || !selectedMagoi) {
      setMessage("Vui lòng chọn dịch vụ và nhập link.");
      return;
    }

    setIsSubmitting(true);

    // Tìm dịch vụ được chọn dựa trên Magoi
    const selectedService = filteredServers.find(
      (service) => service.Magoi === selectedMagoi
    );

    // Chuẩn bị payload gửi lên API, sử dụng key "magoi" thay cho "serviceId"
    const payload = {
      link: finalLink,
      username,
      category: selectedCategory,
      magoi: selectedMagoi,
      note,
    };

    // Nếu dịch vụ bật comment, tính số lượng bằng số dòng (loại bỏ dòng trống)
    if (selectedService && selectedService.iscomment === "on") {
      const computedQty = comments.split(/\r?\n/).filter((line) => line.trim() !== "").length;
      payload.quantity = computedQty;
      payload.comments = comments;
    } else {
      payload.quantity = quantity;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL}/api/order/add`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setMessage("Mua dịch vụ thành công");
      setOrders((prevOrders) => [...prevOrders, response.data]);
    } catch (error) {
      setMessage(
        error.response
          ? error.response.data.message
          : "Có lỗi xảy ra, vui lòng thử lại!"
      );
      console.error("Lỗi khi mua dịch vụ", error);
    } finally {
      setIsSubmitting(false);
    }
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
                        <div
                          key={server.Magoi}
                          className="form-check mb-2 d-flex align-items-center gap-2"
                        >
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
                          <label
                            className="form-check-label"
                            htmlFor={`server-${server.Magoi}`}
                          >
                            <span className="badge bg-success">{server.maychu}</span>
                            <span>{server.name}</span>
                            <span className="badge bg-primary">
                              {Number(server.rate).toLocaleString("vi-VN")}đ
                            </span>
                            <span className="badge bg-success">
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
                          <div
                            className="form-group mb-3 comments"
                            id="comments_type"
                            style={{ display: "block" }}
                          >
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
                    <div class="form-group mb-3">
                      <div class="alert bg-primary text-center text-white">
                        <h3 class="alert-heading">Tổng thanh toán: <span class="text-danger">{Number(totalCost).toLocaleString("vi-VN")}
                        </span>
                          VNĐ</h3>
                        <p class="fs-4 mb-0" id="text-order">Bạn sẽ tăng <span class="text-danger" >{quantity} </span>
                          số
                          lượng với giá <span class="text-danger" >{rate}</span> đ</p>
                      </div>
                    </div>

                    {/* <div className="form-group mb-3">
                      <div className="alert bg-primary text-center text-white">
                        <h3 className="alert-heading">
                          Tổng thanh toán:{" "}
                          <span className="text-danger">
                            {Number(totalCost).toLocaleString("vi-VN")}
                          </span>{" "}
                          VNĐ
                        </h3>
                      </div>
                    </div> */}
                    <div className="form-group">
                      <button
                        type="submit"
                        class="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2">
                        <i className="fas fa-shopping-cart"></i>
                        <span>Tạo đơn hàng</span>
                      </button>
                    </div>
                  </>
                )}
              </form>
              {message && <p className="message">{message}</p>}
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
