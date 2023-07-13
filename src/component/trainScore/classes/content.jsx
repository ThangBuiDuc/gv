import { useState } from "react";
import "../../../App.css";
import { AiOutlineRight } from "react-icons/ai";
import { useTransition, animated } from "@react-spring/web";
import useMeasure from "react-use-measure";
import SubContent from "./subContent";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useAuth } from "@clerk/clerk-react";
import { BsFillPersonFill, BsPerson } from "react-icons/bs";
import { GrUserManager } from "react-icons/gr";
import ReactLoading from "react-loading";

export default function Index({ data, rootIndex, isRefetch }) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  // console.log(setRootChecked);
  // const [checkAll, setCheckAll] = useState(false);
  const batch = queryClient.getQueryData({ queryKey: ["RL_BATCH"] });
  const [toggle, setToggle] = useState(false);
  const [ref, { height }] = useMeasure();
  const transitions = useTransition(toggle, {
    from: { opacity: 0, heigth: 0, overflow: "hidden" },
    // to:{opacity: 1, height: 100 },
    enter: { opacity: 1, height, overflow: "visible" },
    leave: { opacity: 0, height: 0, overflow: "hidden" },
    update: { height },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      let updates = data.enrollment
        .filter((item) => item.checked)
        .reduce(
          (total, curr) => [
            ...total,
            ...curr.group_point.map((item) => ({
              _set: { staff_point: item.monitor_point, updated_at: new Date() },
              where: {
                group_id: { _eq: item.group_id },
                student_code: { _eq: item.student_code },
                batch_id: { _eq: batch?.id },
              },
            })),
          ],
          []
        );
      return fetch(import.meta.env.VITE_REN_LUYEN_UPDATE_STAFF, {
        method: "PUT",
        headers: {
          authorization: `Bearer ${await getToken({
            template: import.meta.env.VITE_TEMPLATE_MANAGERMENT,
          })}`,
        },
        body: JSON.stringify({
          updates,
        }),
      })
        .then((res) => res.json())
        .then((res) => res.result);
    },
    onSuccess: async (data) => {
      if (data.some((item) => item.affected_rows !== 1)) {
        Swal.fire({
          title: "Đã có lỗi xảy ra!",
          text: "Vui lòng liên hệ quản trị mạng để khắc phục sự cố",
          icon: "error",
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["rlclasses"] });
        Swal.fire({
          title: "Đánh giá thành công!",
          icon: "success",
        });
        // queryClient.removeQueries({ queryKey: ["RL_CLASSES"], exact: true });
        // queryClient.fetchQuery({
        //   queryKey: ["RL_CLASSES"],
        // });
      }
    },
  });

  const handleOnClick = async () => {
    Swal.fire({
      title: "Duyệt điểm của cán bộ lớp sang điểm của QLSV!",
      text: "Bạn có chắc chắn muốn duyệt điểm không?",
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

    // console.log();
    // await queryClient.removeQueries({ queryKey: ["rlclasses"] });
    // await queryClient.fetchQuery({ queryKey: ["rlclasses"] });
  };
  return (
    <>
      <div className="flex border-t-[1px] pt-[5px] border-solid border-bordercl gap-[10px]">
        <h3 className="w-[10%]">{data.class_code}</h3>
        <h3 className="w-[50%]">Lớp trưởng: {data.canbo.fullname}</h3>
        <div
          className="w-[15%] flex items-center justify-center gap-[10px] tooltip"
          data-tip="Số lượng sinh viên trên tổng sinh viên của lớp đã tự đánh giá!"
        >
          <BsFillPersonFill size={"20px"} />
          <h3>
            {data.enrollment.reduce(
              (total, curr) => (curr.total_self_point ? total + 1 : total),
              0
            )}
            /{data.enrollment.length}
          </h3>
        </div>
        <div
          className="w-[15%] flex items-center justify-center gap-[10px] tooltip"
          data-tip="Số lượng sinh viên trên tổng sinh viên của lớp mà cán bộ lớp đã đánh giá!"
        >
          <BsPerson size={"20px"} />
          <h3>
            {data.enrollment.reduce(
              (total, curr) => (curr.total_monitor_point ? total + 1 : total),
              0
            )}
            /{data.enrollment.length}
          </h3>
        </div>
        <div
          className="w-[15%] flex items-center justify-center gap-[10px] tooltip"
          data-tip="Số lượng sinh viên trên tổng sinh viên của lớp mà quản lý sinh viên đã đánh giá!"
        >
          <GrUserManager size={"20px"} />
          <h3>
            {data.enrollment.reduce(
              (total, curr) => (curr.total_staff_point ? total + 1 : total),
              0
            )}
            /{data.enrollment.length}
          </h3>
        </div>

        {/* <h3 className="w-[15%]">
          Cán bộ:{" "}
          {data.enrollment.reduce(
            (total, curr) => (curr.total_monitor_point ? total + 1 : total),
            0
          )}
          /{data.enrollment.length}
        </h3>
        <h3 className="w-[15%]">
          QLSV:{" "}
          {data.enrollment.reduce(
            (total, curr) => (curr.total_staff_point ? total + 1 : total),
            0
          )}
          /{data.enrollment.length}
        </h3> */}
        <div className="w-[5%] flex justify-center">
          {isRefetch ? (
            <ReactLoading
              type="spin"
              color="#0083C2"
              width={"20px"}
              height={"20px"}
              className="self-center"
            />
          ) : (
            <AiOutlineRight
              size={"20px"}
              className={`${
                toggle ? `rotate-90` : ""
              } transition-all duration-200 self-center  cursor-pointer`}
              onClick={() => setToggle((pre) => !pre)}
            />
          )}
        </div>
      </div>
      <div>
        {transitions(
          (style, toggle) =>
            toggle && (
              <animated.div style={style}>
                <div
                  className="flex gap-[20px] justify-between flex-col p-[10px]"
                  ref={ref}
                >
                  <SubContent data={data} rootIndex={rootIndex} />
                  {data.enrollment.some((item) => item.checked) ? (
                    <button
                      className="selfBtn w-fit self-center"
                      onClick={handleOnClick}
                    >
                      Duyệt điểm cán bộ lớp
                    </button>
                  ) : (
                    <></>
                  )}
                </div>
              </animated.div>
            )
        )}
      </div>
    </>
  );
}
