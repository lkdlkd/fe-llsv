// import SmmForm from "./SmmForm";
import React, { useEffect, useState } from "react";
import { getDashboardStats } from "../../utils/apiAdmin";
const Quantri = () => {
  const [stats, setStats] = useState({
    totalUser: 0,
    totalBalance: 0,
    totalRecharge: 0,
    totalUserToday: 0,
    totalRevenue: 0,
    totalRefund: 0,
    totalCanceled: 0,
    totalRechargeToday: 0,
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats(token);

        setStats(data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu thống kê:", error);
      }
    };

    fetchStats();
  }, []);
  return (
    <div class="row">
      <div class="col-md-3">
        <div class="card">
          <div class="card-body p-3">
            <div class="d-flex align-items-center">
              <div class="avtar bg-light-success me-3">
                <i class="ti ti-users fs-2"></i>
              </div>
              <div>
                <h4 class="mb-0">{Number(stats.tonguser).toLocaleString("en-US")}</h4>
                <p class="mb-0 text-opacity-75 capitalize">Tổng thành viên</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card">
          <div class="card-body p-3">
            <div class="d-flex align-items-center">
              <div class="avtar bg-light-warning me-3">
                <i class="ti ti-coin fs-2"></i>
              </div>
              <div>
                <h4 class="mb-0">{Number(stats.tongtienweb).toLocaleString("en-US")}</h4>
                <p class="mb-0 text-opacity-75 capitalize">Tổng số dư</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card">
          <div class="card-body p-3">
            <div class="d-flex align-items-center">
              <div class="avtar bg-light-primary me-3">
                <i class="ti ti-coin fs-2"></i>
              </div>
              <div>
                <h4 class="mb-0">{Number(stats.tongdanap).toLocaleString("en-US")}</h4>
                <p class="mb-0 text-opacity-75 capitalize">Tổng đã nạp</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card">
          <div class="card-body p-3">
            <div class="d-flex align-items-center">
              <div class="avtar bg-light-info me-3">
                <i class="ti ti-users fs-2"></i>
              </div>
              <div>
                <h4 class="mb-0">{Number(stats.tongnapthang).toLocaleString("en-US")}</h4>
                <p class="mb-0 text-opacity-75 capitalize">Tổng nạp tháng</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card">
          <div class="card-body p-3">
            <div class="d-flex align-items-center">
              <div class="avtar bg-light-warning me-3">
                <i class="ti ti-coin fs-2"></i>
              </div>
              <div>
                <h4 class="mb-0">{Number(stats.tongdoanhthu).toLocaleString("en-US")}</h4>
                <p class="mb-0 text-opacity-75 capitalize">Tổng doanh thu</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card">
          <div class="card-body p-3">
            <div class="d-flex align-items-center">
              <div class="avtar bg-light-warning me-3">
                <i class="ti ti-coin fs-2"></i>
              </div>
              <div>
                <h4 class="mb-0">{Number(stats.tongdondangchay).toLocaleString("en-US")}</h4>
                <p class="mb-0 text-opacity-75 capitalize">Đơn hàng đang chạy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card">
          <div class="card-body p-3">
            <div class="d-flex align-items-center">
              <div class="avtar bg-light-primary me-3">
                <i class="ti ti-coin fs-2"></i>
              </div>
              <div>
                <h4 class="mb-0">{Number(stats.tongnapngay).toLocaleString("en-US")}</h4>
                <p class="mb-0 text-opacity-75 capitalize">Nạp tiền hôm nay</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card">
          <div class="card-body p-3">
            <div class="d-flex align-items-center">
              <div class="avtar bg-light-primary me-3">
                <i class="ti ti-coin fs-2"></i>
              </div>
              <div>
                <h4 class="mb-0">{Number(stats.tongdoanhthuhnay).toLocaleString("en-US")}</h4>
                <p class="mb-0 text-opacity-75 capitalize">Doanh thu hôm nay</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-12">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title">Thống kê doanh thu</h5>
          </div>
          <div class="card-body">
            <div id="sdk-dlsk-fk"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quantri;