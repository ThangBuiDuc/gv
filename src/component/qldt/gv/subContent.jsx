// import { useAuth } from "@clerk/clerk-react";
import { useState } from "react";
import "../../../App.css";
// import { useLayoutEffect } from "react";
// import ReactLoading from "react-loading";
// import { useState } from "react";
// import Swal from "sweetalert2";
import useMeasure from "react-use-measure";
import { useTransition, animated } from "@react-spring/web";

import {
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import Swal from "sweetalert2";
import { useAuth } from "@clerk/clerk-react";

const data = [
  {
    content:
      "- Có trên 3 lần vi phạm giờ lên lớp/học kỳ hoặc/và trên 01 lần bỏ dạy không có lý do chính đáng||- Có vi phạm nội quy, quy định, quy chể gây ra hậu quả xấu, làm lãnh đạo nhà trường phải nhắc nhở hoặc tham gia xử lý vụ việc",
    content1:
      "- Có 2 đến 3 lần vi phạm giờ lên lớp/học kỳ hoặc có 01 lần bỏ dạy không có lý do chính đáng||- Có vi phạm nội quy, quy định, quy chế nhưng chưa để lại hậu quả xấu, cá nhân đã tự khắc phục tốt vụ việc",
    content2:
      "- Có 01 lần vi phạm giờ lên lớp||- Cơ bản thực hiện đúng nội quy, quy định, quy chế",
    content3:
      "- Không vi phạm giờ lên lớp||- Thực hiện đúng và đầy đủ nội quy, quy định, quy chế trong thời hạn quy định; không để phát sinh phàn nàn của sinh viên",
    content4:
      "- Không vi phạm giờ lên lớp||- Thực hiện đúng và đầy đủ nội quy, quy định, quy chế trong thời hạn quy định; được nhiều người đánh giá cao",
  },
];
const columns = [
  { header: "Tiêu chí", cell: () => "Thực hiện nội quy, quy định, quy chế" },
  {
    header: "Khung đánh giá",
    columns: [
      {
        accessorKey: "content",
        cell: (cell) => (
          <div className="flex flex-col">
            <span>{cell.getValue().split("||")[0]}</span>
            <span>{cell.getValue().split("||")[1]}</span>
          </div>
        ),
        header: () => "0-2",
      },
      {
        accessorKey: "content1",
        header: () => "2-4",
        cell: (cell) => (
          <div className="flex flex-col">
            <span>{cell.getValue().split("||")[0]}</span>
            <span>{cell.getValue().split("||")[1]}</span>
          </div>
        ),
      },
      {
        accessorKey: "content2",
        header: () => "4-6",
        cell: (cell) => (
          <div className="flex flex-col">
            <span>{cell.getValue().split("||")[0]}</span>
            <span>{cell.getValue().split("||")[1]}</span>
          </div>
        ),
      },
      {
        accessorKey: "content3",
        header: () => "6-8",
        cell: (cell) => (
          <div className="flex flex-col">
            <span>{cell.getValue().split("||")[0]}</span>
            <span>{cell.getValue().split("||")[1]}</span>
          </div>
        ),
      },
      {
        accessorKey: "content4",
        header: () => "8-10",
        cell: (cell) => (
          <div className="flex flex-col">
            <span>{cell.getValue().split("||")[0]}</span>
            <span>{cell.getValue().split("||")[1]}</span>
          </div>
        ),
      },
    ],
  },
];

export default function Index({
  dataCourse,
  present,
  afterUpdate,
  setAfterUpdate,
  toggle,
  setToggle,
}) {
  const [point, setPoint] = useState();
  const [ref, { width }] = useMeasure();
  const { getToken } = useAuth();
  const transitions = useTransition(point, {
    from: { opacity: 0, width: 0, overflow: "hidden" },
    // to:{opacity: 1, height: 100 },
    enter: { opacity: 1, width, overflow: "visible" },
    leave: { opacity: 0, width: 0, overflow: "hidden" },
    update: { width },
  });
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleOnClick = () => {

    if (
      new Date().setHours(0, 0, 0, 0) <
      new Date(dataCourse.end_date).setHours(0, 0, 0, 0)  
    ) {
      Swal.fire({
        title: "Môn học chưa kết thúc",
        text: `Môn học hiện tại chưa qua ngày kết thúc ${dataCourse.end_date}`,
        icon: "warning",
      });
    } else {
      Swal.fire({
        title: `${
          dataCourse.class_code +
          " - " +
          dataCourse.class_name +
          " - " +
          dataCourse.user.name
        }`,
        text: "Bạn có chắc chắn muốn cho điểm của giáo viên môn học này không?",
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: "Huỷ",
        confirmButtonText: "Xác nhận",
        allowOutsideClick: () => !Swal.isLoading(),
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          let _set = {
            qldt_result: point,
            updated_at: new Date(),
          };

          let where = {
            subject_code: {
              _eq: dataCourse.subject_code,
            },
            class_code: {
              _eq: dataCourse.class_code,
            },
            hocky: {
              _eq: present.hocky,
            },
            namhoc: {
              _eq: present.manamhoc,
            },
          };

          let result = await fetch(
            `${import.meta.env.VITE_QLDT_UPDATE_COURSE}`,
            {
              method: "PUT",
              headers: {
                authorization: `Bearer ${await getToken({
                  template: import.meta.env.VITE_TEMPLATE_GV_CREATOR,
                })}`,
              },
              body: JSON.stringify({ _set, where }),
            }
          ).then((res) => res.status);

          // let result1;

          // if (result === 200) {
          //   result1 = await fetch(`/api/gv-final-result`, {
          //     method: "POST",
          //     body: JSON.stringify({
          //       class_code: data.class_code,
          //       subject_code: data.subject_code,
          //       present,
          //       token: await getToken({
          //         template: import.meta.env.VITE_TEMPLATE_GV_CREATOR,
          //       }),
          //     }),
          //   }).then((res) => res.status);
          // }

          if (result === 200) {
            setToggle(!toggle);
            setAfterUpdate(!afterUpdate);
            Swal.fire({
              title: "Cho điểm điểm giáo viên thành công!",
              icon: "success",
            });
          } else
            Swal.fire({
              title: "Cho điểm điểm giáo viên không thành công",
              icon: "error",
            });
        },
      });
    }
  };
  //   console.log(sv)
  return (
    <>
      <div className="p-2">
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="border-bordercl border-[1px] border-solid"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-bordercl border-[1px] border-solid"
              >
                {row.getVisibleCells().map((cell, index) => (
                  <td
                    key={cell.id}
                    className={`${
                      index === 0 ? "w-[10%]" : "w-[18%] align-baseline"
                    } p-[5px] border-bordercl border-[1px] border-solid`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center items-center gap-[5px]">
        <h3>Điểm đánh giá:</h3>
        <input
          type="number"
          step={0.01}
          min={0}
          max={10}
          className="max-w-[10%] border-[1px] border-solid border-bordercl overflow-hidden p-[5px] rounded-[5px]"
          value={point ? point : ""}
          maxLength={5}
          // pattern="[0-9]{4}"
          onChange={(e) =>
            setPoint(
              e.target.value > 10 ? 10 : e.target.value < 0 ? 0 : e.target.value
            )
          }
        ></input>
        {transitions(
          (style, point) =>
            point && (
              <animated.div style={style} className={"ml-[10px]"}>
                <button
                  ref={ref}
                  className="btn text-center whitespace-nowrap"
                  onClick={() => handleOnClick()}
                >
                  Hoàn Thành
                </button>
              </animated.div>
            )
        )}
        {/* {point ? (
          <button className="btn w-fit ml-[10px]">Hoàn Thành</button>
        ) : (
          <></>
        )} */}
      </div>
    </>
  );
}
