// import React from 'react'
import { useState } from "react";
import "../../../../App.css";
import { AiOutlineRight } from "react-icons/ai";
import { IconContext } from "react-icons";
import { useTransition, animated } from "@react-spring/web";
import useMeasure from "react-use-measure";
import ReactLoading from "react-loading";
import SSubContent from "./ssubContent";

export default function SubContent({ data, present, isRefetching }) {
  const [toggle, setToggle] = useState();
  const [ref, { height }] = useMeasure();

  const transitions = useTransition(toggle, {
    from: { opacity: 0, heigth: 0, overflow: "hidden" },
    // to:{opacity: 1, height: 100 },
    enter: { opacity: 1, height, overflow: "visible" },
    leave: { opacity: 0, height: 0, overflow: "hidden" },
    update: { height },
  });

  return (
    <div className="flex border-t border-bordercl border-solid justify-between p-[10px] flex-col gap-[20px]">
      <div className="flex">
        <h3 className={`w-[30%]`}>{data.class_code}</h3>
        <h3 className={`w-[30%]`}>{data.class_name}</h3>
        <h3 className={`w-[30%]`}>{data.name}</h3>

        {typeof data.result_evaluate === "number" ? (
          <h3 className={`w-[5%] text-green-600`}>{data.result_evaluate}</h3>
        ) : (
          <div className="w-[5%]"></div>
        )}
        {isRefetching ? (
          <ReactLoading
            type="spin"
            color="#0083C2"
            width={"20px"}
            height={"20px"}
            className="self-center"
          />
        ) : (
          <label
            onClick={() => setToggle(!toggle)}
            className={`w-[5%] justify-end flex`}
          >
            <IconContext.Provider
              value={{
                className: `${
                  toggle ? "rotate-90" : ""
                } transition-transform duration-200 cursor-pointer`,
              }}
            >
              <AiOutlineRight size={"20px"} />
            </IconContext.Provider>
          </label>
        )}
      </div>
      <div>
        {transitions(
          (style, toggle) =>
            toggle && (
              <animated.div style={style}>
                <div
                  className="flex gap-[20px] justify-between flex-col "
                  ref={ref}
                >
                  <SSubContent dataCourse={data} present={present} />
                </div>
              </animated.div>
            )
        )}
      </div>
    </div>
  );
}
