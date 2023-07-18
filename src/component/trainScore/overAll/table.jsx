import "../../../App.css";
// import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { BiArrowBack } from "react-icons/bi";
import { useAuth } from "@clerk/clerk-react";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import ReactLoading from "react-loading";
import { useState, useEffect, useMemo } from "react";
import { BsFillPersonFill, BsPerson } from "react-icons/bs";
import { RiIncreaseDecreaseLine, RiIncreaseDecreaseFill } from "react-icons/ri";
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
  const batch = queryClient.getQueryData({ queryKey: ["RL_BATCH"] });

  const [expanded, setExpanded] = useState({});

  const detailSV = useQuery({
    queryKey: ["RL_DETAIL_SV", { type: dataPass.data.student_code }],
    queryFn: async () => {
      return await fetch(
        `${import.meta.env.VITE_RL_SUPER_MANAGER_STUDENT_DETAIL}${batch?.id}/${
          dataPass.data.student_code
        }`,
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
            cell: ({ row, getValue }) => (
              <p className={`${row.depth === 0 ? "font-semibold" : ""}`}>
                {getValue()}
              </p>
            ),
          }),
        ],
      }),
    ],
    [tbhk1.data]
  );

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
  });

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
                {dataPass.data.total_self_point ? (
                  <span
                    className={`${
                      dataPass.data.total_monitor_point !==
                        dataPass.data.total_self_point &&
                      !dataPass.data.total_staff_point &&
                      dataPass.data.total_monitor_point
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
                {dataPass.data.total_monitor_point ? (
                  <span
                    className={`${
                      dataPass.data.total_monitor_point !==
                        dataPass.data.total_self_point &&
                      !dataPass.data.total_staff_point &&
                      dataPass.data.total_monitor_point
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
          </div>
          <TableRender table={table} />
        </>
      )}
    </div>
  );
}
