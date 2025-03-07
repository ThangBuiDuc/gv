import "../../../App.css";
// import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { BiArrowBack } from "react-icons/bi";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useQueryClient } from "@tanstack/react-query";
import ReactLoading from "react-loading";
import { useState, useEffect, useMemo } from "react";
import { BsFillPersonFill, BsPerson } from "react-icons/bs";
import { RiIncreaseDecreaseLine, RiIncreaseDecreaseFill } from "react-icons/ri";
import Swal from "sweetalert2";
import {
  createColumnHelper,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
  //   Table,
  flexRender,
  //   ExpandedState,
} from "@tanstack/react-table";

const columnHelper = createColumnHelper();

function TableRender({ table }) {
  return (
    <div className="border border-solid rounded-[5px] border-[#0083c2]">
      <table className="w-full border-separate">
        <thead className="bg-[#c6e0c4]">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  colSpan={header.colSpan}
                  className="border-solid border border-[#0083c2]"
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
              style={{
                backgroundColor: " rgb(0, 131, 194, 0.03)",
                paddingLeft: "5px",
                lineHeight: "40px",
              }}
            >
              {row.getVisibleCells().map((cell, index) => (
                <td
                  key={cell.id}
                  className={`pl-[5px] ${index !== 0 && "text-center"}`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Index({ dataPass, setDataPass }) {
  const [data, setData] = useState(null);
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const { user } = useUser();

  const [expanded, setExpanded] = useState({});

  const batch = queryClient.getQueryData({ queryKey: ["RL_BATCH"] });

  const detailSV = useQuery({
    queryKey: ["RL_DETAIL_SV", { type: dataPass.data.student_code }],
    queryFn: async () => {
      return await fetch(
        `${import.meta.env.VITE_RL_STUDENT_DETAIL}${user.publicMetadata.magv}/${
          batch?.id
        }/${dataPass.data.student_code}`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${await getToken({
              template: import.meta.env.VITE_TEMPLATE_MANAGERMENT,
            })}`,
          },
        }
      )
        .then((res) => res.json())
        .then((res) => res.result[0]);
    },
  });

  const tbhk1 = useQuery({
    queryKey: ["tbhk1", { type: dataPass.data.student_code }],
    queryFn: async () => {
      return await fetch(
        `${import.meta.env.VITE_RL_EDU_TBHK}${dataPass.data.student_code}/${
          batch?.term
        }/${batch?.school_year}`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${await getToken({
              template: import.meta.env.VITE_TEMPLATE_RL_EDU,
            })}`,
          },
        }
      )
        .then((res) => res.json())
        .then((res) => res.result[0]);
    },
  });

  useEffect(() => {
    if (detailSV.data)
      setData(
        detailSV.data?.enrollment[0].group_point
          .map((item) => {
            let object = Object.assign({}, item);
            delete object.group_question;
            let question = item.group_question.question
              .map((item) => {
                return {
                  id: item.id,
                  name: item.detail_question.name,
                  max_point: item.detail_question.max_point,
                  position: item.detail_question.position,
                  self_point: item.question_point[0].point,
                  monitor_point: null,
                  staff_point: null,
                };
              })
              .sort((a, b) => a.position - b.position);

            return {
              self_point: question.every(
                (item) => typeof item.self_point === "number"
              )
                ? question.reduce((total, curr) => total + curr.self_point, 0)
                : null,
              ...object,
              ...item.group_question,
              question,
            };
          })
          .sort((a, b) => a.position - b.position)
      );
  }, [detailSV.data]);

  const EditableCell = ({ getValue, row, table, column }) => {
    const [value, setValue] = useState(
      typeof getValue() === "number" ? getValue() : ""
    );
    useEffect(() => {
      if (getValue()) setValue(getValue());
    }, [getValue()]);

    // console.log(row);

    const onBlur = () => {
      table.options.meta?.updateData(row.index, value);
    };
    return row.depth === 0 && column.id === "staff_point" ? (
      // <div className="flex justify-center h-full w-full">
      <input
        className="input input-bordered w-[90%] h-[90%] input-info font-semibold leading-[24px] text-[16px]"
        type="number"
        value={value}
        onWheel={(e) => e.target.blur()}
        onChange={(e) => {
          const re = /^[0-9\b]+$/;
          let number = parseInt(e.target.value, 10);
          // if value is not blank, then test the regex

          if (number === "" || re.test(number)) {
            number < 0
              ? setValue(0)
              : number > row.original.max_point
              ? setValue(0)
              : setValue(number);
          }
        }}
        onKeyDown={(e) => {
          if (e.key !== "Backspace" && (e.key < "0" || e.key > "9")) {
            e.preventDefault();
          }
        }}
        onBlur={onBlur}
      />
    ) : (
      // </div>
      <p>{getValue()}</p>
    );
  };

  const columns = useMemo(
    () => [
      columnHelper.group({
        id: "noidung",
        columns: [
          columnHelper.accessor("name", {
            header: "Nội dung đánh giá",
            cell: ({ row, getValue }) => {
              return (
                <div
                  style={{
                    // Since rows are flattened by default,
                    // we can use the row.depth property
                    // and paddingLeft to visually indicate the depth
                    // of the row
                    paddingLeft: `${row.depth * 2}rem`,
                  }}
                  className={`${row.depth === 0 ? "font-semibold" : ""}`}
                >
                  {row.getCanExpand() && (
                    <button
                      className="mr-[10px] ml-[10px]"
                      onClick={row.getToggleExpandedHandler()}
                    >
                      {row.getIsExpanded() ? "-" : "+"}
                    </button>
                  )}
                  {row.parentId === "0" && row.original.position === 2 ? (
                    <>
                      <div className="flex">
                        <p>
                          {getValue()}
                          {tbhk1.data ? (
                            <span style={{ fontWeight: "bold" }}>
                              &nbsp;---&nbsp;{tbhk1.data.diem4}
                            </span>
                          ) : (
                            ". . ."
                          )}
                        </p>
                      </div>
                      <ul className="list-disc ">
                        <li className="ml-[20px]">
                          Có điểm trung bình chung học tập từ 3.6 trở lên =&gt;
                          05 điểm
                        </li>
                        <li className="ml-[20px]">
                          Có điểm trung bình chung học tập từ 3.2 đến 3.59 =&gt;
                          04 điểm
                        </li>
                        <li className="ml-[20px]">
                          Có điểm trung bình chung học tập từ 2.5 đến 3.19 =&gt;
                          03 điểm
                        </li>
                        <li className="ml-[20px]">
                          Có điểm trung bình chung học tập từ 2.0 đến 3.49 =&gt;
                          02 điểm
                        </li>
                        <li className="ml-[20px]">
                          Có điểm trung bình chung học tập dưới 2.0 =&gt; 0 điểm
                        </li>
                      </ul>
                    </>
                  ) : (
                    getValue()
                  )}
                </div>
              );
            },
          }),

          columnHelper.accessor("max_point", {
            header: "Điểm tối đa",
            cell: ({ getValue }) => <p>{getValue()}</p>,
          }),
        ],
      }),

      columnHelper.group({
        header: "Điểm",
        columns: [
          columnHelper.accessor("self_point", {
            header: "Tự đánh giá",
            cell: ({ row, getValue }) => (
              <p className={`${row.depth === 0 ? "font-semibold" : ""}`}>
                {getValue()}
              </p>
            ),
          }),
          columnHelper.accessor("monitor_point", {
            header: "Điểm cán bộ lớp",
            cell: ({ row, getValue }) => (
              <p className={`${row.depth === 0 ? "font-semibold" : ""}`}>
                {getValue()}
              </p>
            ),
          }),
          columnHelper.accessor("staff_point", {
            header: "Điểm QLSV",
            cell:
              typeof dataPass.data.total_staff_point === "number"
                ? ({ row, getValue }) => (
                    <p className={`${row.depth === 0 ? "font-semibold" : ""}`}>
                      {getValue()}
                    </p>
                  )
                : EditableCell,
          }),
        ],
      }),
    ],
    [tbhk1.data]
  );

  const mutation = useMutation({
    mutationFn: async () => {
      return await fetch(import.meta.env.VITE_REN_LUYEN_UPDATE_STAFF, {
        method: "PUT",
        headers: {
          authorization: `Bearer ${await getToken({
            template: import.meta.env.VITE_TEMPLATE_MANAGERMENT,
          })}`,
        },
        body: JSON.stringify({
          updates: data.map((item) => {
            return {
              _set: {
                staff_point: item.staff_point,
                updated_at: new Date(),
              },
              where: {
                student_code: {
                  _eq: dataPass.data.student_code,
                },
                batch_id: {
                  _eq: batch?.id,
                },
                group_id: {
                  _eq: item.id,
                },
              },
            };
          }),
        }),
      })
        .then((res) => res.json())
        .then((res) => res.result);
    },
    onSuccess: (data) => {
      if (data.some((item) => item.affected_rows !== 1)) {
        Swal.fire({
          title: "Đã có lỗi xảy ra!",
          text: "Vui lòng liên hệ quản trị mạng để khắc phục sự cố",
          icon: "error",
        });
      } else {
        setDataPass((pre) => ({ toggle: !pre.toggle, data: null }));
        queryClient.invalidateQueries({ queryKey: ["rlclasses"] });
        Swal.fire({
          title: `Đánh giá cho sinh viên ${dataPass.data.sv.fullname} thành công!`,
          icon: "success",
        });
        // queryClient.removeQueries({ queryKey: ["RL_CLASSES"] });
        // queryClient.refetchQueries({
        //   queryKey: ["RL_CLASSES"],
        // });
        // return queryClient.invalidateQueries({
        //   queryKey: ["RL_CLASSES", data],
        // });
      }
    },
  });
  // console.log(dataPass);

  const handleOnclick = () => {
    // console.log(data);
    // console.log(batch);
    if (data.some((item) => item.staff_point === null)) {
      Swal.fire({
        title: "Chưa trả lời hết nhóm các câu hỏi!",
        text: "Vui lòng đánh giá điểm cho từng nhóm câu hỏi",
        icon: "warning",
      });
    } else {
      Swal.fire({
        title: "Hoàn thành đánh giá!",
        html: `<p>
            Bạn có chắc chắn muốn hoàn thành quá trình đánh giá cho sinh viên <span style="font-weight:600;">${dataPass.data.sv.fullname}</span> không?
          </p>`,
        icon: "question",
        showCancelButton: true,
        showCloseButton: true,
        confirmButtonText: "Xác nhận",
        cancelButtonText: "Huỷ bỏ",
        showLoaderOnConfirm: () => !Swal.isLoading(),
        preConfirm: async () => {
          await mutation.mutateAsync();
        },

        // if (result.some((item) => item.affected_rows !== 1)) {
        //   Swal.fire({
        //     title: "Đã có lỗi xảy ra!",
        //     text: "Vui lòng liên hệ quản trị mạng để khắc phục sự cố",
        //     icon: "error",
        //   });
        // } else {
        //   Swal.fire({
        //     title: "Đánh giá thành công!",
        //     icon: "success",
        //   });
        //   queryClient.invalidateQueries({
        //     queryKey: ["RL_CLASSES"],
        //   });
        // }
        //},
      });
    }
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      expanded,
    },
    getExpandedRowModel: getExpandedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    onExpandedChange: setExpanded,
    getSubRows: (row) => row.question,
    meta: {
      updateData: (index, value) => {
        // console.log(index, original, value);
        setData((pre) => {
          return pre.map((item, i) => {
            // console.log(i, index, i == index);
            if (i == index) {
              return {
                ...item,
                staff_point: value,
              };
            } else return item;
          });
        });
        // console.log(rowIndex, columnId, value);
        // setData((old) =>
        //   old.map((row, index) => {
        //     if (index === rowIndex) {
        //       return {
        //         ...old[rowIndex],
        //         [columnId]: value,
        //       };
        //     }
        //     return row;
        //   })
        // );
      },
    },
  });

  // console.log(data);

  if (detailSV.isLoading && detailSV.isFetching) {
    return (
      <div className="flex flex-col">
        <BiArrowBack
          className="cursor-pointer"
          size={"40"}
          onClick={() =>
            setDataPass((pre) => ({ ...pre, toggle: !pre.toggle }))
          }
        />
        <ReactLoading
          type="spin"
          color="#0083C2"
          width={"25px"}
          height={"25px"}
          className="self-center"
        />
      </div>
    );
  }

  // console.log(dataPass);

  return (
    <div className="flex flex-col gap-[10px]">
      <BiArrowBack
        size={"40"}
        className="cursor-pointer"
        onClick={() => setDataPass((pre) => ({ ...pre, toggle: !pre.toggle }))}
      />
      {/* <h4 className="text-center">
        Đánh giá sinh viên: <span>{dataPass.data.sv.fullname}</span>
      </h4>
      <p>
        Điểm sinh viên tự đánh giá:{" "}
        <span className="font-semibold">
          {dataPass.data.total_self_point
            ? dataPass.data.total_self_point
            : "..."}
        </span>
      </p>
      <p>
        Điểm cán bộ lớp đánh giá:{" "}
        <span className="font-semibold">
          {dataPass.data.total_monitor_point
            ? dataPass.data.total_monitor_point
            : "..."}
        </span>
      </p>
      <p>
        Điểm trừ:{" "}
        <span className="font-semibold">
          {dataPass.data.total_sub_point
            ? dataPass.data.total_sub_point
            : "..."}
        </span>
      </p>
      <p>
        Điểm cộng:{" "}
        <span className="font-semibold">
          {dataPass.data.total_add_point
            ? dataPass.data.total_add_point
            : "..."}
        </span>
      </p> */}
      {data && (
        <>
          <div className="flex justify-evenly items-center gap-[30px] p-2">
            <h3>{dataPass.data.sv.fullname}</h3>
            <div
              className=" flex items-center justify-center gap-[10px] tooltip"
              data-tip="Điểm tự đánh giá của sinh viên"
            >
              <BsFillPersonFill size={"20px"} />
              <h3>
                {typeof dataPass.data.total_self_point === "number" ? (
                  <span
                    className={`${
                      dataPass.data.total_monitor_point !==
                        dataPass.data.total_self_point &&
                      typeof dataPass.data.total_staff_point !== "number" &&
                      typeof dataPass.data.total_monitor_point === "number"
                        ? "text-red-600"
                        : ""
                    }`}
                  >
                    {dataPass.data.total_self_point}
                  </span>
                ) : (
                  ". . ."
                )}
              </h3>
            </div>

            <div
              className=" flex items-center justify-center gap-[10px] tooltip"
              data-tip="Điểm đánh giá của cán bộ lớp cho sinh viên"
            >
              <BsPerson size={"20px"} />
              <h3>
                {typeof dataPass.data.total_monitor_point === "number" ? (
                  <span
                    className={`${
                      dataPass.data.total_monitor_point !==
                        dataPass.data.total_self_point &&
                      typeof dataPass.data.total_staff_point !== "number" &&
                      typeof dataPass.data.total_monitor_point === "number"
                        ? "text-red-600"
                        : ""
                    }`}
                  >
                    {dataPass.data.total_monitor_point}
                  </span>
                ) : (
                  ". . ."
                )}
              </h3>
            </div>

            <div
              className=" flex items-center justify-center gap-[10px] tooltip"
              data-tip="Điểm trừ theo sự kiện của sinh viên"
            >
              <RiIncreaseDecreaseLine size={"20px"} />
              <h3>{dataPass.data.total_sub_point}</h3>
            </div>

            <div
              className="flex items-center justify-center gap-[10px] tooltip"
              data-tip="Điểm cộng theo sự kiện của sinh viên"
            >
              <RiIncreaseDecreaseFill size={"20px"} />
              <h3>{dataPass.data.total_add_point}</h3>
            </div>
            <button
              className={`${
                data.every((item) => typeof item.self_point === "number")
                  ? "selfBtn"
                  : "disableBtn"
              } w-fit`}
              disabled={
                data.every((item) => typeof item.self_point === "number")
                  ? false
                  : true
              }
              onClick={() =>
                setData((pre) =>
                  pre.map((item) => ({ ...item, staff_point: item.self_point }))
                )
              }
            >
              Đổ điểm sinh viên
            </button>
            <button
              className={`${
                data.every((item) => typeof item.monitor_point === "number")
                  ? "selfBtn"
                  : "disableBtn"
              } w-fit`}
              disabled={
                data.every((item) => typeof item.monitor_point === "number")
                  ? false
                  : true
              }
              onClick={() =>
                setData((pre) =>
                  pre.map((item) => ({
                    ...item,
                    staff_point: item.monitor_point,
                  }))
                )
              }
            >
              Đổ điểm Cán bộ lớp
            </button>
          </div>
          <TableRender table={table} />
          {/* {data.} */}
          <button
            className="selfBtn w-fit cursor-pointer self-center"
            onClick={() => handleOnclick()}
          >
            Hoàn Thành
          </button>
        </>
      )}
    </div>
  );
}
