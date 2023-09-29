import { useState } from "react";
import "../../../App.css";
import { AiOutlineRight } from "react-icons/ai";
import { useTransition, animated } from "@react-spring/web";
import useMeasure from "react-use-measure";
import SSubContent from "./ssubContent";
import { BsFillPersonFill, BsPerson } from "react-icons/bs";
import { GrUserManager } from "react-icons/gr";

export default function Index({ data }) {
  // console.log(setRootChecked);
  // const [checkAll, setCheckAll] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [ref, { height }] = useMeasure();
  const transitions = useTransition(toggle, {
    from: { opacity: 0, heigth: 0, overflow: "hidden" },
    // to:{opacity: 1, height: 100 },
    enter: { opacity: 1, height, overflow: "visible" },
    leave: { opacity: 0, height: 0, overflow: "hidden" },
    update: { height },
  });

  return (
    <>
      <div className="flex border-t-[1px] pt-[5px] border-solid border-bordercl gap-[10px]">
        <h3 className="w-[10%]">{data.class_code}</h3>
        <h3 className="w-[50%]">
          Lớp trưởng: {data.canbo ? data.canbo.fullname : ". . ."}
        </h3>
        <div
          className="w-[15%] flex items-center justify-center gap-[10px] tooltip"
          data-tip="Số lượng sinh viên trên tổng sinh viên của lớp đã tự đánh giá!"
        >
          <BsFillPersonFill size={"20px"} />
          <h3>
            {data.enrollment.reduce(
              (total, curr) => (curr.total_self_point ? total + 1 : total),
              0
            )}
            /{data.enrollment.length}
          </h3>
        </div>
        <div
          className="w-[15%] flex items-center justify-center gap-[10px] tooltip"
          data-tip="Số lượng sinh viên trên tổng sinh viên của lớp mà cán bộ lớp đã đánh giá!"
        >
          <BsPerson size={"20px"} />
          <h3>
            {data.enrollment.reduce(
              (total, curr) => (curr.total_monitor_point ? total + 1 : total),
              0
            )}
            /{data.enrollment.length}
          </h3>
        </div>
        <div
          className="w-[15%] flex items-center justify-center gap-[10px] tooltip"
          data-tip="Số lượng sinh viên trên tổng sinh viên của lớp mà quản lý sinh viên đã đánh giá!"
        >
          <GrUserManager size={"20px"} />
          <h3>
            {data.enrollment.reduce(
              (total, curr) => (curr.total_staff_point ? total + 1 : total),
              0
            )}
            /{data.enrollment.length}
          </h3>
        </div>

        {/* <h3 className="w-[15%]">
          Cán bộ:{" "}
          {data.enrollment.reduce(
            (total, curr) => (curr.total_monitor_point ? total + 1 : total),
            0
          )}
          /{data.enrollment.length}
        </h3>
        <h3 className="w-[15%]">
          QLSV:{" "}
          {data.enrollment.reduce(
            (total, curr) => (curr.total_staff_point ? total + 1 : total),
            0
          )}
          /{data.enrollment.length}
        </h3> */}
        <div className="w-[5%] flex justify-center">
          <AiOutlineRight
            size={"20px"}
            className={`${
              toggle ? `rotate-90` : ""
            } transition-all duration-200 self-center  cursor-pointer`}
            onClick={() => setToggle((pre) => !pre)}
          />
        </div>
      </div>
      <div>
        {transitions(
          (style, toggle) =>
            toggle && (
              <animated.div style={style}>
                <div
                  className="flex gap-[20px] justify-between flex-col p-[10px]"
                  ref={ref}
                >
                  <SSubContent data={data} />
                </div>
              </animated.div>
            )
        )}
      </div>
    </>
  );
}
