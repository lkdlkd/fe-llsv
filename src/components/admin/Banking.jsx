import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../App.css";

function Banking() {
    const [banks, setBanks] = useState([]);
    const [formData, setFormData] = useState({
        bank_name: '',
        account_name: '',
        account_number: '',
        logo: '',
        bank_account: '',
        bank_password: '',
        min_recharge: 0,
        status: true,
        token: ''
    });
    const [editing, setEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    // Lấy danh sách ngân hàng khi component load
    useEffect(() => {
        fetchBanks();
    }, []);

    const fetchBanks = () => {
        axios.get('http://localhost:5000/api/banks')
            .then(response => setBanks(response.data))
            .catch(error => console.error("Error fetching bank info:", error));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(editing) {
            // Cập nhật ngân hàng hiện có
            axios.put(`http://localhost:5000/api/banks/${editId}`, formData)
                .then(response => {
                    fetchBanks();
                    setEditing(false);
                    setEditId(null);
                    resetForm();
                })
                .catch(error => console.error("Error updating bank info:", error));
        } else {
            // Thêm ngân hàng mới
            axios.post('http://localhost:5000/api/creatbank', formData)
                .then(response => {
                    fetchBanks();
                    resetForm();
                })
                .catch(error => console.error("Error submitting bank info:", error));
        }
    };

    const resetForm = () => {
        setFormData({
            bank_name: '',
            account_name: '',
            account_number: '',
            logo: '',
            bank_account: '',
            bank_password: '',
            min_recharge: 0,
            status: true,
            token: ''
        });
    };

    const handleEdit = (bank) => {
        setEditing(true);
        setEditId(bank._id);
        setFormData({
            bank_name: bank.bank_name,
            account_name: bank.account_name,
            account_number: bank.account_number,
            logo: bank.logo || '',
            bank_account: bank.bank_account,
            bank_password: bank.bank_password,
            min_recharge: bank.min_recharge,
            status: bank.status,
            token: bank.token || ''
        });
    };

    const handleDelete = (id) => {
        axios.delete(`${process.env.REACT_APP_URL}/api/banks/${id}`)
            .then(response => {
                fetchBanks();
            })
            .catch(error => console.error("Error deleting bank:", error));
    };

    return (
        <div className="card">
            <div className="card-body">
                <h4 className="card-title mt-5">{editing ? "Chỉnh sửa ngân hàng" : "Thêm ngân hàng"}</h4>
                <div className="row">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Ngân Hàng</label>
                            <input type="text" name="bank_name" className="form-control" onChange={handleChange} value={formData.bank_name} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Tên chủ tài khoản</label>
                            <input type="text" name="account_name" className="form-control" onChange={handleChange} value={formData.account_name} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Số tài khoản</label>
                            <input type="text" name="account_number" className="form-control" onChange={handleChange} value={formData.account_number} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Logo</label>
                            <input type="text" name="logo" className="form-control" onChange={handleChange} value={formData.logo} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Tài khoản ngân hàng</label>
                            <input type="text" name="bank_account" className="form-control" onChange={handleChange} value={formData.bank_account} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Mật khẩu ngân hàng</label>
                            <input type="password" name="bank_password" className="form-control" onChange={handleChange} value={formData.bank_password} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Số tiền nạp tối thiểu</label>
                            <input type="number" name="min_recharge" className="form-control" onChange={handleChange} value={formData.min_recharge} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Trạng thái</label>
                            <input type="checkbox" name="status" checked={formData.status} onChange={handleChange} /> Hoạt động
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Token</label>
                            <input type="text" name="token" className="form-control" onChange={handleChange} value={formData.token} />
                        </div>
                        <button type="submit" className="btn btn-primary">{editing ? "Cập nhật" : "Thêm"}</button>
                    </form>
                </div>
                <hr />
                <h4 className="card-title mt-5">Danh sách ngân hàng</h4>
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Ngân Hàng</th>
                                <th>Tên chủ tài khoản</th>
                                <th>Số tài khoản</th>
                                <th>Logo</th>
                                <th>Tài khoản ngân hàng</th>
                                <th>Số tiền nạp tối thiểu</th>
                                <th>Trạng thái</th>
                                <th>Token</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {banks.map(bank => (
                                <tr key={bank._id}>
                                    <td>{bank.bank_name}</td>
                                    <td>{bank.account_name}</td>
                                    <td>{bank.account_number}</td>
                                    <td>{bank.logo}</td>
                                    <td>{bank.bank_account}</td>
                                    <td>{bank.min_recharge}</td>
                                    <td>{bank.status ? "Hoạt động" : "Ngưng hoạt động"}</td>
                                    <td>{bank.token}</td>
                                    <td>
                                        <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(bank)}>Sửa</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(bank._id)}>Xóa</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Banking;
