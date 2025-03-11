import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserEdit from "./UserEdit";
import AddBalanceForm from "./AddBalanceForm";
import "../../style/UserList.css"; // Import file CSS
import { getUsers, deleteUserById } from "../../utils/apiAdmin";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [balanceUser, setBalanceUser] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      const data = await getUsers(page, 10, token);
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

  return (
    <div className="user-list-container">
      <h2>Danh sách Người dùng</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Role</th>
            <th>Balance</th>
            <th>Cộng tiền</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>{user.balance} VNĐ</td>
              <td>
                <button className="btn-add-balance" onClick={() => setBalanceUser(user)}>
                  Cộng tiền
                </button>
              </td>
              <td>
                <button className="btn-edit" onClick={() => setEditingUser(user)}>
                  Sửa
                </button>
                <button className="btn-delete" onClick={() => deleteUser(user._id)}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Trước
        </button>
        <span>
          Trang {page} / {totalPages}
        </span>
        <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>
          Tiếp
        </button>
      </div>

      {editingUser && (
        <UserEdit
          user={editingUser}
          onClose={() => setEditingUser(null)}
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
