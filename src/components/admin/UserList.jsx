import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserEdit from "./UserEdit";
import AddBalanceForm from "./AddBalanceForm";
import DeductBalanceForm from "./DeductBalanceForm"; // Import form trừ tiền mới

import "../../style/UserList.css"; // Import file CSS
import { getUsers, deleteUserById } from "../../utils/apiAdmin";
import { span } from "framer-motion/client";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [balanceUser, setBalanceUser] = useState(null);
  const [search, setSearch] = useState(""); // State lưu từ khóa tìm kiếm
  const [deductUser, setDeductUser] = useState(null); // state cho form trừ tiền

  const token = localStorage.getItem("token");

  // Gọi API ngay khi thay đổi trang
  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Debounce tìm kiếm: gọi API sau khi người dùng dừng nhập khoảng 1.2 giây
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setPage(1); // Reset về trang 1 khi tìm kiếm
      fetchUsers();
    }, 1200);
    return () => clearTimeout(debounceTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const fetchUsers = async () => {
    try {
      const data = await getUsers(page, 50, token, search);
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách người dùng");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    try {
      await deleteUserById(id, token);
      toast.success("Xóa thành công!");
      fetchUsers();
    } catch (error) {
      toast.error("Lỗi khi xóa!");
    }
  };

  // Xử lý khi người dùng nhấn Enter (nếu muốn gọi tìm kiếm ngay lập tức)
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="card ">
          <div className="card-header">
            <h5 className="card-title">Danh sách Người dùng</h5>
          </div>

          <div className="card-body">
            {/* Ô tìm kiếm */}
            <form onSubmit={handleSearch} className="search-form mb-3">
              <div className="row">
                <div className="col-md-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm theo username"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="col-md-2">
                  <div class="form-group d-flex justify-content-between align-items-center gap-2">
                    <button type="submit" class="btn btn-primary w-100">
                      <i class="ti ti-search"></i>
                      Tìm kiếm</button>
                  </div>
                </div>
              </div>
            </form>

            <div className="table-responsive">
              <table className="table table-hover table-bordered table-striped table-vcenter">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Thao tác</th>
                    <th>Tài khoản</th>
                    <th>Số dư</th>
                    <th>Tổng nạp</th>
                    <th>Cấp bậc</th>
                    <th>Chức vụ</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                    <th>Thời gian tạo</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user._id}>
                      <td>{index + 1}</td>
                      <td>
                        <button
                          className="btn btn-info btn-add-balance"
                          onClick={() => setBalanceUser(user)}
                        >
                          Cộng tiền
                        </button>
                        <button
                          className="btn btn-info btn-add-balance"
                          onClick={() => setDeductUser(user)}
                        >
                          Trừ tiền
                        </button>
                      </td>
                      {/* <td>
                 
                      </td> */}
                      <td>{user.username}</td>
                      <td >{Number(user.balance).toLocaleString("vi-VN")} VNĐ</td>
                      <td >{Number(user.tongnap).toLocaleString("vi-VN")} VNĐ</td>
                      <td>{user.capbac}</td>
                      <td> {user.role === "admin" ? (
                        <span className="badge bg-danger">Quản trị viên</span>
                      ) : user.role === "user" ? (
                        <span className="badge bg-primary">Người dùng</span>
                      ) : <span>{user.role}</span>}
                      </td>
                      <td>{user.role}</td>
                      <td>{user.status}</td>
                      <td>
                        <button
                          className="btn btn-warning btn-edit me-2"
                          onClick={() => setEditingUser(user)}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn btn-danger btn-delete"
                          onClick={() => deleteUser(user._id)}
                        >
                          Xóa
                        </button>
                      </td>
                      <td>
                        {new Date(user.createdAt).toLocaleString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pagination d-flex justify-content-between align-items-center mt-3">
              <button
                className="btn btn-secondary"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Trước
              </button>
              <span>
                Trang {page} / {totalPages}
              </span>
              <button
                className="btn btn-secondary"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Tiếp
              </button>
            </div>
          </div>
        </div>
      </div>

      {editingUser && (
        <UserEdit
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onUserUpdated={fetchUsers}
        />
      )}
      {deductUser && (
        <DeductBalanceForm
          user={deductUser}
          onClose={() => setDeductUser(null)}
          onUserUpdated={fetchUsers}
        />
      )}

      {balanceUser && (
        <AddBalanceForm
          user={balanceUser}
          onClose={() => setBalanceUser(null)}
          onUserUpdated={fetchUsers}
        />
      )}
    </div>
  );
};

export default UserList;
