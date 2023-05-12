import { useClerk } from "@clerk/clerk-react";
import "../../../App.css";
import logo from "../../../assets/logo1.png";

export default function Index() {
  const { user } = useClerk();
  return (
    <div className="fixed z-[1000] w-[100%] h-[80px] shadow-sm flex bg-white">
      <div className="w-[250px] bg-primary h-[100%]">
        <img
          src={logo}
          alt="Logo truong"
          className="h-[100%] w-[250px] object-cover"
        />
      </div>
      <div className="w-[calc(100%_-_250px)] flex justify-end pr-[20px] gap-[10px]">
        <img
          src={logo}
          className="w-[50px] h-[50px] self-center rounded-[50%] object-cover overflow-hidden"
        />
        <div className="flex flex-col justify-center">
          <h3 className="text-center self-center">
            {user.publicMetadata.name}
          </h3>
          <button className="text-[#636e75]">Đăng xuất</button>
        </div>
      </div>
    </div>
  );
}
