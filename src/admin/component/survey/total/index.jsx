// import React from 'react'
import { useEffect, useState } from "react";
import "../../../../App.css";
import { useAuth } from "@clerk/clerk-react";
import Content from "./content";
import ReactLoading from "react-loading";
import { useQuery } from "@tanstack/react-query";
import { CSVLink } from "react-csv";

const headersCSV = [
  {
    label: "STT",
    key: "stt",
  },
  {
    label: "Mã môn học",
    key: "subject_code",
  },
  {
    label: "Mã lớp môn học",
    key: "class_code",
  },
  {
    label: "Môn học",
    key: "class_name",
  },
  {
    label: "Giảng viên",
    key: "name",
  },
  {
    label: "Khoa",
    key: "khoa",
  },
  {
    label: "Điểm trung bình sinh viên",
    key: "student_result",
  },
  {
    label: "Số lượng sinh viên đã phản hồi",
    key: "count_sv_resonded",
  },
  {
    label: "Tổng số lượng sinh viên của lớp học",
    key: "total_student",
  },
  {
    label: "Điểm trung bình sinh viên dự giờ",
    key: "teacher_result",
  },
  {
    label: "Số lượng giảng viên đã phản hồi",
    key: "count_gv_resonded",
  },
  {
    label: "Tổng số giảng viên được phân công dự giờ",
    key: "total_teacher",
  },
  {
    label: "Điểm quản lý đào tạo",
    key: "qldt_result",
  },
  {
    label: "Tổng điểm",
    key: "result_evaluate",
  },
  {
    label: "Xếp loại",
    key: "xep_loai",
  },
];

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
  const [course, setCourse] = useState(null);
  const [afterUpdate, setAfterUpdate] = useState(false);
  const [csv, setCsv] = useState([]);

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

  const present = useQuery({
    queryKey: ["getPresent_CTGD"],
    queryFn: async () => {
      return await fetch(`${import.meta.env.VITE_PRESENT_API}`)
        .then((res) => res.json())
        .then((res) => res.hientai);
    },
    enabled: role.data?.role_id.toString() === import.meta.env.VITE_ROLE_ADMIN,
  });

  useEffect(() => {
    let callApi = async () => {
      fetch(
        `${import.meta.env.VITE_QLDT_COURSE}${present.data[0]?.manamhoc}/${
          present.data[0]?.hocky
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

      await fetch(
        `${import.meta.env.VITE_OVERALL_SURVEY}${present.data[0]?.manamhoc}/${
          present.data[0]?.hocky
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
          if (res.result.length > 0) {
            setCsv(
              res.result.map((item, index) => {
                item.stt = index + 1;
                return item;
              })
            );
          }
        });
    };
    if (present.data?.length > 0) callApi();
  }, [present.data, afterUpdate]);

  if (role.isLoading || role.isFetching) {
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

  if (role.data.role_id != import.meta.env.VITE_ROLE_ADMIN) {
    return (
      <div className="wrapAdmin">
        <div className="flex justify-center">
          <h2 className="text-primary">Khởi tạo đợt đánh giá</h2>
        </div>
        <div className="flex justify-center">
          <h3>Tài khoản hiện tại không có quyền thực hiện chức năng này!</h3>
        </div>
      </div>
    );
  }

  if (present.isLoading || present.isFetching) {
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

  return (
    <div className="wrapAdmin">
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
            {csv.length > 0 ? (
              <CSVLink
                data={csv}
                headers={headersCSV}
                className="selfBtn"
                filename={`${new Date().toDateString()}-TongKetKhaoSat.csv`}
              >
                Xuất CSV
              </CSVLink>
            ) : (
              <ReactLoading
                type="spin"
                color="#0083C2"
                width={"20px"}
                height={"20px"}
                className="self-center"
              />
            )}
          </div>
          {course.map((item, index) => {
            return (
              <div className="flex flex-col" key={index}>
                <Content
                  data={item}
                  present={present.data[0]}
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
