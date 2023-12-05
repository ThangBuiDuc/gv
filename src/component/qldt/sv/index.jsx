// // import React from 'react'
// import { useState } from "react";
import "../../../App.css";
import { useAuth } from "@clerk/clerk-react";
import Content from "./content";
import ReactLoading from "react-loading";
import { useQuery } from "@tanstack/react-query";
import { BsPatchQuestion } from "react-icons/bs";
// import Swal from "sweetalert2";

// function compare(a, b) {
//   return a.class_name.localeCompare(b.class_name);
// }

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
        .then((res) => (res?.result.length > 0 ? res?.result[0] : null));
    },
  });

  const present = useQuery({
    queryKey: ["getPresent_CTGD"],
    queryFn: async () => {
      return await fetch(`${import.meta.env.VITE_PRESENT_API}`)
        .then((res) => res.json())
        .then((res) => (res?.hientai.length > 0 ? res?.hientai[0] : null));
    },
    enabled:
      role.data !== null &&
      role.data !== undefined &&
      role.data?.role_id == import.meta.env.VITE_ROLE_QLDT,
  });

  // var condition =
  //   typeof present?.data === "object" &&
  //   role.data?.role_id == import.meta.env.VITE_ROLE_QLDT;

  const data = useQuery({
    queryKey: ["getCourse_qldt_sv"],
    queryFn: async () => {
      return await fetch(
        `${import.meta.env.VITE_QLDT_COURSE}${present.data?.manamhoc}/${
          present.data?.hocky
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
      present.data !== null &&
      present.data !== undefined &&
      role.data?.role_id == import.meta.env.VITE_ROLE_QLDT,
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
  if (role.isLoading && role.isFetching) {
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

  if (role.data?.role_id != import.meta.env.VITE_ROLE_QLDT) {
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
    (present.isLoading && present.isFetching) ||
    (data.isLoading && data.isFetching)
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
    <div className="wrap relative">
      <a
        href="https://drive.google.com/drive/folders/1Uw6kd0xNxBeBfMfrM3lvGIgCqOsl786G"
        target="_blank"
        rel="noopener noreferrer"
        className="flex gap-[5px] absolute right-[10px] underline"
      >
        <BsPatchQuestion size={22} />
        Hướng dẫn sử dụng
      </a>
      <div className="flex justify-center">
        <h2 className="text-primary">Duyệt tư cách sinh viên</h2>
      </div>
      <div className="flex justify-center gap-[30px]">
        <p className="font-semibold">Học kỳ: {present?.data.hocky}</p>
        <p className="font-semibold">Năm học: {present?.data.manamhoc}</p>
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
