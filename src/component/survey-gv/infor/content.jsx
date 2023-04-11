// import React from 'react'
import { useState } from "react";
import "../../../App.css";
import { AiOutlineRight } from "react-icons/ai";
import useMeasure from "react-use-measure";
import { useSpring, animated } from "react-spring";
import { IconContext } from "react-icons";

export default function Index({ data }) {
  const [toggle, setToggle] = useState(false);
  const [ref, bounds] = useMeasure();
  const spring = useSpring({
    height: toggle ? bounds.height : 0,
    opacity: toggle ? 1 : 0,
    config: {
      duration: 200,
    },
  });

  return (
    <div
      className="flex border-t border-bordercl border-solid justify-between p-[10px] cursor-pointer flex-col gap-[20px]"
      onClick={() => setToggle(!toggle)}
    >
      <div className="lg:flex-row flex-col [&>h3]:w-full flex justify-between ">
        <h3 className={`${data.result_evaluate ? "w-[45%]" : "w-[30%]"}`}>
          {data.class_name}
        </h3>
        {data.result_evaluate ? (
          <>
            <h3 className="w-[20%]">Điểm: {data.result_evaluate}</h3>
            <h3 className="w-[20%]">Xếp loại: {data.xep_loai}</h3>
            <h3 className="text-green-500 w-[25%]">Đã hoàn thành</h3>
          </>
        ) : (
          <h3 className="w-[45%]">Đang tiến hành</h3>
        )}
        <label className="flex justify-center">
          <IconContext.Provider
            value={{
              className: `${
                toggle ? "-rotate-90 lg:rotate-90" : "rotate-90 lg:rotate-0"
              } transition-transform duration-200 cursor-pointer`,
            }}
          >
            <AiOutlineRight size={"20px"} />
          </IconContext.Provider>
        </label>
      </div>
      <animated.div style={spring} className={"overflow-hidden"}>
        <div ref={ref} className="flex flex-col gap-[5px] lg:gap-0">
          <div className="lg:flex-row flex flex-col justify-between lg:p-[10px] gap-[5px]">
            <p>
              <span className="font-semibold">Mã lớp: </span>
              {data.class_code}
            </p>
            <p>
              <span className="font-semibold">Mã môn học: </span>
              {data.subject_code}
            </p>
            <p>
              <span className="font-semibold">Ngày kết thúc: </span>
              {data.end_date.split("-").reverse().join("-")}
            </p>
          </div>
          <div className="lg:flex-row flex flex-col justify-between lg:p-[10px] gap-[5px]">
            <p>
              <span className="font-semibold ">Điểm sinh viên: </span>
              {data.student_result ? data.student_result : "Chờ tổng hợp..."}
            </p>
            <p>
              <span className="font-semibold">Điểm giảng viên: </span>
              {data.teacher_result ? data.teacher_result : "Chờ tổng hợp..."}
            </p>
            <p>
              <span className="font-semibold">Điểm quản lý đào tạo: </span>
              {data.qldt_result ? data.qldt_result : "Chờ tổng hợp..."}
            </p>
          </div>
        </div>
      </animated.div>
    </div>
  );
}
