// import React from 'react'
// import { useEffect, useState } from "react";
import "../../../../App.css";
import { useAuth } from "@clerk/clerk-react";
// import { SlCalculator } from "react-icons/sl";
// import { useUser } from "@clerk/clerk-react";
import Content from "./content";
import ReactLoading from "react-loading";
import { useQuery } from "@tanstack/react-query";
import Select from "react-select";
import { useState } from "react";
// import * as Excel from "exceljs";
// import { saveAs } from "file-saver";
// import moment from "moment";
// import excel from "../../../../assets/exportExcelIcon.png";
// import Swal from "sweetalert2";
// import { useQueryClient } from "@tanstack/react-query";

// function compare(a, b) {
//   return a.class_name.localeCompare(b.class_name);
// }

export default function Index() {
  const [selected, setSelected] = useState();
  const [action, setAction] = useState();
  // const { user } = useUser();
  const { getToken } = useAuth();
  // const [course, setCourse] = useState(null);
  // const [afterUpdate, setAfterUpdate] = useState(false);
  // const [csv, setCsv] = useState([]);
  // const [csv1, setCsv1] = useState([]);
  // const [camthi, setCamthi] = useState(null);
  // const [caculate, setCaculate] = useState(null);

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

  const listPresent = useQuery({
    queryKey: ["getListPresent_CTGD"],
    queryFn: async () => {
      return await fetch(`${import.meta.env.VITE_LIST_PRESENT_API}`)
        .then((res) => res.json())
        .then((res) => res.batch);
    },
    enabled:
      role.data?.role_id == import.meta.env.VITE_ROLE_ADMIN ||
      role.data?.role_id == import.meta.env.VITE_ROLE_HCTH,
  });

  if (role.isLoading && role.isFetching) {
    return (
      <div className="wrapAdmin">
        <div className="flex justify-center">
          <h2 className="text-primary">Tổng kết </h2>
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

  if (role.isError || listPresent.isError) {
    return (
      <div className="wrapAdmin">
        <div className="flex justify-center">
          <h2 className="text-primary">Tổng kết </h2>
        </div>
        <div className="flex justify-center">
          <h3>Đã có lỗi xảy ra. Vui lòng thử lại!</h3>
        </div>
      </div>
    );
  }

  if (
    role.data.role_id != import.meta.env.VITE_ROLE_ADMIN &&
    role.data.role_id != import.meta.env.VITE_ROLE_HCTH
  ) {
    return (
      <div className="wrapAdmin">
        <div className="flex justify-center">
          <h2 className="text-primary">Tổng kết </h2>
        </div>
        <div className="flex justify-center">
          <h3>Tài khoản hiện tại không có quyền thực hiện chức năng này!</h3>
        </div>
      </div>
    );
  }

  if (listPresent.isLoading && listPresent.isFetching) {
    return (
      <div className="wrapAdmin">
        <div className="flex justify-center">
          <h2 className="text-primary">Tổng kết </h2>
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
        <h2 className="text-primary">Tổng kết </h2>
      </div>
      <div className="flex justify-center items-center gap-[30px]">
        <p className="font-semibold">Lựa chọn học kỳ:</p>
        <Select
          options={listPresent?.data.map((item, index) => ({
            ...item,
            value: index,
            label: `Học kỳ ${item.hocky} - Năm ${item.manamhoc}`,
          }))}
          value={selected}
          onChange={setSelected}
          className="w-[300px]"
          placeholder="Lựa chọn học kỳ cần lọc"
        />
        <button className="selfBtn w-[fit]" onClick={() => setAction(selected)}>
          Tìm
        </button>
      </div>
      <div className="flex gap-[30px] flex-col">
        {action && <Content action={action} />}
      </div>
    </div>
  );
}
