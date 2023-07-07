import { useState } from "react";
import "../../../App.css";
import Table from "./table";
import { setRootChecked } from "./index";
import { useContext } from "react";
import { BsFillPersonFill, BsPerson } from "react-icons/bs";
import { GrUserManager } from "react-icons/gr";
import { RiIncreaseDecreaseLine, RiIncreaseDecreaseFill } from "react-icons/ri";
import { ImTrophy } from "react-icons/im";
import ReactLoading from "react-loading";

export default function Index({ data, rootIndex }) {
  const { setRoot, isRefetch } = useContext(setRootChecked);
  const [dataPass, setDataPass] = useState({ toggle: false, data: null });

  const handleOnClick = (item) => {
    setDataPass((pre) => ({ toggle: !pre.toggle, data: item }));
  };

  return (
    <>
      {dataPass.toggle ? (
        <Table dataPass={dataPass} setDataPass={setDataPass} />
      ) : (
        <>
          {data.enrollment.some(
            (item) => item.total_monitor_point && !item.total_staff_point
          ) ? (
            <div
              className="tooltip w-fit tooltip-right flex items-center"
              data-tip="Chọn tất cả điểm cán bộ lớp sang QLSV"
            >
              <input
                type="checkbox"
                checked={data.checkedAll}
                onChange={() =>
                  setRoot((pre) =>
                    pre.map((item, index) =>
                      index === rootIndex
                        ? {
                            ...item,
                            checkedAll: item.checkedAll ? false : true,
                            enrollment: item.enrollment.map((el) =>
                              !el.total_monitor_point || el.total_staff_point
                                ? el
                                : {
                                    ...el,
                                    checked: item.checkedAll ? false : true,
                                  }
                            ),
                          }
                        : item
                    )
                  )
                }
                className="toggle toggle-info"
              />
            </div>
          ) : (
            <input type="checkbox" disabled className="toggle toggle-info" />
          )}
          {data.enrollment.map((item, index) => {
            return (
              <div key={index} className="flex items-center">
                {item.total_staff_point || !item.total_monitor_point ? (
                  <input
                    type="checkbox"
                    checked={item.checked}
                    // onChange={() => setCheckAll((pre) => !pre)}
                    disabled
                    className="toggle mr-[5px]"
                  />
                ) : (
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={
                      () =>
                        data.enrollment
                          .filter((el) => el.total_monitor_point)
                          .every((el) => el.checked === true)
                          ? setRoot((pre) =>
                              pre.map((el, i) =>
                                rootIndex === i
                                  ? {
                                      ...el,
                                      checkedAll: false,
                                      enrollment: el.enrollment.map(
                                        (subEl, subI) =>
                                          subI === index
                                            ? {
                                                ...subEl,
                                                checked: !subEl.checked,
                                              }
                                            : subEl
                                      ),
                                    }
                                  : el
                              )
                            )
                          : data.enrollment
                              .filter(
                                (el) => el.student_code !== item.student_code
                              )
                              .filter((el) => el.total_monitor_point)
                              .every((el) => el.checked === true)
                          ? setRoot((pre) =>
                              pre.map((el, i) =>
                                rootIndex === i
                                  ? {
                                      ...el,
                                      checkedAll: true,
                                      enrollment: el.enrollment.map(
                                        (subEl, subI) =>
                                          subI === index
                                            ? {
                                                ...subEl,
                                                checked: !subEl.checked,
                                              }
                                            : subEl
                                      ),
                                    }
                                  : el
                              )
                            )
                          : setRoot((pre) =>
                              pre.map((el, i) =>
                                rootIndex === i
                                  ? {
                                      ...el,
                                      // checkedAll: true,
                                      enrollment: el.enrollment.map(
                                        (subEl, subI) =>
                                          subI === index
                                            ? {
                                                ...subEl,
                                                checked: !subEl.checked,
                                              }
                                            : subEl
                                      ),
                                    }
                                  : el
                              )
                            )
                      // data
                      //   .filter((el) => el.student_code !== item.student_code)
                      //   .filter((el) => !el.total_monitor_point)
                      //   .some((el) => !el.checked)
                      //   ? setRoot((pre) =>
                      //       pre.map((el, i) =>
                      //         rootIndex === i
                      //           ? {
                      //               ...el,
                      //               checkedAll: false,
                      //               enrollment: el.enrollment.map((subEl, subI) =>
                      //                 subI === index
                      //                   ? { ...subEl, checked: !subEl.checked }
                      //                   : subEl
                      //               ),
                      //             }
                      //           : el
                      //       )
                      //     )
                      //   : setRoot((pre) =>
                      //       pre.map((el, i) =>
                      //         rootIndex === i
                      //           ? {
                      //               ...el,
                      //               checkedAll: true,
                      //               enrollment: el.enrollment.map((subEl, subI) =>
                      //                 subI === index
                      //                   ? { ...subEl, checked: !subEl.checked }
                      //                   : subEl
                      //               ),
                      //             }
                      //           : el
                      //       )
                      //     )
                    }
                    className="toggle toggle-info mr-[5px]"
                  />
                )}

                <h3 className="w-[25%]">{item.sv.fullname}</h3>
                <div
                  className="w-[10%] flex items-center justify-center gap-[10px] tooltip"
                  data-tip="Điểm tự đánh giá của sinh viên"
                >
                  <BsFillPersonFill size={"20px"} />
                  <h3>
                    {item.total_self_point ? (
                      <span
                        className={`${
                          item.total_monitor_point !== item.total_self_point &&
                          !item.total_staff_point &&
                          item.total_monitor_point
                            ? "text-red-600"
                            : ""
                        }`}
                      >
                        {item.total_self_point}
                      </span>
                    ) : (
                      ". . ."
                    )}
                  </h3>
                </div>

                <div
                  className="w-[10%] flex items-center justify-center gap-[10px] tooltip"
                  data-tip="Điểm đánh giá của cán bộ lớp cho sinh viên"
                >
                  <BsPerson size={"20px"} />
                  <h3>
                    {item.total_monitor_point ? (
                      <span
                        className={`${
                          item.total_monitor_point !== item.total_self_point &&
                          !item.total_staff_point &&
                          item.total_monitor_point
                            ? "text-red-600"
                            : ""
                        }`}
                      >
                        {item.total_monitor_point}
                      </span>
                    ) : (
                      ". . ."
                    )}
                  </h3>
                </div>

                <div
                  className="w-[10%] flex items-center justify-center gap-[10px] tooltip"
                  data-tip="Điểm đánh giá của quản lý sinh viên cho sinh viên"
                >
                  <GrUserManager size={"20px"} />
                  <h3>
                    {item.total_staff_point ? (
                      <span>{item.total_staff_point}</span>
                    ) : (
                      ". . ."
                    )}
                  </h3>
                </div>

                <div
                  className="w-[10%] flex items-center justify-center gap-[10px] tooltip"
                  data-tip="Điểm trừ theo sự kiện của sinh viên"
                >
                  <RiIncreaseDecreaseLine size={"20px"} />
                  <h3>{item.total_sub_point}</h3>
                </div>

                <div
                  className="w-[10%] flex items-center justify-center gap-[10px] tooltip"
                  data-tip="Điểm cộng theo sự kiện của sinh viên"
                >
                  <RiIncreaseDecreaseFill size={"20px"} />
                  <h3>{item.total_add_point}</h3>
                </div>

                <div
                  className="w-[10%] flex items-center justify-center gap-[10px] tooltip"
                  data-tip="Điểm rèn luyện cuối cùng của sinh viên"
                >
                  <ImTrophy size={"20px"} />
                  <h3>{item.total_accepted_point}</h3>
                </div>

                {isRefetch ? (
                  <div className="w-[5%] flex justify-center items-center">
                    <ReactLoading
                      type="spin"
                      color="#0083C2"
                      width={"20px"}
                      height={"20px"}
                      className="self-center"
                    />
                  </div>
                ) : (
                  <div className="w-[5%]">
                    {!item.total_staff_point ? (
                      <button
                        className="selfBtn w-fit"
                        onClick={() => handleOnClick(item)}
                      >
                        Đánh giá
                      </button>
                    ) : (
                      <button
                        disabled
                        className="disableBtn w-fit cursor-not-allowed"
                      >
                        Đánh giá
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}
    </>
  );
}
