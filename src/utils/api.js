import axios from 'axios';

const API_URL = process.env.REACT_APP_URL;

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/user/login`, { username, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: 'Lỗi kết nối đến máy chủ' };
  }
};
export const registerUser = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/api/user/register`, formData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { error: 'Lỗi kết nối đến máy chủ' };
  }
};
export const fetchUserData = async (username, token) => {
  try {
    const response = await axios.get(`${API_URL}/api/user/${username}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { username }
    });
    return response.data;
  } catch (error) {
    throw error.response 
      ? error.response.data 
      : { message: "Có lỗi xảy ra, vui lòng thử lại!" };
  }
};
// Lấy danh sách server
export const fetchServers = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/server`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data; // Giả sử dữ liệu cần trả về nằm trong response.data.data
  } catch (error) {
    throw error.response 
      ? error.response.data 
      : { message: 'Lỗi kết nối đến máy chủ' };
  }
};

// Chuyển đổi rawLink thành UID
export const getUID = async (link) => {
  try {
    const response = await axios.post(`${API_URL}/api/tool/getUid`, { link });
    return response.data; // API trả về { status, uid, message }
  } catch (error) {
    throw error.response 
      ? error.response.data 
      : { message: 'Lỗi chuyển đổi UID' };
  }
};

// Tạo đơn hàng mới
export const addOrder = async (payload, token) => {
  try {
    const response = await axios.post(`${API_URL}/api/order/add`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: 'Có lỗi xảy ra, vui lòng thử lại!' };
  }
};


// Lấy danh sách người dùng với phân trang
export const getUsers = async (page = 1, limit = 10, token) => {
  try {
    const response = await axios.get(`${API_URL}/api/user?page=${page}&limit=${limit}`, {
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

// Lấy thông tin người dùng theo username
export const fetchUserInfo = async (username, token) => {
  try {
    const response = await axios.get(`${API_URL}/api/user/${username}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { username }
    });
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: "Có lỗi xảy ra, vui lòng thử lại!" };
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
    throw error.response
      ? error.response.data
      : { message: "Lỗi khi tải danh sách ngân hàng" };
  }
};
// Hàm đổi mật khẩu cho user (chỉ admin hoặc chính chủ)
export const changePassword = async (id, oldPassword, newPassword, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/user/changePassword/${id}`,
      { oldPassword, newPassword },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: "Có lỗi xảy ra. Vui lòng thử lại sau." };
  }
};

// Hàm lấy lịch sử hoạt động của người dùng theo username, phân trang
export const fetchUserHistory = async (token, username, page, limit) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/user/history/${username}?page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    // Giả sử API trả về object có cấu trúc: { history, currentPage, totalPages, ... }
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : { message: "Có lỗi xảy ra, vui lòng thử lại!" };
  }
};