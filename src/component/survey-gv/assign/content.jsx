// import React from 'react'
import { useState } from "react";
import "../../../App.css";
import { AiOutlineRight } from "react-icons/ai";
import SubSelectContent from "./subSelectContent";
import { useTransition, animated } from "@react-spring/web";
import useMeasure from "react-use-measure";

export default function Index({ data, staff ,present ,status,setStatus,question}) {
  const [toggle, setToggle] = useState(false);

  const [ref, { height }] = useMeasure();


  const transitions = useTransition(toggle, {
    from: { opacity: 0, heigth: 0 , overflow:'hidden'},
    // to:{opacity: 1, height: 100 },
    enter: { opacity: 1, height ,overflow:'visible'},
    leave: { opacity: 0, height: 0 , overflow:'hidden'},
    update: { height },
  });

 
  //   console.log(data);
  // console.log(staff);
  //   console.log(
  //     staff.reduce((total, current) => {
  //       return [...total, ...current.users];
  //     }, [])
  //   );
  return (
    <div
      className="flex border-t border-bordercl border-solid justify-between p-[10px] flex-col gap-[20px]"
      //   onClick={() => setToggle(!toggle)}
    >
      <div className="flex justify-between ">
        <h3 className="w-[10%]">{data.class_code}</h3>
        <h3 className="w-[40%]">{data.class_name}</h3>
        <h3 className="w-[40%]">{data.user.name}</h3>
        <label
          onClick={() => setToggle(!toggle)}
          className={`${
            toggle ? "rotate-90" : ""
          } transition-transform duration-200 cursor-pointer`}
        >
          <AiOutlineRight size={"20px"} />
        </label>
      </div>
      <div>
        {transitions(
          (style, toggle) =>
            toggle && (
              <animated.div style={style}>
                <div className="flex gap-[20px] justify-between flex-col " ref={ref}>
                  <SubSelectContent toggle={toggle} setToggle={setToggle} data={data} staff={staff} question={question} present={present} status={status} setStatus={setStatus}/>
                </div>
              </animated.div>
            )
        )}
      </div>
    </div>
  );
}
