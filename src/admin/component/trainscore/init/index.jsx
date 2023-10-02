import "../../../../App.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ReactLoading from "react-loading";
import { useAuth } from "@clerk/clerk-react";
import Select from "react-select";
import { useState } from "react";
import { useEffect } from "react";
import Swal from "sweetalert2";
// import ClassPreInit from "./classPreInit";
export default function Index() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [options, setOptions] = useState();
  const [selected, setSelected] = useState();
  const batch = useQuery({
    queryKey: ["RL_BATCH"],
    queryFn: async () => {
      return await fetch(import.meta.env.VITE_RL_BATCH)
        .then((res) => res.json())
        .then((res) => (res?.result.length > 0 ? res?.result[0] : null));
    },
  });

  const eduBatch = useQuery({
    queryKey: ["EDU_BATCH"],
    queryFn: async () => {
      return await fetch(import.meta.env.VITE_EDUMNG_PRESENT)
        .then((res) => res.json())
        .then((res) => (res?.hientai.length > 0 ? res?.hientai[0] : null));
    },
  });

  const role = useQuery({
    queryKey: ["RL_ROLE", { type: "admin" }],
    queryFn: async () => {
      return await fetch(import.meta.env.VITE_RL_ROLE_ADMIN, {
        method: "GET",
        headers: {
          authorization: `Bearer ${await getToken({
            template: import.meta.env.VITE_TEMPLATE_SUPER_ADMIN,
          })}`,
        },
      })
        .then((res) => res.json())
        .then((res) => (res?.result.length > 0 ? res?.result[0] : null));
    },
  });

  const gv = useQuery({
    queryKey: ["RL_GV"],
    queryFn: async () => {
      return await fetch(`${import.meta.env.VITE_RL_GV}${batch?.data.id}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${await getToken({
            template: import.meta.env.VITE_TEMPLATE_SUPER_ADMIN,
          })}`,
        },
      }).then((res) => res.json());
    },
    enabled:
      batch.data !== null &&
      batch.data !== undefined &&
      role?.data !== null &&
      role?.data !== undefined &&
      role?.data.role_id.toString() === import.meta.env.VITE_ROLE_RL_ADMIN,
  });

  useEffect(() => {
    if (gv.data) {
      setOptions(
        gv.data.gv.map((item) => ({
          value: item.magiaovien,
          label: `${item.magiaovien} - ${item.fullname}`,
        }))
      );
      let superManager = gv.data.gv.find(
        (item) => item.magiaovien === gv.data.superManager[0].user_code
      );
      setSelected({
        value: superManager.magiaovien,
        label: `${superManager.magiaovien} - ${superManager.fullname}`,
      });
    }
  }, [gv.data]);

  const mutation = useMutation({
    mutationFn: async () => {
      return await fetch(import.meta.env.VITE_RL_INIT, {
        method: "POST",
        headers: {
          authorization: `Bearer ${await getToken({
            template: import.meta.env.VITE_TEMPLATE_SUPER_ADMIN,
          })}`,
        },
        body: JSON.stringify({
          objects: {
            term: eduBatch?.data.hocky,
            school_year: eduBatch?.data.manamhoc,
            is_active: true,
          },
          objects1: {
            batch_id: batch?.data.id + 1,
            user_code: selected.value,
            role_id: 5,
          },
        }),
      }).then((res) => res.json());
    },
    onSuccess: (data) => {
      if (
        data.insert_batchs.affected_rows !== 1 ||
        data.insert_user_roles.affected_rows !== 1
      ) {
        Swal.fire({
          title: "Đã có lỗi xảy ra!",
          text: "Vui lòng liên hệ quản trị mạng để khắc phục sự cố",
          icon: "error",
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["RL_BATCH"] });
        Swal.fire({
          title: `Khởi tạo đợt thành công!`,
          icon: "success",
        });
      }
    },
  });

  const handleOnclick = () => {
    Swal.fire({
      title: `Khởi tạo đợt đánh giá rèn luyện học kỳ ${eduBatch?.data.hocky} năm ${eduBatch?.data.manamhoc}`,
      html: `<p>
            Bạn có chắc chắn muốn tạo đợt đánh giá rèn luyện với thầy/cô <span style="font-weight:600;">${selected.label}</span> làm phụ trách quản lý sinh viên không?
          </p>`,
      icon: "question",
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Huỷ bỏ",
      showLoaderOnConfirm: () => !Swal.isLoading(),
      preConfirm: async () => {
        await mutation.mutateAsync();
      },
    });
  };

  if (
    (batch.isLoading && batch.isFetching) ||
    (eduBatch.isLoading && eduBatch.isFetching) ||
    (role.isLoading && role.isFetching)
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

  if (
    role.data === null ||
    role?.data.role_id.toString() !== import.meta.env.VITE_ROLE_RL_ADMIN
  ) {
    return (
      <div className="wrapAdmin">
        <div className="flex justify-center">
          <h2 className="text-primary">Khởi tạo đợt đánh giá</h2>
        </div>
        <div className="flex justify-center">
          <h3>Tài khoản không có quyền thực hiện chức năng này!</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapAdmin">
      <div className="flex justify-center">
        <h2 className="text-primary">Khởi tạo đợt đánh giá</h2>
      </div>
      {batch?.data.term !== eduBatch?.data.hocky ||
      batch?.data.school_year !== eduBatch?.data.manamhoc ? (
        <div className="flex justify-center flex-col gap-[10px]">
          <h3 className="text-primary text-center">Học kỳ mới</h3>
          <div className="flex justify-center gap-[30px]">
            <p className="font-semibold">Học kỳ: {eduBatch?.data.hocky}</p>
            <p className="font-semibold">Năm học: {eduBatch?.data.manamhoc}</p>
          </div>
          <div className="flex justify-center gap-[10px] m-[20px] items-center">
            <p className="font-semibold">Phụ trách quản lý sinh viên: </p>
            <Select
              options={options}
              className="w-[350px]"
              placeholder="Phụ trách quản lý sinh viên"
              noOptionsMessage={() => "Không có kết quả"}
              value={selected}
              onChange={setSelected}
            />
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
            <p className="font-semibold">Học kỳ: {batch?.data.term}</p>
            <p className="font-semibold">Năm học: {batch?.data.school_year}</p>
          </div>
          <h3 className=" text-center mt-[20px]">
            Hiện tại chưa có dữ liệu của học kỳ mới. Vui lòng chuyển sang cập
            nhật lớp hành chính nếu chưa thực hiện!
          </h3>
        </div>
      )}
    </div>
  );
}
