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

  console.log(data.student_comment);

  return (
    <div className="flex border-t border-bordercl border-solid justify-between p-[10px] flex-col gap-[20px]">
      <div className="lg:flex-row flex-col flex justify-between ">
        <h3
          className={`${
            data.result_evaluate ? "w-full lg:w-[45%]" : "w-full lg:w-[30%]"
          }`}
        >
          {data.class_name}
        </h3>
        {data.result_evaluate ? (
          <>
            <h3 className="w-full lg:w-[20%]">Điểm: {data.result_evaluate}</h3>
            <h3 className="w-full lg:w-[20%]">Xếp loại: {data.xep_loai}</h3>
            <h3 className="text-green-500 w-full lg:w-[25%]">Đã hoàn thành</h3>
          </>
        ) : (
          <h3 className="w-[45%]">Đang tiến hành</h3>
        )}
        <label
          className="flex justify-center cursor-pointer"
          onClick={() => setToggle(!toggle)}
        >
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
              <span className="font-semibold ">Sinh viên: </span>
              {data.student_result
                ? data.student_result + "/5"
                : "Chờ tổng hợp..."}
            </p>
            <p>
              <span className="font-semibold">Dự giờ: </span>
              {data.teacher_result
                ? data.teacher_result + "/10"
                : "Chờ tổng hợp..."}
            </p>
            <p>
              <span className="font-semibold">Quản lý đào tạo: </span>
              {data.qldt_result ? data.qldt_result + "/10" : "Chờ tổng hợp..."}
            </p>
          </div>

          {data.student_comment.length > 0 ? (
            <div className="flex flex-col lg:p-[10px] gap-[5px]">
              <p className="font-semibold">Ý kiến riêng sinh viên:</p>
              <ul className="list-disc ml-[30px]">
                {data.student_comment.map((item, index) => (
                  <li key={index}>{item.comment}</li>
                ))}
              </ul>
            </div>
          ) : (
            <></>
          )}
          {data.teacher_comment.length > 0 ? (
            <div className="flex flex-col lg:p-[10px] gap-[5px]">
              <p className="font-semibold">Ý kiến riêng giảng viên:</p>
              <ul className="list-disc ml-[30px]">
                {data.teacher_comment.map((item, index) => (
                  <li key={index}>{item.comment}</li>
                ))}
              </ul>
            </div>
          ) : (
            <></>
          )}
        </div>
      </animated.div>
    </div>
  );
}
