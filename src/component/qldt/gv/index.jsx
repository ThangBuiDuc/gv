// import React from 'react'
import { useEffect, useState } from "react";
import "../../../App.css";
import { useAuth } from "@clerk/clerk-react";
import Content from "./content";
import ReactLoading from "react-loading";
// import { CSVLink } from "react-csv";
import { useQuery } from "@tanstack/react-query";

// const headersCSV = [
//   {
//     label: "STT",
//     key: "stt",
//   },
//   {
//     label: "Lớp môn học",
//     key: "class_name",
//   },
//   {
//     label: "Tên giảng viên phụ trách",
//     key: "name",
//   },
//   {
//     label: "Điểm trung bình",
//     key: "qldt_result",
//   },
//   {
//     label: "Ý kiến riêng",
//     key: "",
//   },
// ];

function compare(a, b) {
  return a.user.name.localeCompare(b.user.name);
}

export default function Index() {
  const { getToken } = useAuth();
  const [search, setSearch] = useState(null);
  const [query, setQuery] = useState("");

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

  const data = useQuery({
    queryKey: ["getCourse_qldt_gv"],
    queryFn: async () => {
      console.log(present.data);
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
        .then((res) => res.result.sort(compare));
    },
    enabled:
      present.data !== null &&
      present.data !== undefined &&
      role.data?.role_id == import.meta.env.VITE_ROLE_QLDT,
  });

  useEffect(() => {
    if (query === "") {
      setSearch(data.data);
    } else {
      setSearch(data.data.filter((item) => item.user.name.includes(query)));
    }
  }, [query, data.data]);

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
    <div className="wrap">
      <div className="flex justify-center">
        <h2 className="text-primary">Thực hiện quy định, quy chế đào tạo</h2>
      </div>
      {data.data.length <= 0 ? (
        <div className="flex justify-center">
          <h3>Hiện tại chưa có môn học trong kỳ được duyệt đánh giá</h3>
        </div>
      ) : (
        <>
          {/* <div className="flex justify-end">
            <CSVLink
              data={data.data.map((item, index) => {
                return {
                  stt: index + 1,
                  class_name: item.class_name,
                  name: item.user.name,
                  qldt_result: item.qldt_result,
                };
              })}
              headers={headersCSV}
              className="selfBtn"
              filename={`${new Date().toDateString()}-qldtGV.csv`}
            >
              Xuất CSV
            </CSVLink>
          </div> */}
          <div className="flex justify-end">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm kiếm giảng viên"
              className="w-[250px] border-[1px] border-solid border-bordercl overflow-hidden p-[5px] rounded-[5px]"
            />
          </div>
          {search?.length > 0 ? (
            search.map((item, index) => {
              return (
                <div className="flex flex-col" key={index}>
                  <Content data={item} isRefetch={data.isRefetching} />
                </div>
              );
            })
          ) : (
            <div className="flex justify-center">
              <h3>Không tìm thấy dữ liệu</h3>
            </div>
          )}
        </>
      )}
    </div>
  );
}
