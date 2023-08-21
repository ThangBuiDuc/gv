import { useAuth } from "@clerk/clerk-react";
import { Fragment, useEffect, useState } from "react";
import ReactLoading from "react-loading";
import "../../../App.css";
import { useQuery } from "@tanstack/react-query";
import Content from "./content";
import * as Excel from "exceljs";
import { saveAs } from "file-saver";
import moment from "moment";
import convertToRoman from "./convertToRoman";

moment.locale("vi");

export default function Index() {
  const { getToken } = useAuth();
  const [data, setData] = useState(null);

  const batch = useQuery({
    queryKey: ["RL_BATCH"],
    queryFn: async () => {
      return await fetch(import.meta.env.VITE_RL_BATCH)
        .then((res) => res.json())
        .then((res) => (res?.result.length > 0 ? res?.result[0] : null));
    },
  });

  const role = useQuery({
    queryKey: ["RL_ROLE"],
    queryFn: async () => {
      return await fetch(`${import.meta.env.VITE_RL_ROLE}/${batch.data?.id}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${await getToken({
            template: import.meta.env.VITE_TEMPLATE_SUPER_MANAGERMENT,
          })}`,
        },
      })
        .then((res) => res.json())
        .then((res) => (res.result[0] ? res.result[0] : null));
    },
    enabled: batch.data !== null && batch.data !== undefined,
  });

  const preData = useQuery({
    queryKey: ["rlclasses"],
    queryFn: async () => {
      return await fetch(
        `${import.meta.env.VITE_RL_SUPER_MANAGER_CLASSES}${batch.data?.id}`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${await getToken({
              template: import.meta.env.VITE_TEMPLATE_SUPER_MANAGERMENT,
            })}`,
          },
        }
      )
        .then((res) => res.json())
        .then((res) =>
          res.result.map((item) => ({
            ...item,
            checkedAll: false,
            enrollment: item.enrollment.map((el) => ({
              ...el,
              checked: false,
            })),
          }))
        );
    },
    enabled:
      batch.data !== null &&
      batch.data !== undefined &&
      role.data?.role_id == import.meta.env.VITE_ROLE_RL_SUPER_MANAGERMENT,
  });

  useEffect(() => {
    if (preData.data) setData(preData.data);
  }, [preData.data]);

  if (role.isFetching && role.isLoading) {
    return (
      <div className="wrap">
        <div className="flex justify-center">
          <h2 className="text-primary">Tổng hợp rèn luyện</h2>
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

  const handleOnClick = async () => {
    const workbook = new Excel.Workbook();
    data
      .sort((a, b) => a.class_code.localeCompare(b.class_code))
      .forEach((item) => {
        let sheet = workbook.addWorksheet(item.class_code);
        sheet.addRow([
          "TRƯỜNG ĐẠI HỌC QUẢN LÝ VÀ CÔNG NGHỆ HẢI PHÒNG",
          "",
          "",
          "",
          "",
          "",
          "",
          "CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM",
          "",
          "",
          "",
          "",
          "",
        ]);
        sheet.addRow([
          "PHÒNG ĐÀO TẠO - QLKH",
          "",
          "",
          "",
          "",
          "",
          "",
          "Độc lập - Tự do - Hạnh phúc",
          "",
          "",
          "",
          "",
          "",
        ]);
        sheet.addRow([
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          `Hải Phòng, ngày ${moment().date()} tháng ${
            moment().month() + 1
          } năm ${moment().year()}`,
          "",
          "",
          "",
          "",
          "",
        ]);
        sheet.addRow([]);
        sheet.addRow([
          "BẢN ĐÁNH GIÁ KẾT QUẢ RÈN LUYỆN CỦA SINH VIÊN",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ]);
        sheet.addRow([
          `Lớp ${item.class_code} - Học kỳ: ${convertToRoman(
            batch.data.term
          )} - Năm học ${batch.data.school_year}`,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ]);
        sheet.addRow([
          "STT",
          "MSV",
          "HỌ VÀ TÊN",
          "",
          "NGÀY SINH",
          "NỘI DUNG ĐÁNH GIÁ",
          "",
          "",
          "",
          "",
          `ĐIỂM HK ${convertToRoman(batch.data.term)}`,
          "XẾP LOẠI",
          "GHI CHÚ",
        ]);
        sheet.addRow([
          "",
          "",
          "",
          "",
          "",
          "Ý thức học tập",
          "Ý thức chấp hành nội quy",
          "Ý thức tham gia hoạt động",
          "Ý thức quan hệ cộng đồng",
          "Ý thức tham gia cán bộ lớp, Đoàn",
          "",
          "",
          "",
        ]);

        sheet.mergeCells("A1:F1");
        sheet.mergeCells("H1:M1");
        sheet.mergeCells("A2:F2");
        sheet.mergeCells("H2:M2");
        sheet.mergeCells("H3:M3");
        sheet.mergeCells("A5:M5");
        sheet.mergeCells("A6:M6");
        sheet.mergeCells("A7:A8");
        sheet.mergeCells("B7:B8");
        sheet.mergeCells("C7:D8");
        sheet.mergeCells("E7:E8");
        sheet.mergeCells("F7:J7");
        sheet.mergeCells("K7:K8");
        sheet.mergeCells("L7:L8");
        sheet.mergeCells("M7:M8");

        item.enrollment.forEach((el, index) => {
          let group_point = el.group_point.sort(
            (a, b) => a.gr_question.position - b.gr_question.position
          );
          sheet.addRow([
            index + 1,
            el.student_code,
            el.sv.hodem,
            el.sv.ten,
            el.sv.ngaysinh.split("T")[0].split("-").reverse().join("/"),
            group_point[0].staff_point,
            group_point[1].staff_point,
            group_point[2].staff_point,
            group_point[3].staff_point,
            group_point[4].staff_point,
            el.total_staff_point,
            el.staff_classification,
          ]);
        });

        // csv.forEach((item, index) => {
        //   sheet.addRow([
        //     index + 1,
        //     item.class_code,
        //     item.subject_code,
        //     item.so_tc,
        //     item.class_name,
        //     item.name,
        //     item.khoa,
        //     item.student_result,
        //     item.count_sv_resonded,
        //     item.total_student,
        //     item.teacher_result,
        //     item.count_gv_resonded,
        //     item.total_teacher,
        //     item.qldt_result,
        //     item.result_evaluate,
        //     item.xep_loai,
        //   ]);
        // });

        sheet.getRow(1).alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        sheet.getRow(1).font = {
          bold: true,
        };
        sheet.getRow(2).alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        sheet.getRow(2).font = {
          bold: true,
        };
        sheet.getRow(5).alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        sheet.getRow(5).font = {
          bold: true,
        };
        sheet.getRow(6).alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        sheet.getRow(6).font = {
          bold: true,
        };
        sheet.getRow(7).alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        sheet.getRow(7).font = {
          bold: true,
        };
        sheet.getRow(8).alignment = {
          vertical: "middle",
          horizontal: "center",
          wrapText: true,
        };
        sheet.getRow(8).font = {
          bold: true,
        };
        sheet.getCell("H3").alignment = {
          vertical: "middle",
          horizontal: "right",
        };
        sheet.getCell("H3").font = {
          italic: true,
        };

        // moment.locale("vi");
      });

    const buf = await workbook.xlsx.writeBuffer();

    saveAs(
      new Blob([buf]),
      `BaoCao_TongHop_RL_HK${batch.data.term}_${
        batch.data.school_year
      }_${moment().date()}-${moment().month()}-${moment().year()}.xlsx`
    );
  };

  if (batch.isFetching && batch.isLoading) {
    return (
      <div className="wrap">
        <div className="flex justify-center">
          <h2 className="text-primary">Tổng hợp rèn luyện</h2>
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

  if (
    role.data === null ||
    role.data?.role_id != import.meta.env.VITE_ROLE_RL_SUPER_MANAGERMENT
  ) {
    return (
      <div className="wrap">
        <div className="flex justify-center">
          <h2 className="text-primary">Tổng hợp rèn luyện</h2>
        </div>
        <div className="flex justify-center">
          <h3>Tài khoản không có quyền thực hiện chức năng này!</h3>
        </div>
      </div>
    );
  }

  if (preData.isFetching && preData.isLoading) {
    return (
      <div className="wrap">
        <div className="flex justify-center">
          <h2 className="text-primary">Tổng hợp rèn luyện</h2>
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

  // if (
  //   role.data?.role_id === undefined ||
  //   batch.data?.length <= 0 ||
  //   preData?.length <= 0
  // ) {
  //   return (
  //     <div className="wrap">
  //       <div className="flex justify-center">
  //         <h2 className="text-primary">Tổng hợp rèn luyện</h2>
  //       </div>
  //       <div className="flex justify-center">
  //         <h3>Đã có lỗi xảy ra, vui lòng tải lại trang!</h3>
  //       </div>
  //     </div>
  //   );
  // }

  // console.log(data);
  // console.log(preData.isRefetching);

  return (
    <div className="wrap">
      <div className="flex justify-center">
        <h2 className="text-primary">Tổng hợp rèn luyện</h2>
      </div>
      {data && (
        <>
          <div className="flex justify-end">
            {preData.isRefetching ? (
              <ReactLoading
                type="spin"
                color="#0083C2"
                width={"20px"}
                height={"20px"}
                className="self-center"
              />
            ) : (
              <button className="selfBtn w-fit" onClick={handleOnClick}>
                Xuất Excel
              </button>
            )}
          </div>
          {data
            .sort((a, b) => a.class_code.localeCompare(b.class_code))
            .map((item, index) => {
              return (
                <Fragment key={index}>
                  <Content data={item} />
                </Fragment>
              );
            })}
        </>
      )}
    </div>
  );
}
