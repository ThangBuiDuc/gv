// // import React from 'react'
// import { useState } from "react";
import "../../../App.css";
import { useAuth } from "@clerk/clerk-react";
import Content from "./content";
import ReactLoading from "react-loading";
import { useQuery } from "@tanstack/react-query";
// import Swal from "sweetalert2";

// function compare(a, b) {
//   return a.class_name.localeCompare(b.class_name);
// }

export default function Index() {
  const { getToken } = useAuth();

  // const handleOnClick = () => {
  //   Swal.fire({
  //     title: "Duyệt tư cách phản hồi sinh viên",
  //     text: "Quá trình này sẽ duyệt tư cách sinh viên cho tất cả lớp môn học. Hãy chắc chắn tất cả lớp môn học đã kết thúc!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     showConfirmButton: true,
  //     confirmButtonText: "Xác nhận",
  //     cancelButtonText: "Huỷ",
  //     showLoaderOnConfirm: true,
  //     allowOutsideClick: () => !Swal.isLoading(),
  //     preConfirm: async () => {
  //       let data = await fetch(`${import.meta.env.VITE_QLGD_QLDT_SV_ALL}`, {
  //         method: "GET",
  //         headers: {
  //           authorization: `Bearer ${await getToken({
  //             template: import.meta.env.VITE_TEMPLATE_QLGD_CREATOR,
  //           })}`,
  //         },
  //       })
  //         .then((res) => res.json())
  //         .then((res) => res.result);

  //       // console.log(data);
  //       let updates;

  //       if (data.length > 0) {
  //         updates = data.reduce((total, curr) => {
  //           let item = {
  //             _set: {
  //               status: curr.tinhhinh
  //                 ? curr.tinhhinh > 20
  //                   ? false
  //                   : true
  //                 : true,
  //               updated_at: new Date(),
  //             },
  //             where: {
  //               class_code: {
  //                 _eq: curr.ma_lop,
  //               },
  //               subject_code: {
  //                 _eq: curr.ma_mon_hoc,
  //               },
  //               user_code: {
  //                 _eq: curr.ma_sv,
  //               },
  //               hocky: {
  //                 _eq: present.hocky,
  //               },
  //               namhoc: {
  //                 _eq: present.manamhoc,
  //               },
  //             },
  //           };
  //           return [...total, item];
  //         }, []);

  //         let result = await fetch(
  //           `${import.meta.env.VITE_QLDT_COURSE_RESPOND}`,
  //           {
  //             method: "PUT",
  //             headers: {
  //               authorization: `Bearer ${await getToken({
  //                 template: import.meta.env.VITE_TEMPLATE_GV_QLDT,
  //               })}`,
  //             },
  //             body: JSON.stringify({ updates }),
  //           }
  //         )
  //           .then((res) => res.json())
  //           .then((res) =>
  //             res.result.reduce((total, curr) => {
  //               return [...total, curr.affected_rows];
  //             }, [])
  //           );

  //         if (result.every((item) => item === 1)) {
  //           Swal.fire({
  //             title: "Duyệt tư cách tất cả sinh viên thành công!",
  //             icon: "success",
  //           });
  //         } else {
  //           Swal.fire({
  //             title: "Duyệt thất bại!",
  //             icon: "error",
  //           });
  //         }
  //       } else {
  //         Swal.fire({
  //           title: "Có lỗi xảy ra. Vui lòng thử lại!",
  //           icon: "error",
  //         });
  //       }
  //     },
  //   });
  // };

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
      }).then((res) => res.json());
    },
  });

  const present = useQuery({
    queryKey: ["getPresent_CTGD"],
    queryFn: async () => {
      return await fetch(`${import.meta.env.VITE_PRESENT_API}`)
        .then((res) => res.json())
        .then((res) => res.hientai);
    },
    enabled:
      role.data?.result[0].role_id.toString() ===
      import.meta.env.VITE_ROLE_QLDT,
  });

  // var condition =
  //   typeof present?.data === "object" &&
  //   role.data?.role_id == import.meta.env.VITE_ROLE_QLDT;

  const data = useQuery({
    queryKey: ["getCourse_qldt_sv"],
    queryFn: async () => {
      return await fetch(
        `${import.meta.env.VITE_QLDT_COURSE}${present.data[0]?.manamhoc}/${
          present.data[0]?.hocky
        }`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${await getToken({
              template: import.meta.env.VITE_TEMPLATE_GV_QLDT,
            })}`,
          },
        }
      )
        .then((res) => res.json())
        .then((res) => res.result);
    },
    enabled:
      present.data?.length > 0 &&
      role.data?.result[0].role_id == import.meta.env.VITE_ROLE_QLDT,
  });

  // console.log(present.data);

  // useLayoutEffect(() => {
  //   let callApi = async () => {
  //     await fetch(`${import.meta.env.VITE_PRESENT_API}`)
  //       .then((res) => res.json())
  //       .then((res) => {
  //         if (res.hientai) setPresent(res.hientai[0]);
  //       });
  //   };

  //   callApi();
  // }, []);

  // useEffect(() => {
  //   let callApi = async () => {
  //     fetch(
  //       `${import.meta.env.VITE_QLDT_COURSE}${present.manamhoc}/${
  //         present.hocky
  //       }`,
  //       {
  //         method: "GET",
  //         headers: {
  //           authorization: `Bearer ${await getToken({
  //             template: import.meta.env.VITE_TEMPLATE_GV_QLDT,
  //           })}`,
  //         },
  //       }
  //     )
  //       .then((res) => res.json())
  //       .then((res) => {
  //         if (res.result.length > 0) setCourse(res.result.sort(compare));
  //         else setCourse("empty");
  //       });
  //   };
  //   if (present) callApi();
  // }, [present, afterUpdate]);
  if (role.isLoading || role.isFetching) {
    return (
      <div className="wrap">
        <div className="flex justify-center">
          <h2 className="text-primary">Duyệt tư cách sinh viên</h2>
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

  if (role.data?.result[0].role_id != import.meta.env.VITE_ROLE_QLDT) {
    return (
      <div className="wrap">
        <div className="flex justify-center">
          <h2 className="text-primary">Duyệt tư cách sinh viên</h2>
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
    data.isLoading ||
    data.isFetching
  ) {
    return (
      <div className="wrap">
        <div className="flex justify-center">
          <h2 className="text-primary">Duyệt tư cách sinh viên</h2>
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
    <div className="wrap">
      <div className="flex justify-center">
        <h2 className="text-primary">Duyệt tư cách sinh viên</h2>
      </div>
      <>
        {/* <button
            className="btn w-fit self-end"
            onClick={() => handleOnClick()}
          >
            Duyệt tất cả
          </button> */}
        {data.data.map((item, index) => {
          return (
            <div className="flex flex-col" key={index}>
              <Content data={item} />
            </div>
          );
        })}
      </>
    </div>
  );
}
