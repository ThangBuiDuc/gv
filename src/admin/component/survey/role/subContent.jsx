// import { useState } from "react";
import "../../../../App.css";
// import { AiOutlineRight } from "react-icons/ai";
// import { IconContext } from "react-icons";
// import useMeasure from "react-use-measure";
// import Swal from "sweetalert2";
// import { useAuth } from "@clerk/clerk-react";

export default function Index({ item }) {
  // const handleOnClickRole = () => {
  //   if (selectedOption.value === item.role_id) {
  //     Swal.fire({
  //       title: "Không có thông tin thay đổi để cập nhật!",
  //       icon: "info",
  //     });
  //   } else if (item.role_id === 5 && adminCount === 1) {
  //     Swal.fire({
  //       title: "Hệ thống phải có ít nhất một quản trị!",
  //       icon: "info",
  //     });
  //   } else {
  //     Swal.fire({
  //       title: `Bạn có chắc chắn muốn cập nhật lại quyền cho ${item.name}`,
  //       icon: "question",
  //       showCancelButton: true,
  //       showConfirmButton: true,
  //       confirmButtonText: "Xác nhận",
  //       cancelButtonText: "Huỷ",
  //       showLoaderOnConfirm: true,
  //       allowOutsideClick: () => !Swal.isLoading(),
  //       preConfirm: async () => {
  //         await fetch(import.meta.env.VITE_SURVEY_ROLE_UPDATE, {
  //           method: "PUT",
  //           headers: {
  //             authorization: `Bearer ${await getToken({
  //               template: import.meta.env.VITE_TEMPLATE_GV_CREATOR,
  //             })}`,
  //           },
  //           body: JSON.stringify({
  //             _set: {
  //               role_id: selectedOption.value,
  //               updated_at: new Date(),
  //             },
  //             where: {
  //               code: {
  //                 _eq: item.code,
  //               },
  //             },
  //           }),
  //         })
  //           .then((response) => response.json())
  //           .then((res) => {
  //             if (res.result.affected_rows === 1) {
  //               Swal.fire({
  //                 title: "Cập nhật quyền thành công!",
  //                 icon: "success",
  //               });
  //               setToggle(!toggle);
  //               setData((pre) =>
  //                 pre.map((el) => {
  //                   if (el.code === item.code) {
  //                     (el.role_id = selectedOption.value),
  //                       (el.description = selectedOption.label);
  //                   }
  //                   return el;
  //                 })
  //               );
  //             } else {
  //               setSelectedOption({
  //                 value: item.role_id,
  //                 label: item.description,
  //               });
  //               Swal.fire({
  //                 title: "Cập nhật quyền thất bại!",
  //                 icon: "error",
  //               });
  //             }
  //           })
  //           .catch(() => {
  //             setSelectedOption({
  //               value: item.role_id,
  //               label: item.description,
  //             });
  //             Swal.fire({
  //               title: "Cập nhật quyền thất bại!",
  //               icon: "error",
  //             });
  //           });
  //       },
  //     });
  //   }
  // };

  // const handleOnClickTruongKhoa = () => {
  //   Swal.fire({
  //     title: `Bạn có chắc chắn muốn ${
  //       item.is_truong_khoa ? "loại bỏ quyền" : "thêm quyền"
  //     } trưởng khoa ${item.khoa_gv} cho ${item.name}`,
  //     icon: "question",
  //     showCancelButton: true,
  //     showConfirmButton: true,
  //     confirmButtonText: "Xác nhận",
  //     cancelButtonText: "Huỷ",
  //     showLoaderOnConfirm: true,
  //     allowOutsideClick: () => !Swal.isLoading(),
  //     preConfirm: async () => {
  //       await fetch(import.meta.env.VITE_SURVEY_ROLE_UPDATE, {
  //         method: "PUT",
  //         headers: {
  //           authorization: `Bearer ${await getToken({
  //             template: import.meta.env.VITE_TEMPLATE_GV_CREATOR,
  //           })}`,
  //         },
  //         body: JSON.stringify({
  //           _set: {
  //             is_truong_khoa: item.is_truong_khoa ? false : true,
  //             updated_at: new Date(),
  //           },
  //           where: {
  //             code: {
  //               _eq: item.code,
  //             },
  //           },
  //         }),
  //       })
  //         .then((response) => response.json())
  //         .then((res) => {
  //           if (res.result.affected_rows === 1) {
  //             Swal.fire({
  //               title: "Cập nhật quyền trưởng khoa thành công!",
  //               icon: "success",
  //             });
  //             setToggle(!toggle);
  //             setData((pre) =>
  //               pre.map((el) => {
  //                 if (el.code === item.code) {
  //                   el.is_truong_khoa = item.is_truong_khoa ? false : true;
  //                 }
  //                 return el;
  //               })
  //             );
  //           } else {
  //             setSelectedOption({
  //               value: item.role_id,
  //               label: item.description,
  //             });
  //             Swal.fire({
  //               title: "Cập nhật quyền trưởng khoa thất bại!",
  //               icon: "error",
  //             });
  //           }
  //         })
  //         .catch(() => {
  //           setSelectedOption({
  //             value: item.role_id,
  //             label: item.description,
  //           });
  //           Swal.fire({
  //             title: "Cập nhật quyền trưởng khoa thất bại!",
  //             icon: "error",
  //           });
  //         });
  //     },
  //   });
  // };

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="flex border-t border-bordercl border-solid pt-[10px]">
        <h3 className="w-[30%]">
          {item.ma_hoc_vi === null || item.ma_hoc_vi === "CXD"
            ? ""
            : `${item.ma_hoc_vi}. `}
          {item.name}
        </h3>
        <h3 className="w-[40%]">
          {item.khoa_gv ? item.khoa_gv : "Chưa xác định"}
          {item.is_truong_khoa ? " - Trưởng khoa" : ""}
        </h3>
        <h3 className="w-[20%]">{item.description}</h3>
        <input type="checkbox" value={item.checked} />
      </div>
    </div>
  );
}
