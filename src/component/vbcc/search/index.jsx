import { useClerk } from "@clerk/clerk-react";
import "../../../App.css";
import Content from "./content";

export default function Index() {
  const { user } = useClerk();
  // console.log(user.publicMetadata);
  return (
    <div className="wrap">
      <h2 className="text-primary font-semibold text-center">
        Tra cứu phụ lục văn bằng
      </h2>
      {user.publicMetadata.vbcc ? (
        <Content />
      ) : (
        <h5 className="text-center">
          Thầy/Cô không có quyền thực hiện chức năng này!
        </h5>
      )}
    </div>
  );
}
