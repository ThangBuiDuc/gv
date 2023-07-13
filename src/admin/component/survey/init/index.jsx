import "../../../../App.css";
import Present from "./present";
import Question from "./question";
import ReactLoading from "react-loading";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";

export default function Index() {
  const { getToken } = useAuth();
  // let date = new Date();
  // const [startDate, setStartDate] = useState(date.toISOString().slice(0, 10));
  // const [endDate, setEndDate] = useState(
  //   new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  // );

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
    enabled: role.data?.role_id == import.meta.env.VITE_ROLE_ADMIN,
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
          <h2 className="text-primary">Khởi tạo đợt đánh giá</h2>
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
          <h2 className="text-primary">Khởi tạo đợt đánh giá</h2>
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
          <h2 className="text-primary">Khởi tạo đợt đánh giá</h2>
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
        <h2 className="text-primary">Khởi tạo đợt đánh giá</h2>
      </div>
      {inited.data === true ? (
        <div className="flex justify-center">
          <h3>
            Đã khởi tạo đợt đánh giá cho kỳ hiện tại trước đó. Vui lòng chuyển
            sang mục duyệt đánh giá cho lớp môn học!
          </h3>
        </div>
      ) : (
        <>
          <Present />
          <Question />
        </>
      )}
    </div>
  );
}
