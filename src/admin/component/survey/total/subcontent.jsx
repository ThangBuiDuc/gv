import "../../../../App.css";
import Swal from "sweetalert2";
import { useAuth } from "@clerk/clerk-react";

export default function Index({
  dataCourse,
  present,
  afterUpdate,
  setAfterUpdate,
  toggle,
  setToggle,
}) {
  const { getToken } = useAuth();
  const handleOnClickSV = () => {
    // if (
    //   new Date().setHours(0, 0, 0, 0) <
    //   new Date(dataCourse.end_date).setHours(0, 0, 0, 0)
    // ) {
    //   Swal.fire({
    //     title: "Môn học chưa kết thúc",
    //     text: `Môn học hiện tại chưa qua ngày kết thúc ${dataCourse.end_date}`,
    //     icon: "warning",
    //   });
    // } else {
    Swal.fire({
      title: `${
        dataCourse.class_code +
        " - " +
        dataCourse.class_name +
        " - " +
        dataCourse.user.name
      }`,
      text: "Bạn có chắc chắn muốn cho tính tổng điểm sinh viên của môn học này không?",
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Huỷ",
      confirmButtonText: "Xác nhận",
      allowOutsideClick: () => !Swal.isLoading(),
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        let result = await fetch(`/api/sv-final-result`, {
          method: "POST",
          body: JSON.stringify({
            class_code: dataCourse.class_code,
            subject_code: dataCourse.subject_code,
            present,
            token: await getToken({
              template: import.meta.env.VITE_TEMPLATE_GV_CREATOR,
            }),
          }),
        }).then((res) => res.status);

        if (result === 200) {
          // setToggle(!toggle);
          setAfterUpdate(!afterUpdate);
          Swal.fire({
            title: "Tổng kết điểm sinh viên thành công!",
            icon: "success",
          });
        } else
          Swal.fire({
            title: "Tổng kết điểm sinh viên không thành công",
            icon: "error",
          });
      },
    });
    // }
  };

  const handleOnClickGV = () => {
    // if (
    //   new Date().setHours(0, 0, 0, 0) <
    //   new Date(dataCourse.end_date).setHours(0, 0, 0, 0)
    // ) {
    //   Swal.fire({
    //     title: "Môn học chưa kết thúc",
    //     text: `Môn học hiện tại chưa qua ngày kết thúc ${dataCourse.end_date}`,
    //     icon: "warning",
    //   });
    // } else {
    Swal.fire({
      title: `${
        dataCourse.class_code +
        " - " +
        dataCourse.class_name +
        " - " +
        dataCourse.user.name
      }`,
      text: "Bạn có chắc chắn muốn cho tính tổng điểm sinh viên của môn học này không?",
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Huỷ",
      confirmButtonText: "Xác nhận",
      allowOutsideClick: () => !Swal.isLoading(),
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        let result = await fetch(`/api/gv-final-result`, {
          method: "POST",
          body: JSON.stringify({
            class_code: dataCourse.class_code,
            subject_code: dataCourse.subject_code,
            present,
            token: await getToken({
              template: import.meta.env.VITE_TEMPLATE_GV_CREATOR,
            }),
          }),
        }).then((res) => res.status);

        if (result === 200) {
          setToggle(!toggle);
          // setAfterUpdate(!afterUpdate);
          Swal.fire({
            title: "Tổng kết điểm giảng viên thành công!",
            icon: "success",
          });
        } else
          Swal.fire({
            title: "Tổng kết điểm giảng viên không thành công",
            icon: "error",
          });
      },
    });
    // }
  };
  return (
    <>
      <div className="flex justify-around">
        <p>
          Điểm sinh viên:{" "}
          <span className="font-semibold">
            {dataCourse.student_result
              ? dataCourse.student_result
              : "Chờ tổng hợp..."}
          </span>
        </p>
        <p>
          Điểm giảng viên dự giờ:{" "}
          <span className="font-semibold">
            {dataCourse.teacher_result
              ? dataCourse.teacher_result
              : "Chờ tổng hợp..."}
          </span>
        </p>
        <p>
          Điểm quản lý đào tạo:{" "}
          <span className="font-semibold">
            {dataCourse.qldt_result
              ? dataCourse.qldt_result
              : "Chờ tổng hợp..."}
          </span>
        </p>
      </div>
      <div className="flex justify-evenly">
        <p>
          Điểm tổng:{" "}
          <span className="font-semibold">
            {dataCourse.result_evaluate
              ? dataCourse.result_evaluate
              : "Chờ tổng hợp..."}
          </span>
        </p>
        <p>
          Xếp loại:{" "}
          <span className="font-semibold">
            {dataCourse.xep_loai ? dataCourse.xep_loai : "Chờ tổng hợp..."}
          </span>
        </p>
      </div>
      <div className="flex justify-center gap-[40px]">
        <button className="selfBtn w-f" onClick={() => handleOnClickSV()}>
          Tính điểm sinh viên
        </button>
        <button className="selfBtn w-f" onClick={() => handleOnClickGV()}>
          Tính điểm Giảng viên
        </button>
      </div>
    </>
  );
}
