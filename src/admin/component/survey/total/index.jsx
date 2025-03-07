// import React from 'react'
// import { useEffect, useState } from "react";
import "../../../../App.css";
import { useAuth } from "@clerk/clerk-react";
import { SlCalculator } from "react-icons/sl";
// import { useUser } from "@clerk/clerk-react";
import Content from "./content";
import ReactLoading from "react-loading";
import { useQuery } from "@tanstack/react-query";
import * as Excel from "exceljs";
import { saveAs } from "file-saver";
import moment from "moment";
import excel from "../../../../assets/exportExcelIcon.png";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";

function compare(a, b) {
  return a.class_name.localeCompare(b.class_name);
}

function alphabetically(ascending) {
  return function (a, b) {
    // equal items sort equally
    if (a.result_evaluate === b.result_evaluate) {
      return 0;
    }

    // nulls sort after anything else
    if (a.result_evaluate === null) {
      return 1;
    }
    if (b.result_evaluate === null) {
      return -1;
    }

    // otherwise, if we're ascending, lowest sorts first
    if (ascending) {
      return a.result_evaluate < b.result_evaluate ? -1 : 1;
    }

    // if descending, highest sorts first
    return a.result_evaluate < b.result_evaluate ? 1 : -1;
  };
}

export default function Index() {
  // const { user } = useUser();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
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

  const present = useQuery({
    queryKey: ["getPresent_CTGD"],
    queryFn: async () => {
      return await fetch(`${import.meta.env.VITE_PRESENT_API}`)
        .then((res) => res.json())
        .then((res) => res.hientai[0]);
    },
    enabled:
      role.data?.role_id == import.meta.env.VITE_ROLE_ADMIN ||
      role.data?.role_id == import.meta.env.VITE_ROLE_HCTH,
  });

  const csv = useQuery({
    queryKey: ["TOTAL_CSV_CTGD"],
    queryFn: async () => {
      return await fetch(`${import.meta.env.VITE_OVERALL_SURVEY}`, {
        method: "POST",
        body: JSON.stringify({
          hk: present.data?.hocky,
          nam: present.data?.manamhoc,
          order_by: [{ result_evaluate: "desc_nulls_last" }],
        }),
        headers: {
          authorization: `Bearer ${await getToken({
            template: import.meta.env.VITE_TEMPLATE_GV_CREATOR,
          })}`,
        },
      })
        .then((res) => res.json())
        .then((res) => res.result);
    },
    enabled:
      (role.data?.role_id == import.meta.env.VITE_ROLE_ADMIN ||
        role.data?.role_id == import.meta.env.VITE_ROLE_HCTH) &&
      present.data !== undefined &&
      present.data !== null,
  });

  const csv1 = useQuery({
    queryKey: ["TOTAL_CSV1_CTGD"],
    queryFn: async () => {
      return await fetch(`${import.meta.env.VITE_OVERALL_SURVEY}`, {
        method: "POST",
        body: JSON.stringify({
          hk: present.data?.hocky,
          nam: present.data?.manamhoc,
          order_by: [{ khoa: "asc", result_evaluate: "desc_nulls_last" }],
        }),
        headers: {
          authorization: `Bearer ${await getToken({
            template: import.meta.env.VITE_TEMPLATE_GV_CREATOR,
          })}`,
        },
      })
        .then((res) => res.json())
        .then((res) => res.result);
    },
    enabled:
      (role.data?.role_id == import.meta.env.VITE_ROLE_ADMIN ||
        role.data?.role_id == import.meta.env.VITE_ROLE_HCTH) &&
      present.data !== undefined &&
      present.data !== null,
  });

  const caculate = useQuery({
    queryKey: ["TOTAL_CACULATE_CTGD"],
    queryFn: async () => {
      return await fetch(
        `${import.meta.env.VITE_SURVEY_CACULATE}${present.data?.hocky}/${
          present.data?.manamhoc
        }`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${await getToken({
              template: import.meta.env.VITE_TEMPLATE_GV_CREATOR,
            })}`,
          },
        }
      ).then((res) => res.json());
    },
    enabled:
      (role.data?.role_id == import.meta.env.VITE_ROLE_ADMIN ||
        role.data?.role_id == import.meta.env.VITE_ROLE_HCTH) &&
      present.data !== undefined &&
      present.data !== null,
  });

  const camthi = useQuery({
    queryKey: ["TOTAL_CAMTHI_CTGD"],
    queryFn: async () => {
      return await fetch(
        `${import.meta.env.VITE_EDUMNG_DS_CAM_THI}${present.data?.hocky}/${
          present.data?.manamhoc
        }`,
        {
          headers: {
            authorization: `Bearer ${await getToken({
              template: import.meta.env.VITE_TEMPLATE_EDU_CTGD,
            })}`,
          },
        }
      )
        .then((res) => res.json())
        .then((res) => res.result);
    },
    enabled:
      (role.data?.role_id == import.meta.env.VITE_ROLE_ADMIN ||
        role.data?.role_id == import.meta.env.VITE_ROLE_HCTH) &&
      present.data !== undefined &&
      present.data !== null,
  });

  // useEffect(() => {
  //   let callApi = async () => {
  //     fetch(
  //       `${import.meta.env.VITE_QLDT_COURSE}${present.data?.manamhoc}/${
  //         present.data?.hocky
  //       }`,
  //       {
  //         method: "GET",
  //         headers: {
  //           authorization: `Bearer ${await getToken({
  //             template: import.meta.env.VITE_TEMPLATE_GV_CREATOR,
  //           })}`,
  //         },
  //       }
  //     )
  //       .then((res) => res.json())
  //       .then((res) => {
  //         if (res.result.length > 0) setCourse(res.result.sort(compare));
  //         else setCourse("empty");
  //       });

  // await fetch(`${import.meta.env.VITE_OVERALL_SURVEY}`, {
  //   method: "POST",
  //   body: JSON.stringify({
  //     hk: present.data?.hocky,
  //     nam: present.data?.manamhoc,
  //     order_by: [{ result_evaluate: "desc_nulls_last" }],
  //   }),
  //   headers: {
  //     authorization: `Bearer ${await getToken({
  //       template: import.meta.env.VITE_TEMPLATE_GV_CREATOR,
  //     })}`,
  //   },
  // })
  //   .then((res) => res.json())
  //   .then((res) => {
  //     if (res.result.length > 0) {
  //       setCsv(
  //         res.result.map((item, index) => {
  //           item.stt = index + 1;
  //           return item;
  //         })
  //       );
  //     }
  //   });

  // await fetch(`${import.meta.env.VITE_OVERALL_SURVEY}`, {
  //   method: "POST",
  //   body: JSON.stringify({
  //     hk: present.data?.hocky,
  //     nam: present.data?.manamhoc,
  //     order_by: [{ khoa: "asc", result_evaluate: "desc_nulls_last" }],
  //   }),
  //   headers: {
  //     authorization: `Bearer ${await getToken({
  //       template: import.meta.env.VITE_TEMPLATE_GV_CREATOR,
  //     })}`,
  //   },
  // })
  //   .then((res) => res.json())
  //   .then((res) => {
  //     if (res.result.length > 0) {
  //       setCsv1(
  //         res.result.map((item, index) => {
  //           item.stt = index + 1;
  //           return item;
  //         })
  //       );
  //     }
  //   });

  // await fetch(
  //   `${import.meta.env.VITE_SURVEY_CACULATE}${present.data?.hocky}/${
  //     present.data?.manamhoc
  //   }`,
  //   {
  //     method: "GET",
  //     headers: {
  //       authorization: `Bearer ${await getToken({
  //         template: import.meta.env.VITE_TEMPLATE_GV_CREATOR,
  //       })}`,
  //     },
  //   }
  // )
  //   .then((res) => res.json())
  //   .then((res) => {
  //     if (res) {
  //       setCaculate(res);
  //     }
  //   });

  // await fetch(
  //   `${import.meta.env.VITE_EDUMNG_DS_CAM_THI}${present.data?.hocky}/${
  //     present.data?.manamhoc
  //   }`,
  //   {
  //     headers: {
  //       authorization: `Bearer ${await getToken({
  //         template: import.meta.env.VITE_TEMPLATE_EDU_CTGD,
  //       })}`,
  //     },
  //   }
  // )
  //   .then((res) => res.json())
  //   .then((res) => {
  //     if (res.result.length > 0) {
  //       setCamthi(res.result);
  //     }
  //   });
  //   };
  //   if (present.data?.length > 0) callApi();
  // }, [present.data, afterUpdate]);

  if (role.isLoading && role.isFetching) {
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

  if (role.isError || present.isError || csv.isError) {
    return (
      <div className="wrapAdmin">
        <div className="flex justify-center">
          <h2 className="text-primary">Tổng kết điểm môn học</h2>
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
          <h2 className="text-primary">Tổng kết điểm môn học</h2>
        </div>
        <div className="flex justify-center">
          <h3>Tài khoản hiện tại không có quyền thực hiện chức năng này!</h3>
        </div>
      </div>
    );
  }

  if (
    (present.isLoading && present.isFetching) ||
    (csv.isLoading && csv.isFetching)
  ) {
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

  if (csv?.data?.length === 0) {
    <div className="wrapAdmin">
      <div className="flex justify-center">
        <h2 className="text-primary">Tổng kết điểm môn học</h2>
      </div>
      <div className="flex justify-center">
        <h3>Hiện tại chưa có dữ liệu!</h3>
      </div>
    </div>;
  }

  const handleDownXLSX = async (csv, key) => {
    // console.log(camthi);
    csv = csv.map((item) => {
      let rawCamthi = camthi.data.filter(
        (el) =>
          el.mamonhoc === item.subject_code &&
          item.class_code.includes(el.malop)
      );
      if (rawCamthi) {
        return {
          ...item,
          duthi:
            item.total_student -
            rawCamthi.reduce((total, curr) => total + curr.camthi, 0),
        };
      } else {
        return { ...item, duthi: item.total_student };
      }
    });
    let set = csv.reduce((final, item) => {
      if (final.some((el) => el === item.khoa)) return final;
      else return [...final, item.khoa];
    }, []);

    let split = set.map((item) => {
      return csv.filter((el) => el.khoa === item);
    });

    let group = split.map((item) => {
      let firstReward = Math.round(
        item.filter((item) => item.result_evaluate).length * 0.3
      );
      let secoundReward = Math.round(
        item.filter((item) => item.result_evaluate).length * 0.7
      );
      return item.map((el, index) => {
        if (el.result_evaluate === null) return { ...el, group: 5 };
        if (index < firstReward && el.xep_loai === "A") {
          return { ...el, group: 1 };
        }
        if (
          index >= firstReward &&
          el.xep_loai === "A" &&
          el.result_evaluate === item[firstReward - 1].result_evaluate &&
          el.student_result === item[firstReward - 1].student_result &&
          el.teacher_result === item[firstReward - 1].teacher_result &&
          el.qldt_result === item[firstReward - 1].qldt_result
        ) {
          return { ...el, group: 1 };
        }

        if (
          index < secoundReward &&
          (el.xep_loai === "A" || el.xep_loai === "B")
        ) {
          return { ...el, group: 2 };
        }

        if (
          index >= secoundReward &&
          el.xep_loai === "B" &&
          el.result_evaluate === item[secoundReward - 1].result_evaluate &&
          el.student_result === item[secoundReward - 1].student_result &&
          el.teacher_result === item[secoundReward - 1].teacher_result &&
          el.qldt_result === item[secoundReward - 1].qldt_result
        ) {
          return { ...el, group: 2 };
        }

        if (
          index >= secoundReward &&
          (el.xep_loai === "C" || el.xep_loai === "B" || el.xep_loai === "A")
        ) {
          return { ...el, group: 3 };
        }

        if (el.xep_loai === "C") return { ...el, group: 3 };

        return { ...el, group: 4, index, secoundReward };
      });
    });

    // console.log(group);

    let final = group
      .reduce((final, item) => [...final, ...item], [])
      .map((item) => {
        if (item.group === 1) {
          return {
            ...item,
            mucthuong: 50000,
          };
        }

        if (item.group === 2) {
          return {
            ...item,
            mucthuong: 38000,
          };
        }

        if (item.group === 3) {
          return {
            ...item,
            mucthuong: 15000,
          };
        }

        if (item.group === 4) {
          return {
            ...item,
            mucthuong: 0,
          };
        }
        if (item.group === 5) {
          return {
            ...item,
            mucthuong: "Không xét",
          };
        }
      })
      .map((item) => {
        let hesothuong =
          item.duthi > 20
            ? 1
            : item.duthi >= 14
            ? 0.8
            : item.duthi > 0
            ? 0.5
            : 0;
        let sotiet = parseInt(item.sotc) * 15;
        return {
          ...item,
          hesothuong,
          sotiet,
          tongthuong:
            typeof item.mucthuong === "number"
              ? item.mucthuong * hesothuong * sotiet
              : 0,
        };
      });

    // console.log(group);
    // console.log(final);
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

      if (key === 2) {
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
          "Tiết chuẩn",
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
          "Sĩ số sinh viên được duyện tư cách dự thi",
          "Hệ số thưởng (k)",
          "Xếp loại",
          "Mức thưởng (đồng)",
          "Tiền thưởng công tác giảng dạy",
        ]);

        sheet.addRow([
          "",
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
        sheet.mergeCells("H1:H2");
        sheet.mergeCells("I1:K1");
        sheet.mergeCells("L1:N1");
        sheet.mergeCells("P1:P2");
        sheet.mergeCells("Q1:Q2");
        sheet.mergeCells("R1:R2");
        sheet.mergeCells("S1:S2");
        sheet.mergeCells("T1:T2");
        sheet.mergeCells("U1:U2");

        final.forEach((item, index) => {
          // let hesothuong =
          //   item.duthi > 20
          //     ? 1
          //     : item.duthi >= 14
          //     ? 0.8
          //     : item.duthi > 0
          //     ? 0.5
          //     : 0;
          // let sotiet = parseInt(item.sotc) * 15;
          sheet.addRow([
            index + 1,
            item.class_code,
            item.subject_code,
            item.sotc,
            item.sotiet,
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
            item.duthi,
            item.hesothuong,
            item.xep_loai,
            item.mucthuong,
            item.tongthuong,
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
      }
      if (key === 1) {
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
          "Tiết chuẩn",
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
          "Sĩ số sinh viên được duyện tư cách dự thi",
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
        sheet.mergeCells("H1:H2");
        sheet.mergeCells("I1:K1");
        sheet.mergeCells("L1:N1");
        sheet.mergeCells("P1:P2");
        sheet.mergeCells("Q1:Q2");
        sheet.mergeCells("R1:R2");

        csv.forEach((item, index) => {
          sheet.addRow([
            index + 1,
            item.class_code,
            item.subject_code,
            item.sotc,
            parseInt(item.sotc) * 15,
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
            item.duthi,
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
      }

      if (key === 3) {
        sheet.addRow(["TRƯỜNG ĐẠI HỌC QUẢN LÝ VÀ CÔNG NGHỆ HẢI PHÒNG"]);

        sheet.addRow(["", "", "BẢNG THƯỞNG CÔNG TÁC GIẢNG DẠY"]);
        sheet.addRow(["", "", "Học kỳ .... Năm học ....."]);
        sheet.addRow([""]);
        sheet.addRow([
          "STT",
          "Họ tên giảng viên",
          "Khoa",
          "Tiền thưởng công tác giảng dạy (đồng)",
          "Ký nhận, ghi rõ họ tên",
        ]);

        let allFinal = final.reduce((result, item) => {
          if (result.some((el) => el.teacher_code === item.teacher_code))
            return result;
          else {
            let data = final.reduce(
              (total, el) =>
                el.teacher_code === item.teacher_code
                  ? total + el.tongthuong
                  : total,
              0
            );
            return [
              ...result,
              {
                teacher_code: item.teacher_code,
                khoa: convertKhoa(item.khoa),
                name: item.name,
                tongthuong: data,
              },
            ];
          }
        }, []);

        allFinal.forEach((item, index) => {
          sheet.addRow([index + 1, item.name, item.khoa, item.tongthuong]);
        });

        sheet.addRow(["", "Cộng"]);
        sheet.addRow(["", "", "", "Hải Phòng, ngày ……  tháng …... năm ………."]);
        sheet.addRow(["", "Thủ trưởng", "", "Người lập / người in"]);
      }

      moment.locale("vi");
      const buf = await workbook.xlsx.writeBuffer();

      saveAs(
        new Blob([buf]),
        `${
          key === 2
            ? `BaoCao_KHOA_CTGD_${moment().date()}-${
                moment().month() + 1
              }-${moment().year()}.xlsx`
            : key === 1
            ? `BaoCao_TRUONG_CTGD_${moment().date()}-${
                moment().month() + 1
              }-${moment().year()}.xlsx`
            : key === 3 &&
              `BaoCao_TONGTIEN_CTGD_${moment().date()}-${
                moment().month() + 1
              }-${moment().year()}.xlsx`
        }`
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
  // console.log(caculate.data);
  const caculater = async (level) => {
    Swal.fire({
      title: "Tính điểm sinh viên và giảng viên dự giờ",
      text: "Bạn có chắc chắn muốn tính tổng điểm sinh viên và giảng viên dự giờ cho tất cả lớp môn học không?",
      icon: "question",
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Huỷ bỏ",
      showLoaderOnConfirm: () => !Swal.isLoading(),
      allowOutsideClick: false,
      preConfirm: async () => {
        let updates;
        if (level === 1) {
          updates = caculate.data.gv_sv.map((item) => {
            return {
              _set: {
                student_result: item.total_point_sv,
                teacher_result: item.total_point_gv,
              },
              where: {
                subject_code: { _eq: item.subject_code },
                class_code: { _eq: item.class_code },
                hocky: { _eq: present.data?.hocky },
                namhoc: { _eq: present.data?.manamhoc },
              },
            };
          });
        }

        if (level === 2) {
          updates = caculate.data.sv.map((item) => {
            return {
              _set: {
                student_result: item.total_point_sv,
              },
              where: {
                subject_code: { _eq: item.subject_code },
                class_code: { _eq: item.class_code },
                hocky: { _eq: present.data?.hocky },
                namhoc: { _eq: present.data?.manamhoc },
              },
            };
          });
        }

        if (level === 3) {
          updates = caculate.data.gv.map((item) => {
            return {
              _set: {
                teacher_result: item.total_point_gv,
              },
              where: {
                subject_code: { _eq: item.subject_code },
                class_code: { _eq: item.class_code },
                hocky: { _eq: present.data?.hocky },
                namhoc: { _eq: present.data?.manamhoc },
              },
            };
          });
        }

        return await fetch(import.meta.env.VITE_CTGD_UPDATE_MANY_COURSE, {
          method: "POST",
          headers: {
            authorization: `Bearer ${await getToken({
              template: import.meta.env.VITE_TEMPLATE_GV_CREATOR,
            })}`,
          },
          body: JSON.stringify({
            updates,
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            if (
              res.update_course_many.every((item) => item.affected_rows === 1)
            ) {
              queryClient.invalidateQueries({
                queryKey: ["TOTAL_CSV_CTGD"],
              });
              queryClient.invalidateQueries({
                queryKey: ["TOTAL_CSV1_CTGD"],
              });
              Swal.fire({
                title: "Tính điểm thành công!",
                icon: "success",
              });
            } else {
              Swal.fire({
                title: "Đã có lỗi xảy ra!",
                icon: "error",
              });
            }
          });
      },
    });
  };

  if (csv?.data?.length === 0) {
    return (
      <div className="wrapAdmin">
        <div className="flex justify-center">
          <h2 className="text-primary">Tổng kết điểm môn học</h2>
        </div>
        <div className="flex justify-center gap-[30px]">
          <p className="font-semibold">Học kỳ: {present.data?.hocky}</p>
          <p className="font-semibold">Năm học: {present.data?.manamhoc}</p>
        </div>
        <div className="flex justify-center">
          <h3>Hiện tại chưa có dữ liệu các lớp môn học trong kỳ!</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapAdmin">
      <div className="flex justify-center">
        <h2 className="text-primary">Tổng kết điểm môn học</h2>
      </div>
      <div className="flex justify-center gap-[30px]">
        <p className="font-semibold">Học kỳ: {present.data?.hocky}</p>
        <p className="font-semibold">Năm học: {present.data?.manamhoc}</p>
      </div>
      <>
        <div className="flex justify-end gap-[10px]">
          {!caculate.isFetching && !caculate.isLoading ? (
            <div className="dropdown dropdown-bottom dropdown-end">
              <label tabIndex={0} className="btn">
                <SlCalculator className="w-[25px] h-[25px]" />
                <p className="self-center">Tính điểm</p>
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-fit"
              >
                <li>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      caculater(1);
                    }}
                  >
                    Sinh viên và dự giờ
                  </a>
                </li>
                <li>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      caculater(2);
                    }}
                  >
                    Sinh viên
                  </a>
                </li>
                <li>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      caculater(3);
                    }}
                  >
                    Dự giờ
                  </a>
                </li>
              </ul>
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
          {(!csv.isFetching && !csv.isLoading) ||
          (!csv1.isRefetching && !csv1.isLoading) ||
          csv1.isRefetching ||
          csv.isRefetching ? (
            <div className="dropdown dropdown-bottom dropdown-end">
              <label tabIndex={0} className="btn">
                {" "}
                <img src={excel} className="w-[25px] h-[25px]" />
                <p className="self-center">Xuất Excel</p>
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-fit"
              >
                <li>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      handleDownXLSX(csv1.data.sort(alphabetically(false)), 1);
                    }}
                  >
                    Sắp xếp theo toàn trường
                  </a>
                </li>
                <li>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      handleDownXLSX(csv1.data, 2);
                    }}
                  >
                    Sắp xếp theo khoa
                  </a>
                </li>
                <li>
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      handleDownXLSX(csv1.data, 3);
                    }}
                  >
                    Tổng thưởng
                  </a>
                </li>
              </ul>
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
        {csv.data
          .sort((a, b) => compare(a, b))
          .map((item, index) => {
            return (
              <div className="flex flex-col" key={index}>
                <Content
                  data={item}
                  present={present.data}
                  isRefetching={csv.isRefetching}
                />
              </div>
            );
          })}
      </>
    </div>
  );
}
