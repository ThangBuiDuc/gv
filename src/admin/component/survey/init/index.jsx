import "../../../../App.css";
import ReactLoading from "react-loading";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import Swal from "sweetalert2";

export default function Index() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
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
        .then((res) => res.hientai[0]);
    },
    enabled: role.data?.role_id == import.meta.env.VITE_ROLE_ADMIN,
  });

  const eduPresent = useQuery({
    queryKey: ["EDU_PRESENT"],
    queryFn: async () => {
      return await fetch(import.meta.env.VITE_EDUMNG_PRESENT)
        .then((res) => res.json())
        .then((res) => (res?.hientai.length > 0 ? res?.hientai[0] : null));
    },
    enabled: role.data?.role_id == import.meta.env.VITE_ROLE_ADMIN,
  });

  const question = useQuery({
    queryKey: ["getQuestion_CTGD"],
    queryFn: async () => {
      return await fetch(`${import.meta.env.VITE_PRE_QUESTION_API}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${await getToken({
            template: import.meta.env.VITE_TEMPLATE_GV_CREATOR,
          })}`,
        },
      })
        .then((res) => res.json())
        .then((res) => (res?.question.length > 0 ? res.question : null));
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      return await fetch(import.meta.env.VITE_INIT_SURVEY_API, {
        method: "POST",
        headers: {
          authorization: `Bearer ${await getToken({
            template: import.meta.env.VITE_TEMPLATE_GV_CREATOR,
          })}`,
        },
        body: JSON.stringify({
          batch: [
            {
              hocky: eduPresent?.data.hocky,
              manamhoc: eduPresent?.data.manamhoc,
              isactive: true,
            },
          ],
          form_survey: question?.data.map((item) => ({
            question_id: item.question_id,
            namhoc: eduPresent?.data.manamhoc,
            hocky: eduPresent?.data.hocky,
          })),
        }),
      }).then((res) => res.json());
    },
    onSuccess: (data) => {
      if (
        data.insert_batch.affected_rows !== 1 ||
        data.insert_form_survey.affected_rows === 0
      ) {
        Swal.fire({
          title: "Đã có lỗi xảy ra!",
          text: "Vui lòng liên hệ quản trị mạng để khắc phục sự cố",
          icon: "error",
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["getPresent_CTGD"] });
        Swal.fire({
          title: `Khởi tạo đợt thành công!`,
          icon: "success",
        });
      }
    },
  });

  const handleOnclick = () => {
    Swal.fire({
      title: `Khởi tạo đợt đánh giá chất lượng công tác giảng dạy học kỳ ${eduPresent?.data.hocky} năm ${eduPresent?.data.manamhoc}`,
      html: `<p>
            Bạn có chắc chắn muốn tạo đợt đánh giá chất lượng công tác giảng dạy không?
          </p>`,
      icon: "question",
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Huỷ bỏ",
      showLoaderOnConfirm: () => !Swal.isLoading(),
      allowOutsideClick: false,
      preConfirm: async () => {
        await mutation.mutateAsync();
      },
    });
  };

  // const inited = useQuery({
  //   queryKey: ["getInited_CTGD"],
  //   queryFn: async () => {
  //     return await fetch(
  //       `${import.meta.env.VITE_CHECK_INITED_API}${present.data[0]?.hocky}/${
  //         present.data[0]?.manamhoc
  //       }`
  //     )
  //       .then((res) => res.json())
  //       .then((res) => res.result[0].result);
  //   },
  //   enabled: present.data?.length > 0,
  // });

  if (role.isLoading && role.isFetching) {
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
    (present.isLoading && present.isFetching) ||
    (eduPresent.isLoading && eduPresent.isFetching) ||
    (question.isLoading && question.isFetching)
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

  console.log(present.data);
  console.log(eduPresent.data);
  return (
    <div className="wrapAdmin">
      <div className="flex justify-center">
        <h2 className="text-primary">Khởi tạo đợt đánh giá</h2>
      </div>
      {present?.data.hocky !== eduPresent?.data.hocky ||
      present?.data.manamhoc !== eduPresent?.data.manamhoc ? (
        <div className="flex justify-center flex-col gap-[10px]">
          <h3 className="text-primary text-center">Học kỳ mới</h3>
          <div className="flex justify-center gap-[30px]">
            <p className="font-semibold">Học kỳ: {eduPresent?.data.hocky}</p>
            <p className="font-semibold">
              Năm học: {eduPresent?.data.manamhoc}
            </p>
          </div>
          <button className="selfBtn w-fit self-center" onClick={handleOnclick}>
            Khởi tạo kỳ mới
          </button>
          {/* <div className="flex justify-center flex-col gap-[10px] m-[20px]">
            <h3 className="text-primary text-center">
              Thông tin các lớp hành chính lấy được từ EDU
            </h3>
            <ClassPreInit />
          </div> */}
        </div>
      ) : (
        <div className="flex justify-center flex-col gap-[10px]">
          <h3 className="text-primary text-center">Học kỳ hiện tại</h3>
          <div className="flex justify-center gap-[30px]">
            <p className="font-semibold">Học kỳ: {present?.data.hocky}</p>
            <p className="font-semibold">Năm học: {present?.data.manamhoc}</p>
          </div>
          <h3 className=" text-center mt-[20px]">
            Hiện tại chưa có dữ liệu của học kỳ mới. Vui lòng chuyển sang cập
            nhật lớp môn học nếu chưa thực hiện!
          </h3>
        </div>
      )}
    </div>
  );
}
