import "../../../../App.css";
import { AiOutlineRight } from "react-icons/ai";
import { useState } from "react";
import { animated, useTransition } from "react-spring";
import useMeasure from "react-use-measure";
// import { useRef } from "react";
// import { useEffect } from "react";

export default function Index({ item, index, checked, setChecked }) {
  const [ref, bounds] = useMeasure();
  const [status, setStatus] = useState(false);
  const transitions = useTransition(status, {
    from: { opacity: 0, heigth: 0, overflow: "hidden" },
    // to:{opacity: 1, height: 100 },
    enter: { opacity: 1, height: bounds.height, overflow: "visible" },
    leave: { opacity: 0, height: 0, overflow: "hidden" },
    update: { height: bounds.height },
  });
  const handleOnChange = (index) => {
    setChecked(
      checked.map((item, i) => {
        if (i === index) return (item = !item);
        else return item;
      })
    );
  };
  //   useEffect(() => {}, [ref]);
  return item.status ? (
    <div
      className={`flex flex-col border-solid border-[1px] border-bordercl rounded-[10px]`}
    >
      <div className={`flex p-[20px]  gap-[5%]`}>
        <label className="w-[30%]">{item.subject_code}</label>
        <label className="w-[30%]">{item.class_code}</label>
        <label className="w-[30%]">{item.class_name}</label>
        <input
          //   ref={ref}
          type="checkbox"
          id={index + "y"}
          className="peer hidden"
        />
        <label
          htmlFor={index + "y"}
          className="peer-checked:rotate-90 transition-transform duration-200 cursor-pointer"
          onClick={() => {
            setStatus(!status);
          }}
        >
          <AiOutlineRight size={"22px"} />
        </label>
      </div>
      <div>
        {transitions(
          (style, toggle) =>
            toggle && (
              <animated.div className={"overflow-hidden"} style={style}>
                <div
                  ref={ref}
                  className="flex flex-col pl-[20px] pr-[20px] pb-[20px] gap-[5px]"
                >
                  <p>
                    <span className="font-semibold text-black">
                      Họ tên giáo viên:{" "}
                    </span>
                    {item.teacher_name}
                  </p>
                  <p>
                    <span className="font-semibold text-black">Sĩ số: </span>
                    {item.total_student}
                  </p>
                  <p>
                    <span className="font-semibold text-black">
                      Ngày bắt đầu:{" "}
                    </span>
                    {item.start_date.split("-").reverse().join("-")}
                  </p>
                  <p>
                    <span className="font-semibold text-black">
                      Ngày kết thúc:{" "}
                    </span>
                    {item.end_date.split("-").reverse().join("-")}
                  </p>
                </div>
              </animated.div>
            )
        )}
      </div>
    </div>
  ) : (
    <div
      className={`flex flex-col border-solid border-[1px] border-bordercl rounded-[10px]`}
    >
      <div className={`flex p-[20px]  gap-[5%]`}>
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
          id={index + "a"}
          className="peer hidden"
        />
        <label
          htmlFor={index + "a"}
          className="peer-checked:rotate-90 transition-transform duration-200 cursor-pointer"
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
      <div>
        {transitions(
          (style, toggle) =>
            toggle && (
              <animated.div className={"overflow-hidden"} style={style}>
                <div
                  ref={ref}
                  className="flex flex-col pl-[20px] pr-[20px] pb-[20px] gap-[5px]"
                >
                  <p>
                    <span className="font-semibold text-black">
                      Họ tên giáo viên:{" "}
                    </span>
                    {item.teacher_name}
                  </p>
                  <p>
                    <span className="font-semibold text-black">Sĩ số: </span>
                    {item.total_student}
                  </p>
                  <p>
                    <span className="font-semibold text-black">
                      Ngày bắt đầu:{" "}
                    </span>
                    {item.start_date.split("-").reverse().join("-")}
                  </p>
                  <p>
                    <span className="font-semibold text-black">
                      Ngày kết thúc:{" "}
                    </span>
                    {item.end_date.split("-").reverse().join("-")}
                  </p>
                </div>
              </animated.div>
            )
        )}
      </div>
    </div>
  );
}
