import "../../../App.css";
import { AiOutlineRight } from "react-icons/ai";
import { useState } from "react";
// import { useRef } from "react";
// import { useEffect } from "react";

export default function Index({ item, index, checked, setChecked }) {
  // console.log(index)
  const [status, setStatus] = useState(false);
  //   const ref = useRef();
  const handleOnChange = (index) => {
    setChecked(
      checked.map((item, i) => {
        if (i === index) return (item = !item);
        else return item;
      })
    );
  };
  //   useEffect(() => {}, [ref]);
  return (
    <div
      className={`flex flex-col ${
        status ? "border-solid border-[1px] border-bordercl rounded-[10px]" : ""
      }`}
    >
      <div
        className={`flex ${
          status
            ? ""
            : "border-solid border-[1px] border-bordercl rounded-[10px]"
        } p-[20px]  gap-[5%]`}
      >
        <label className="w-[30%]" htmlFor={index + "z"}>
          {item.subject_code}
        </label>
        <label className="w-[30%]" htmlFor={index + "z"}>
          {item.class_code}
        </label>
        <label className="w-[30%]" htmlFor={index + "z"}>
          {item.class_name}
        </label>
        <input
          //   ref={ref}
          type="checkbox"
          id={index + "y"}
          className="peer hidden"
        />
        <label
          htmlFor={index + "y"}
          className="peer-checked:rotate-90 transition-transform duration-200"
          onClick={() => {
            setStatus(!status);
          }}
        >
          <AiOutlineRight size={"22px"} />
        </label>
        <input
          // className="w-[5%]"
          id={index + "z"}
          type="checkbox"
          checked={checked[index]}
          onChange={() => handleOnChange(index)}
        />
      </div>
      {status ? (
        <div className="flex flex-col pl-[20px] pr-[20px] pb-[20px] gap-[5px]">
          <p>
            <span className="font-semibold text-black">Họ tên giáo viên: </span>
            {item.teacher_name}
          </p>
          <p>
            <span className="font-semibold text-black">Sĩ số: </span>
            {item.total_student}
          </p>
          <p>
            <span className="font-semibold text-black">Ngày bắt đầu: </span>
            {item.teacher_name}
          </p>
          <p>
            <span className="font-semibold text-black">Ngày kết thúc: </span>
            {item.end_date.split('-').reverse().join('-')}
          </p>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
