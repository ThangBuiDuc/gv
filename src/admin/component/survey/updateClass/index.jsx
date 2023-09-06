import "../../../../App.css";
import ReactLoading from "react-loading";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import Content from "./content";

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
        .then((res) => res.hientai[0]);
    },
    enabled: role.data?.role_id == import.meta.env.VITE_ROLE_ADMIN,
  });

  if (role.isLoading && role.isFetching) {
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

  if (present.isLoading && present.isFetching) {
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
        <h2 className="text-primary">Cập nhật lớp môn học</h2>
      </div>
      <div className="flex justify-center gap-[30px]">
        <p className="font-semibold">Học kỳ: {present?.data.hocky}</p>
        <p className="font-semibold">Năm học: {present?.data.manamhoc}</p>
      </div>
      <div className="flex justify-center flex-col gap-[10px]">
        <h3 className="text-primary text-center">
          Danh sách những lớp môn học chưa được đưa vào đợt đánh giá
        </h3>
        <Content />
      </div>
    </div>
  );
}
