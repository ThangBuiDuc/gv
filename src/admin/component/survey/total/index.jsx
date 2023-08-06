// import React from 'react'
import { useEffect, useState } from "react";
import "../../../../App.css";
import { useAuth } from "@clerk/clerk-react";
// import { useUser } from "@clerk/clerk-react";
import Content from "./content";
import ReactLoading from "react-loading";
import { useQuery } from "@tanstack/react-query";
import * as Excel from "exceljs";
import { saveAs } from "file-saver";
import moment from "moment";

function compare(a, b) {
  return a.class_name.localeCompare(b.class_name);
}

export default function Index() {
  // const { user } = useUser();
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
    enabled: role.data?.role_id == import.meta.env.VITE_ROLE_ADMIN,
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
          method: "POST",
          body: JSON.stringify({ result_evaluate: "desc_nulls_last" }),
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
          <h2 className="text-primary">Tổng kết điểm môn học</h2>
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
          <h2 className="text-primary">Tổng kết điểm môn học</h2>
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
          <h2 className="text-primary">Tổng kết điểm môn học</h2>
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

  const handleDownXLSX = async () => {
    const convertKhoa = (item) => {
      switch (item) {
        case "Công nghệ thông tin":
          return "CNTT";
        case "Cơ sở cơ bản":
          return "CSCB";
        case "Giáo viên thỉnh giảng":
          return "TG";
        case "Ngoại ngữ":
          return "NN";
        case "Quản trị kinh doanh":
          return "QTKD";
        case "Môi trường":
          return "MT";
        case "Việt Nam học":
          return "VH";
        case "Điện - Điện tử":
          return "DT";
        case "Phòng ban trung tâm tổ":
          return "PBTT";
        case "Xây dựng":
          return "XD";
        case "Ban thanh tra":
          return "TT";
        default:
          return "CXD";
      }
    };
    const workbook = new Excel.Workbook();
    try {
      const sheet = workbook.addWorksheet("CTGD");
      sheet.views = [
        {
          state: "frozen",
          xSplit: 0,
          ySplit: 2,
        },
      ];
      sheet.addRow([
        "STT",
        "Mã lớp",
        "Mã môn",
        "Số tín chỉ",
        "Tên môn",
        "Giảng viên",
        "Khoa",
        "Phản hồi của sinh viên",
        "",
        "",
        "Phản hồi của đồng nghiệp",
        "",
        "",
        "Quản lý đào tạo",
        "Tổng điểm = 0.8 x d1 + 0.4 x d2 + 0.2 x d3",
        "Xếp loại",
      ]);

      sheet.addRow([
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "Điểm TB (d1)",
        "Đã phản hồi",
        "Sĩ số",
        "Điểm TB (d2)",
        "Đã phản hồi",
        "Số giảng viên được phân công dự giờ",
        "Điểm TB (d3)",
      ]);

      sheet.mergeCells("A1:A2");
      sheet.mergeCells("B1:B2");
      sheet.mergeCells("C1:C2");
      sheet.mergeCells("D1:D2");
      sheet.mergeCells("E1:E2");
      sheet.mergeCells("F1:F2");
      sheet.mergeCells("G1:G2");
      sheet.mergeCells("H1:J1");
      sheet.mergeCells("K1:M1");
      sheet.mergeCells("O1:O2");
      sheet.mergeCells("P1:P2");

      csv.forEach((item, index) => {
        sheet.addRow([
          index + 1,
          item.class_code,
          item.subject_code,
          item.so_tc,
          item.class_name,
          item.name,
          convertKhoa(item.khoa),
          item.student_result,
          item.count_sv_resonded,
          item.total_student,
          item.teacher_result,
          item.count_gv_resonded,
          item.total_teacher,
          item.qldt_result,
          item.result_evaluate,
          item.xep_loai,
        ]);
      });

      sheet.getRow(1).alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
      sheet.getRow(2).alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };

      moment.locale("vi");
      const buf = await workbook.xlsx.writeBuffer();

      saveAs(
        new Blob([buf]),
        `BaoCao_CTGD_${moment().date()}-${moment().month()}-${moment().year()}.xlsx`
      );
    } finally {
      workbook.removeWorksheet("CTGD");
    }
    // workbook.xlsx.writeBuffer().then((data) => {
    //   const blob = new Blob([data], {
    //     type: "application/vnd.openxmlformats-officedocument.spreadsheet.sheet",
    //   });
    //   const url = window.URL.createObjectURL(blob);
    //   ref.current.href = url;
    //   ref.current.download = "test.xlsx";
    // });
  };

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
              <div className="flex gap-[20px]">
                <button className="selfBtn" onClick={handleDownXLSX}>
                  Xuất Excel
                </button>
                {/* <PDFExport data={csv} name={user.publicMetadata.name} /> */}
              </div>
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
