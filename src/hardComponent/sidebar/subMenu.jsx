import "../../App.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function Index({ item }) {
    let location = useLocation();
  const [subnav, setSubnav] = useState(true);
  const handleOnclick = () => {
    setSubnav(!subnav);
  };
  // console.log(location.pathname)

  return (
    <div className="gap-[10px] flex flex-col">
      <button
        className=" flex border-none font-bold bg-transparent cursor-pointer h-fit text-[18px] leading-[30px] text-left rounded-[5px] text-black hover:bg-hovercl"
        onClick={handleOnclick}
      >
        {item.icon} <span className="ml-[10px]">{item.title}</span>
      </button>
      <div className="flex flex-col ml-[30px] gap-[15px]">
        {subnav
          ? item.subNav.map((item, index) => {
              return <Link
                key={index}
                className={`flex text-[16px] text-black decoration-none ${location.pathname === item.path?'font-bold':''} ${index===0?'mt-[15px]':''}`}
                to={item.path}
              >
                {item.icon}
                <span className="ml-[10px]">{item.title}</span>
              </Link>;
            })
          : ''}
      </div>
    </div>
  );
}
