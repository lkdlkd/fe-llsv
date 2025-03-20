import React, { useState, useEffect } from "react";
import axios from "axios";
import ChangePasswordForm from "./ChangePasswordForm"; // Đường dẫn tương ứng
import Swal from "sweetalert2";
import { fetchUserData } from "../../utils/api"; // Import API từ file api.js

import "../../App.css";

function Profile() {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    const [user, setUser] = useState({});
    const [message, setMessage] = useState("");
    const handleCopy = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => Swal.fire({
                title: "Thành công",
                text: `copy thành công `,
                icon: "success",
                confirmButtonText: "Xác nhận",
            }))
            .catch(err => console.error("Copy error:", err));
    };
    useEffect(() => {
        const getUser = async () => {
            try {
                const data = await fetchUserData(username, token);
                setUser(data);
            } catch (error) {
                console.error("Lỗi khi lấy thông tin user", error);
            }
        };

        if (username && token) {
            getUser();
        }
    }, [username, token]);


    return (
        <div className="row">
            {/* Phần thông tin cá nhân */}
            <div className="col-md-12">
                <div className="card">
                    <div className="card-body">
                        <div class="col-md-12">
                            <div class="tab-content" id="pills-tabContent">
                                <div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div class="card">
                                                <div class="card-header">
                                                    <h5 class="card-title">Thông tin cá nhân</h5>
                                                </div>
                                                <div class="card-body">
                                                    <form action="">
                                                        <div class="row">
                                                            <div class="col-md-6 form-group">
                                                                <label for="username" class="form-label">Tài khoản:</label>
                                                                <input type="text" class="form-control" id="username" disabled
                                                                    value={user.username } />
                                                            </div>

                                                            <div class="col-md-6 form-group">
                                                                <label for="balance" class="form-label">Số dư:</label>
                                                                <input type="text" class="form-control" id="balance" disabled
                                                                    value={user ? Number(user.balance|| 0).toLocaleString("en-US") : "Đang tải..."} />
                                                            </div>
                                                            <div class="col-md-6 form-group">
                                                                <label for="balance" class="form-label">Cấp bậc</label>
                                                                <input type="text" class="form-control" id="balance" disabled
                                                                    value={user.capbac} />
                                                            </div>
                                                            <div class="col-md-6 form-group">
                                                                <label for="balance" class="form-label">Tổng nạp tháng</label>
                                                                <input type="text" class="form-control" id="balance" disabled
                                                                    value={Number(user.tongnapthang || 0).toLocaleString("en-US")}/>
                                                            </div>

                                                            <div class="col-md-6 form-group">
                                                                <label for="balance" class="form-label">Tổng nạp</label>
                                                                <input type="text" class="form-control" id="balance" disabled
                                                                    value={Number(user.tongnap || 0).toLocaleString("en-US")} />
                                                            </div>

                                                            <div className="col-md-6 form-group">
                                                                <label htmlFor="created_at" className="form-label">
                                                                    Thời gian đăng kí:
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    id="created_at"
                                                                    disabled
                                                                    value={new Date(user.createdAt).toLocaleString("vi-VN", {
                                                                        day: "2-digit",
                                                                        month: "2-digit",
                                                                        year: "numeric",
                                                                        hour: "2-digit",
                                                                        minute: "2-digit",
                                                                        second: "2-digit",
                                                                    })}
                                                                />
                                                            </div>

                                                            <div class="col-md-12 form-group">
                                                                <label for="api_token" class="form-label">Api Key</label>
                                                                <div className="input-group">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        id="api_token"
                                                                        readOnly
                                                                        onClick={() => handleCopy(user.token ? user.token : "Bạn chưa tạo Api Token!")}
                                                                        value={user.token ? user.token : "Bạn chưa tạo Api Token!"}
                                                                        placeholder="Bạn cần ấn thay đổi Token"
                                                                    />
                                                                    <button className="btn btn-primary" type="button" id="btn-reload-token">
                                                                        <i className="ti ti-refresh"></i>
                                                                        Thay đổi
                                                                    </button>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="card">
                                                <div class="card-header">
                                                    <h5 class="card-title">Đổi mật khẩu</h5>
                                                </div>
                                                <div class="card-body">
                                                    <ChangePasswordForm userId={user.userId} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
