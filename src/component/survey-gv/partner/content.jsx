// import React from 'react'
import { useState } from "react";
import "../../../App.css";
import SubContent from "./subContent";

export default function Index({ data, present, afterUpdate, setAfterUpdate }) {
  const [toggle, setToggle] = useState(false);
  const [dataSent, setDataSent] = useState();

  const handleOnclick = (
    subject_code,
    class_code,
    class_name,
    teacher_name
  ) => {
    setDataSent({
      subject_code,
      class_code,
      present,
      class_name,
      teacher_name,
    });
    setToggle(!toggle);
  };
  return (
    <div className="gap-[20px] flex flex-col">
      {toggle ? (
        <SubContent
          toggle={toggle}
          setToggle={setToggle}
          afterUpdate={afterUpdate}
          setAfterUpdate={setAfterUpdate}
          dataSent={dataSent}
        />
      ) : (
        <>
          <h3 style={{ textAlign: "center", margin: 0, padding: 0 }}>
            Danh sách các lớp môn học đánh giá trong kỳ
          </h3>
          {data.map((item, index) => {
            return (
              <div
                key={index}
                className="flex border-[1px] boder-solid border-bordercl rounded-[10px] p-[10px] justify-around items-center"
              >
                {/* <div style={{ display: "flex" , justifyContent : 'space-between' }}> */}
                <p className="p-[5px] w-[25%]">{item.class_name}</p>
                <p className="p-[5px] w-[25%] text-center">
                  {item.teacher_name}
                </p>
                <p
                  className={`font-semibold ${
                    item.respond_result ? "text-green-600" : "text-red-600"
                  } p-[5px] w-[25%] text-center`}
                >
                  {item.respond_result ? "Đã đánh giá!" : "Chưa đánh giá!"}
                </p>
                {item.respond_result ? (
                  <p
                    className={`font-semibold ${
                      item.respond_result ? "text-green-600" : "text-red-600"
                    } p-[5px] w-[25%] text-center`}
                  >
                    {item.respond_result}
                  </p>
                ) : (
                  <div className="w-[25%] flex justify-center">
                    <button
                      className="btn h-fit"
                      onClick={() => {
                        handleOnclick(
                          item.subject_code,
                          item.class_code,
                          item.class_name,
                          item.teacher_name
                        );
                      }}
                    >
                      Đánh giá
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
