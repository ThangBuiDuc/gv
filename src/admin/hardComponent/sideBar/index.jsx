import "../../../App.css";
import { navLink } from "./sideBarData";
import { NavLink } from "react-router-dom";

export default function Index() {
  return (
    <div className="flex flex-col h-[100%] w-[250px] fixed top-[80px] bg-primary z-[999] overflow-hidden">
      {navLink.map((item, index) => {
        return (
          <div
            key={index}
            className="flex flex-col pl-[20px] pt-[10px] pr-[10px] pb-[20px]"
          >
            <h3 className="text-white">{item.title}</h3>
            <div className="flex flex-col gap-[10px] pl-[20px] p-[10px]">
              {item.subNav.map((item, index) => {
                return (
                  <NavLink
                    key={index}
                    to={item.path}
                    className={({ isActive }) =>
                      `${isActive ? "font-semibold text-white" : ""}`
                    }
                  >
                    {item.title}
                  </NavLink>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
