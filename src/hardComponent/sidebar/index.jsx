import "../../App.css";
import { sideBarData } from "./sideBarData";
import SubMenu from "./subMenu"

export default function Index() {
  return <div className="w-[18%]  min-h-[700px] flex flex-col gap-[20px]">
    {sideBarData.map((item,index)=>{
        return <SubMenu item={item} key={index}/>
    })}
  </div>
}
