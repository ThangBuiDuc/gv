// import React from 'react'
import { useEffect, useLayoutEffect, useState } from "react";
import "../../../App.css";
import { useAuth } from "@clerk/clerk-react";
import Content from "./content";
import ReactLoading from "react-loading";
import { CSVLink } from "react-csv";

const headersCSV = [
  {
    label: "STT",
    key: "stt",
  },
  {
    label: "Lớp môn học",
    key: "class_name",
  },
  {
    label: "Tên giảng viên phụ trách",
    key: "name",
  },
  {
    label: "Điểm trung bình",
    key: "qldt_result",
  },
  {
    label: "Ý kiến riêng",
    key: "",
  },
];

function compare(a, b) {
  return a.user.name.localeCompare(b.user.name);
}

export default function Index() {
  const { getToken } = useAuth();
  const [present, setPresent] = useState(null);
  const [course, setCourse] = useState(null);
  const [search, setSearch] = useState(null);
  const [query, setQuery] = useState("");
  const [afterUpdate, setAfterUpdate] = useState(false);

  useEffect(() => {
    if (query === "") {
      setSearch(course);
    } else {
      setSearch(course.filter((item) => item.user.name.includes(query)));
    }
  }, [query, course]);

  useLayoutEffect(() => {
    let callApi = async () => {
      await fetch(`${import.meta.env.VITE_PRESENT_API}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.hientai) setPresent(res.hientai[0]);
        });
    };

    callApi();
  }, []);

  useEffect(() => {
    let callApi = async () => {
      fetch(
        `${import.meta.env.VITE_QLDT_COURSE}${present.manamhoc}/${
          present.hocky
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
        .then((res) => {
          if (res.result.length > 0) setCourse(res.result.sort(compare));
          else setCourse("empty");
        });
    };
    if (present) callApi();
  }, [present, afterUpdate]);

  return (
    <div className="wrap">
      <div className="flex justify-center">
        <h2 className="text-primary">Thực hiện quy định, quy chế đào tạo</h2>
      </div>
      {course === "empty" ? (
        <div className="flex justify-center">
          <h3>Hiện tại chưa có môn học trong kỳ được duyệt đánh giá</h3>
        </div>
      ) : course ? (
        <>
          <div className="flex justify-end">
            <CSVLink
              data={course.map((item, index) => {
                return {
                  stt: index + 1,
                  class_name: item.class_name,
                  name: item.user.name,
                  qldt_result: item.qldt_result,
                };
              })}
              headers={headersCSV}
              className="btn"
              filename={`${new Date().toDateString()}-qldtGV.csv`}
            >
              Xuất CSV
            </CSVLink>
          </div>
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
                  <Content
                    data={item}
                    setCourse={setCourse}
                    present={present}
                    setAfterUpdate={setAfterUpdate}
                  />
                </div>
              );
            })
          ) : (
            <div className="flex justify-center">
              <h3>Không tìm thấy dữ liệu</h3>
            </div>
          )}
        </>
      ) : (
        <ReactLoading
          type="spin"
          color="#0083C2"
          width={"50px"}
          height={"50px"}
          className="self-center"
        />
      )}
    </div>
  );
}
