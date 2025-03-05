import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import MenuAdmin from "./admin/AdminMenu";
import Footer from "./Footer";
import MenuUser from "./MenuUser";

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const location = useLocation();

  return (
    <>
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      {isMenuOpen && (location.pathname.startsWith("/quantri") ? <MenuAdmin /> : <MenuUser />)}
      <div class="pc-container">
        <div class="pc-content">
          <div class="page-header mb-0">
            <div class="page-block">
              <div class="row align-items-center">
                <div class="col-md-12">

                </div>
              </div>
            </div>
          </div>
          <Outlet /> {/* Dùng Outlet để hiển thị nội dung của Route con */}
        </div>
      </div>          
      <Footer/>
      {/* {isMenuOpen && (location.pathname.startsWith("/quantri") ? <d/>: <Profile /> )}       */}
    </>
  );
};

export default Layout;
