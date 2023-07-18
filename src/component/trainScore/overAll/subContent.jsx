import { useState } from "react";
import "../../../App.css";
import Table from "./table";
import { BsFillPersonFill, BsPerson } from "react-icons/bs";
import { GrUserManager } from "react-icons/gr";
import { RiIncreaseDecreaseLine, RiIncreaseDecreaseFill } from "react-icons/ri";
import { ImTrophy } from "react-icons/im";

export default function Index({ data }) {
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
          {data.enrollment
            .sort((a, b) => a.sv.ten.localeCompare(b.sv.ten))
            .map((item, index) => {
              return (
                <div key={index} className="flex items-center">
                  <div
                    className="w-[35%] flex gap-[10px] tooltip "
                    data-tip={`Mã sinh viên ${item.student_code}`}
                  >
                    <h3>{item.sv.fullname}</h3>
                  </div>

                  <div
                    className="w-[10%] flex items-center justify-center gap-[10px] tooltip"
                    data-tip="Điểm tự đánh giá của sinh viên"
                  >
                    <BsFillPersonFill size={"20px"} />
                    <h3>
                      {item.total_self_point ? (
                        <span
                          className={`${
                            item.total_monitor_point !==
                              item.total_self_point &&
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
                            item.total_monitor_point !==
                              item.total_self_point &&
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

                  <div className="w-[5%]">
                    <button
                      className="selfBtn w-fit"
                      onClick={() => handleOnClick(item)}
                    >
                      Chi tiết
                    </button>
                  </div>
                </div>
              );
            })}
        </>
      )}
    </>
  );
}
