// import { Link } from "react-router-dom";
// import { useLocation , useNavigate} from "react-router-dom";
// import { useState } from "react";
import logo from "../../assets/logo.png";
import '../../App.css'
import { useUser , useClerk} from "@clerk/clerk-react";
import {useNavigate } from "react-router-dom";
import { RoleContext } from "../../App";
import { useContext } from "react";

export default function Index(){
  const role = useContext(RoleContext);
    const {isSignedIn,user} = useUser();
    const {signOut} = useClerk();
    // const location = useLocation();
    const navigate = useNavigate();
  
    const handleLogIn = () => {
      window.location.href = '/sign-in'
    };
  
    const handleLogOut = () => {
      role.setRole(null)
      signOut();
      navigate('/home')
    };



    // const 
    return <div className="flex flex-col">
        <div className="bg-primary h-[90px] flex w-full justify-between">
            <div className='flex'>
                <img src={logo} alt="" className='w-[150px] h-[90px] object-scale-down' />
                <div className="flex flex-col justify-center">
                    <p className="text-[16px] text-white uppercase font-normal">trường đại học quản lý và công nghệ Hải Phòng</p>
                    <h2 className="text-white mt-[10px] uppercase">cổng thông tin giảng viên</h2>
                </div>
            </div>
            {isSignedIn? (
          <div className="flex gap-[10px] mr-[20px] items-center">
            <img
              src={`#`}
              alt="avatar"
              className="align-middle w-[70px] h-[70px] rounded-[50%] overflow-hidden border-solid border-[1px] border-[#00000029]"
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p style={{ color: "white" }}>{user.publicMetadata.name}</p>
              <button
                style={{ marginBottom: "0px" }}
                className="cursor-pointer text-white font-semibold"
                onClick={handleLogOut}
              >
                Đăng xuất
              </button>
            </div>
          </div>
        ) : (
          <button onClick={handleLogIn}
          className="cursor-pointer text-white font-semibold mr-[20px]">
            Đăng nhập
          </button>
        )}
        </div>
    </div>
}