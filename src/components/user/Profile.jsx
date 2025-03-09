import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../App.css";

function Profile() {
    const username = localStorage.getItem('username');
    const [user, setuser] = useState([]); // Thông tin người dùng
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchuser = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_URL}/api/user/${username}`, {
                    headers: {
                      'Authorization': `Bearer ${token}`
                    }
                  }, {
                    params: { username }  // Gửi userId tới API
                });
                setuser(response.data);
            } catch (error) {
                setMessage(error.response ? error.response.data.message : 'Có lỗi xảy ra, vui lòng thử lại!');
                console.error("Lỗi khi lấy thông tin user", error);
            }
        };
        fetchuser();
    }, [username]); // Chạy lại khi userId thay đổi

    return (
        <div className="profile">
            <img alt="User Avatar" src="https://placehold.co/50x50"/>
            <div className="name">
                Họ và Tên : {user.username}
            </div>
            <div className="rank">
                {user.role}
            </div>
            <ul className="info">
                <li>
                    Ngày tham gia :
                    <span>{user.name}</span>
                </li>
                <li>
                    Số điện thoại :
                    <span>{user.phone}</span>
                </li>
                <li>
                    Số dư :
                    <span>{user.balance}</span>
                </li>
            </ul>
            <div className="actions">
                <button>
                    Nạp tiền
                </button>
                <button>
                    Lịch sử hoạt động
                </button>
            </div>
        </div>
    );
}

export default Profile;
