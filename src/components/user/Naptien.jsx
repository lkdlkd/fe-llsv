import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../App.css";

function Naptien() {
    const [banks, setBanks] = useState([]);
    const [user, setUser] = useState({});
    const username = localStorage.getItem("username");
    const [message, setMessage] = useState("");
    
    useEffect(() => {
      const fetchUser = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_URL}/api/user/${username}`, {
            params: { username },
          });
          setUser(response.data);
        } catch (error) {
          setMessage(
            error.response ? error.response.data.message : "Có lỗi xảy ra, vui lòng thử lại!"
          );
          console.error("Lỗi khi lấy thông tin user", error);
        }
      };
      fetchUser();
    }, [username]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_URL}/api/banks`)
            .then(response => setBanks(response.data))
            .catch(error => console.error("Error fetching bank info:", error));
    }, []);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text)
          .then(() => alert("Đã copy: " + text))
          .catch(err => console.error("Copy error:", err));
    };

    if (banks.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            
            {banks.map((bank) => (
                <div key={bank._id} className="card">
                    <div className="card-body">
                        <h4 className="card-title mb-3">Thanh toán hoá đơn - {bank.bank_name}</h4>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="py-3 text-center bg-light-primary rounded-2 fw-bold mb-4">
                                    Nạp tiền qua chuyển khoản
                                </div>
                                <table className="table table-row-dashed table-row-gray-300 gy-7">
                                    <tbody>
                                        <tr>
                                            <td>Ngân Hàng</td>
                                            <td>
                                                <p className="text-info fw-bolder ng-binding bank-name" style={{ cursor: "pointer", color: "red", display: "inline-block" }}>
                                                    {bank.bank_name}
                                                </p>
                                                <button 
                                                  type="button" 
                                                  className="btn btn-primary text-sm btn-sm ml-3 btn-copy"
                                                  onClick={() => handleCopy(bank.bank_name)}>
                                                    sao chép
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Tên chủ tài khoản</td>
                                            <td>
                                                <p className="text-info fw-bolder ng-binding account-owner" style={{ cursor: "pointer", color: "red", display: "inline-block" }}>
                                                    {bank.account_name}
                                                </p>
                                                <button 
                                                  type="button" 
                                                  className="btn btn-primary text-sm btn-sm ml-3 btn-copy"
                                                  onClick={() => handleCopy(bank.account_name)}>
                                                    Copy
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Số tài khoản</td>
                                            <td>
                                                <p className="text-info fw-bolder ng-binding account-number" style={{ cursor: "pointer", color: "red", display: "inline-block" }}>
                                                    {bank.account_number}
                                                </p>
                                                <button 
                                                  type="button" 
                                                  className="btn btn-primary text-sm btn-sm ml-3 btn-copy"
                                                  onClick={() => handleCopy(bank.account_number)}>
                                                    Copy
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Nội dung chuyển khoản</td>
                                            <td>
                                                <p className="text-info fw-bolder ng-binding content-tranfer" style={{ cursor: "pointer", color: "red", display: "inline-block" }}>
                                                    likesubviet {user.username}
                                                </p>
                                                <button 
                                                  type="button" 
                                                  className="btn btn-primary text-sm btn-sm ml-3 btn-copy"
                                                  onClick={() => handleCopy(`likesubviet ${user.username}`)}>
                                                    Copy
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Nạp ít nhất</td>
                                            <td>
                                                <p className="text-info fw-bolder ng-binding amount-money" style={{ cursor: "pointer", color: "red", display: "inline-block" }}>
                                                    {bank.min_recharge}
                                                </p>
                                                <button 
                                                  type="button" 
                                                  className="btn btn-primary text-sm btn-sm ml-3 btn-copy"
                                                  onClick={() => handleCopy(bank.min_recharge.toString())}>
                                                    Copy
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="col-md-6">
                                <div className="py-3 text-center bg-light-primary rounded-2 fw-bold mb-4">
                                    Nạp tiền qua quét mã QR
                                </div>
                                <div className="text-center mb-3">
                                    <img
                                        src={`https://img.vietqr.io/image/${bank.bank_name}-${bank.account_number}-qronly2.jpg?accountName=${bank.account_name}&addInfo=likesubviet ${username}&amount=${bank.min_recharge}`}
                                        alt="QR CODE"
                                        width="300"
                                    />
                                    {/* <button 
                                      type="button" 
                                      className="btn btn-primary btn-sm mt-2"
                                      onClick={() => handleCopy(`https://img.vietqr.io/image/${bank.bank_name}-${bank.account_number}-qronly2.jpg?accountName=${bank.account_name}&addInfo=likesubviet ${username}&amount=${bank.min_recharge}`)}>
                                        Copy QR URL
                                    </button> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            {message && <p className="text-danger">{message}</p>}
        </div>
    );
}

export default Naptien;
