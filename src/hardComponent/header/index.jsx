// import { Link } from "react-router-dom";
// import { useLocation , useNavigate} from "react-router-dom";
// import { useState } from "react";
import logo from "../../assets/logo.png";
import '../../App.css'

export default function Index(){
    // const 
    return <div className="flex flex-col">
        <div className="bg-primary h-[90px] flex w-full justify-between">
            <div className='flex'>
                <img src={logo} alt="" className='w-[150px] h-[90px] object-scale-down' />
                <div className="flex flex-col justify-center">
                    <p className="text-[16px] text-white uppercase font-normal">trường đại học quản lý và công nghệ Hải Phòng</p>
                    <h2 className="text-white mt-[10px] uppercase">TEST</h2>
                </div>
            </div>

            {/* Condition here */}
            <button className="bg-transparent border-none text-white font-bold text-[15px] cursor-pointer mr-[20px]">Đăng nhập</button>
        </div>
    </div>
}