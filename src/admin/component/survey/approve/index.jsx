import "../../../../App.css";
import ReactLoading from "react-loading";
import Approve from "./approve";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";

export default function Index() {
  const { getToken } = useAuth();

  const role = useQuery({
    queryKey: ["getRole_CTGD"],
    queryFn: async () => {
      return await fetch(`${import.meta.env.VITE_ROLE_API}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${await getToken({
            template: import.meta.env.VITE_TEMPLATE_ROLE,
          })}`,
        },
      })
        .then((res) => res.json())
        .then((res) => res.result[0]);
    },
  });

  const present = useQuery({
    queryKey: ["getPresent_CTGD"],
    queryFn: async () => {
      return await fetch(`${import.meta.env.VITE_PRESENT_API}`)
        .then((res) => res.json())
        .then((res) => res.hientai);
    },
    enabled: role.data?.role_id.toString() === import.meta.env.VITE_ROLE_ADMIN,
  });

  const inited = useQuery({
    queryKey: ["getInited_CTGD"],
    queryFn: async () => {
      return await fetch(
        `${import.meta.env.VITE_CHECK_INITED_API}${present.data[0]?.hocky}/${
          present.data[0]?.manamhoc
        }`
      )
        .then((res) => res.json())
        .then((res) => res.result[0].result);
    },
    enabled: present.data?.length > 0,
  });

  if (role.isLoading || role.isFetching) {
    return (
      <div className="wrapAdmin">
        <div className="flex justify-center">
          <h2 className="text-primary">Duyệt đánh giá lớp môn học</h2>
        </div>
        <ReactLoading
          type="spin"
          color="#0083C2"
          width={"50px"}
          height={"50px"}
          className="self-center"
        />
      </div>
    );
  }

  if (role.data.role_id != import.meta.env.VITE_ROLE_ADMIN) {
    return (
      <div className="wrapAdmin">
        <div className="flex justify-center">
          <h2 className="text-primary">Duyệt đánh giá lớp môn học</h2>
        </div>
        <div className="flex justify-center">
          <h3>Tài khoản hiện tại không có quyền thực hiện chức năng này!</h3>
        </div>
      </div>
    );
  }

  if (
    present.isLoading ||
    present.isFetching ||
    inited.isLoading ||
    inited.isFetching
  ) {
    return (
      <div className="wrapAdmin">
        <div className="flex justify-center">
          <h2 className="text-primary">Duyệt đánh giá lớp môn học</h2>
        </div>
        <ReactLoading
          type="spin"
          color="#0083C2"
          width={"50px"}
          height={"50px"}
          className="self-center"
        />
      </div>
    );
  }

  return (
    <div className="wrapAdmin">
      <div className="flex justify-center">
        <h2 className="text-primary">Duyệt đánh giá lớp môn học</h2>
      </div>
      {inited.data === true ? (
        <Approve />
      ) : (
        <div className="flex justify-center">
          <h3>Chưa khởi tạo đợt đánh giá, vui lòng khởi tạo đợt đánh giá!</h3>
        </div>
      )}
    </div>
  );
}
