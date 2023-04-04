import "../../App.css";
import { sideBarData } from "./sideBarData";
import SubMenu from "./subMenu";
import { useContext, Fragment } from "react";
import { RoleContext } from "../../App";

export default function Index() {
  const role = useContext(RoleContext);
 
  return (
    <div className="w-[18%]  min-h-[700px] flex flex-col gap-[20px]">
      {sideBarData.map((item, index) => {
        if (item.role) {
          if (item.role.find((item) => item === role.role?.role_id.toString()))
            return (
              <Fragment key={index}>
                <SubMenu item={item} index={index} />
              </Fragment>
            );
        } else
          return (
            <Fragment key={index}>
              <SubMenu item={item} index={index} />
            </Fragment>
          );
      })}
    </div>
  );
}

// item.role ? (
//   item.role == role?.role_id ? (
//     <SubMenu item={item} index={index} />
//   ) : (
//     <></>
//   )
// ) : (
//   <SubMenu item={item} index={index} />
// );
// })}
// }
