// import React from 'react'
import { useEffect, useLayoutEffect, useState } from "react";
import "../../../App.css";
import { useAuth } from "@clerk/clerk-react";
import Content from "./content";
import ReactLoading from "react-loading";
import { CSVLink } from "react-csv";
import Swal from "sweetalert2";

function compare(a, b) {
  // if ( a.class_name < b.class_name ){
  //   return -1;
  // }
  // if ( a.class_name > b.class_name ){
  //   return 1;
  // }
  // return 0;
  return a.class_name.localeCompare(b.class_name);
}

export default function Index() {
  const { getToken } = useAuth();
  const [present, setPresent] = useState(null);
  const [course, setCourse] = useState(null);
  const [afterUpdate, setAfterUpdate] = useState(false);
  const [csv, setCsv] = useState([]);

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
              template: import.meta.env.VITE_TEMPLATE_GV_CREATOR,
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

  var csvData = [
    [
      "Mã môn học",
      "Tên môn học",
      "Mã lớp",
      "Mã giáo viên",
      "Tên giáo viên",
      "Học kỳ",
      "Năm học",
      "Điểm SV",
      "Điểm GV",
      "Điểm QLDT",
      "Điểm tổng kết",
      "Xếp loại",
    ],
  ];

  return (
    <div className="wrap">
      <div className="flex justify-center">
        <h2 className="text-primary">Tổng kết điểm môn học</h2>
      </div>

      {course === "empty" ? (
        <div className="flex justify-center">
          <h3>Hiện tại chưa có môn học trong kỳ được duyệt đánh giá</h3>
        </div>
      ) : course ? (
        <>
          <div className="flex justify-end">
            <CSVLink
              asyncOnClick={true}
              data={csv}
              className="btn"
              filename={`${new Date().toDateString()}-TongKetKhaoSat.csv`}
              onClick={() => {
                let data = course.filter((item) => item.result_evaluate);
                if (data.length > 0) {
                  data.forEach((element) => {
                    csvData.push([
                      element.subject_code,
                      element.class_name,
                      element.class_code,
                      element.teacher_code,
                      element.user.name,
                      element.hocky,
                      element.namhoc,
                      element.student_result,
                      element.teacher_result,
                      element.qldt_result,
                      element.result_evaluate,
                      element.xep_loai,
                    ]);
                  });
                  setCsv(csvData);
                } else {
                  Swal.fire({
                    title: "Hiện tại chưa có môn học nào có kết quả tổng kết",
                    icon: "info",
                    timer: 2000,
                  });
                  return false;
                }
              }}
            >
              Xuất CSV
            </CSVLink>
          </div>
          {course.map((item, index) => {
            return (
              <div className="flex flex-col" key={index}>
                <Content
                  data={item}
                  present={present}
                  afterUpdate={afterUpdate}
                  setAfterUpdate={setAfterUpdate}
                />
              </div>
            );
          })}
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
