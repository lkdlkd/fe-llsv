import axios from 'axios';

const API_URL = process.env.REACT_APP_URL;
// Lấy danh sách người dùng với phân trang và tìm kiếm theo username
export const getUsers = async (page = 1, limit = 10, token, username = "") => {
  try {
    // Tạo query string với username nếu có giá trị
    const queryParams = new URLSearchParams({ page, limit });
    if (username) {
      queryParams.append("username", username);
    }
    const response = await axios.get(`${API_URL}/api/user?${queryParams.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Lỗi kết nối đến máy chủ" };
  }
};

// Xóa người dùng theo id
export const deleteUserById = async (id, token) => {
  try {
    await axios.delete(`${API_URL}/api/user/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    throw error.response ? error.response.data : { message: "Lỗi kết nối đến máy chủ" };
  }
};

// Cập nhật thông tin người dùng theo id
export const updateUser = async (id, formData, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/user/update/${id}`,
      formData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: "Lỗi kết nối đến máy chủ" };
  }
};


// Lấy danh sách đối tác SMM
export const fetchSmmPartners = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/smm`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Lỗi kết nối đến máy chủ" };
  }
};

// Thêm đối tác SMM
export const addSmmPartner = async (formData, token) => {
  try {
    const response = await axios.post(`${API_URL}/api/smm/them`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Lỗi kết nối đến máy chủ" };
  }
};

// Xóa đối tác SMM theo id
export const deleteSmmPartner = async (id, token) => {
  try {
    await axios.delete(`${API_URL}/api/smm/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    throw error.response ? error.response.data : { message: "Lỗi kết nối đến máy chủ" };
  }
};

// Thêm mới dịch vụ SMM (thêm mới máy chủ)
export const addServerService = async (formData, token) => {
  try {
    const response = await axios.post(`${API_URL}/api/server/add`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Lỗi kết nối đến máy chủ" };
  }
};

// Cập nhật dịch vụ SMM (sửa thông tin máy chủ)
export const updateServerService = async (id, formData, token) => {
  try {
    const response = await axios.put(`${API_URL}/api/server/update/${id}`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Lỗi kết nối đến máy chủ" };
  }
};

// Xóa dịch vụ SMM (xóa máy chủ)
export const deleteServerService = async (id, token) => {
  try {
    await axios.delete(`${API_URL}/api/server/delete/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    throw error.response ? error.response.data : { message: "Lỗi kết nối đến máy chủ" };
  }
};

// Lấy danh sách ngân hàng
export const fetchBanks = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/banks`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Lỗi kết nối đến máy chủ" };
  }
};

// Thêm ngân hàng mới
export const createBank = async (formData, token) => {
  try {
    const response = await axios.post(`${API_URL}/api/creatbank`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Lỗi kết nối đến máy chủ" };
  }
};

// Cập nhật ngân hàng
export const updateBank = async (id, formData, token) => {
  try {
    const response = await axios.put(`${API_URL}/api/banks/${id}`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Lỗi kết nối đến máy chủ" };
  }
};

// Xóa ngân hàng
export const deleteBank = async (id, token) => {
  try {
    await axios.delete(`${API_URL}/api/banks/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (error) {
    throw error.response ? error.response.data : { message: "Lỗi kết nối đến máy chủ" };
  }
};
export const fetchServers = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/server`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    // Giả sử dữ liệu server nằm trong response.data.data
    return response.data.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: "Lỗi kết nối đến máy chủ" };
  }
};

export const fetchOrders = async (token, category, page, limit, search) => {
  try {
    const response = await axios.get(`${API_URL}/api/order/getOrder`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { category, page, limit, search } // Dùng 'search'
    });
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: "Có lỗi xảy ra, vui lòng thử lại!" };
  }
};

// Xóa đơn hàng theo id
export const deleteOrder = async (token, orderId) => {
  try {
    await axios.delete(`${API_URL}/api/order/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: "Có lỗi xảy ra, vui lòng thử lại!" };
  }
};

// Hàm cộng tiền cho người dùng
export const addUserBalance = async (userId, amount, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/user/add/${userId}/balance`,
      { amount },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: "Lỗi kết nối đến máy chủ" };
  }
};

// Hàm gọi API trừ tiền (deduct balance)
export const deductBalance = async (id, amount, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/user/${id}/deduct-balance`,
      { amount },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Lỗi kết nối đến máy chủ" };
  }
};
