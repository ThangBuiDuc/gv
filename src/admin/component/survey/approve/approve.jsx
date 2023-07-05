import { useAuth } from "@clerk/clerk-react";
import "../../../../App.css";
import { useEffect, useState, useReducer } from "react";
import { AiOutlineRight } from "react-icons/ai";
import ReactLoading from "react-loading";
import DropDown from "./dropDown";
import NavBtn from "./navBtn";
import { animated, useTransition } from "react-spring";
import useMeasure from "react-use-measure";
import { useQueryClient } from "@tanstack/react-query";

function compare(a, b) {
  return a.class_name.localeCompare(b.class_name);
}

const ACTION = {
  FIRST: "first",
  SECOND: "second",
};

function Reducer(state, action) {
  switch (action.type) {
    case ACTION.FIRST: {
      let cache = { ...state };
      cache.toggle1 = !cache.toggle1;
      return cache;
    }
    case ACTION.SECOND: {
      let cache = { ...state };
      cache.toggle2 = !cache.toggle2;
      return cache;
    }
    default:
      return state;
  }
}

export default function Index() {
  // let date = new Date();
  const [ref1, bounds1] = useMeasure();
  const [ref2, bounds2] = useMeasure();
  const [data, setData] = useState(null);
  const [checked, setChecked] = useState(null);
  const [status, setStatus] = useState(false);
  const [toggle, dispatch] = useReducer(Reducer, {
    toggle1: false,
    toggle2: true,
  });
  const queryClient = useQueryClient();
  const present = queryClient.getQueryData({ queryKey: ["getPresent_CTGD"] });
  // const spring1 = useSpring({
  //   height: toggle.toggle1 ? bounds1.height : 0,
  //   opacity: toggle.toggle1 ? 1 : 0,
  //   config: {
  //     duration: 200,
  //   },
  // });
  // const spring2 = useSpring({
  //   height: toggle.toggle2 ? bounds2.height : 0,
  //   opacity: toggle.toggle2 ? 1 : 0,
  //   config: {
  //     duration: 200,
  //   },
  // });
  const transitions1 = useTransition(toggle.toggle1, {
    from: { opacity: 0, heigth: 0, overflow: "hidden" },
    // to:{opacity: 1, height: 100 },
    enter: { opacity: 1, height: bounds1.height, overflow: "visible" },
    leave: { opacity: 0, height: 0, overflow: "hidden" },
    update: { height: bounds1.height },
  });

  const transitions2 = useTransition(toggle.toggle2, {
    from: { opacity: 0, heigth: 0, overflow: "hidden" },
    // to:{opacity: 1, height: 100 },
    enter: { opacity: 1, height: bounds2.height, overflow: "visible" },
    leave: { opacity: 0, height: 0, overflow: "hidden" },
    update: { height: bounds2.height },
  });
  // const [startDate, setStartDate] = useState(date.toISOString().slice(0, 10));
  // const [endDate, setEndDate] = useState(
  //   new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  // );
  const { getToken } = useAuth();

  useEffect(() => {
    const callApi = async () => {
      await fetch(
        `${import.meta.env.VITE_APPROVE_SUBJECT_API}${present[0]?.hocky}/${
          present[0]?.manamhoc
        }`,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${await getToken({
              template: `${import.meta.env.VITE_TEMPLATE_GV_CREATOR}`,
            })}`,
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          // console.log(res);
          if (res.result.length > 0) setData(res.result.sort(compare));
        });
    };

    callApi();
  }, [status]);

  useEffect(() => {
    if (data)
      setChecked(
        new Array(data.filter((item) => item.status === false).length).fill(
          false
        )
      );
  }, [data]);

  // console.log(data.filter((item) => item.status === false).length)
  // console.log(checked)

  return (
    <>
      <div className="flex flex-col gap-[10px]">
        {data && checked ? (
          <>
            <div
              className="font-semibold flex gap-[5px] cursor-pointer w-fit"
              onClick={() => {
                dispatch({ type: ACTION.FIRST });
              }}
            >
              Danh sách lớp môn học chưa duyệt{" "}
              <label
                className={`${
                  toggle.toggle1
                    ? "rotate-90 transition-transform duration-200"
                    : ""
                } cursor-pointer`}
              >
                <AiOutlineRight size={"22px"} />
              </label>
            </div>
            <div>
              {transitions1(
                (style, toggle) =>
                  toggle && (
                    <animated.div className={"overflow-hidden"} style={style}>
                      <div ref={ref1} className="flex flex-col gap-[10px]">
                        <NavBtn
                          data={data.filter((item) => item.status === false)}
                          checked={checked}
                          setChecked={setChecked}
                          present={present[0]}
                          setStatus={setStatus}
                          status={status}
                        />
                        {data
                          .filter((item) => item.status === false)
                          .map((item, index) => {
                            // console.log(item)
                            return (
                              <DropDown
                                key={index}
                                item={item}
                                index={index}
                                checked={checked}
                                setChecked={setChecked}
                                present={present[0]}
                              />
                            );
                          })}
                      </div>
                    </animated.div>
                  )
              )}
            </div>

            <div
              className="font-semibold flex gap-[5px] cursor-pointer w-fit"
              onClick={() => {
                dispatch({ type: ACTION.SECOND });
              }}
            >
              Danh sách lớp môn học đã duyệt{" "}
              <label
                className={`${
                  toggle.toggle2
                    ? "rotate-90 transition-transform duration-200"
                    : ""
                } cursor-pointer`}
              >
                <AiOutlineRight size={"22px"} />
              </label>
            </div>
            <div>
              {transitions2(
                (style, toggle) =>
                  toggle && (
                    <animated.div className={"overflow-hidden"} style={style}>
                      <div ref={ref2} className="flex flex-col gap-[10px]">
                        {data
                          .filter((item) => item.status === true)
                          .map((item, index) => {
                            // console.log(item)
                            return (
                              <DropDown
                                key={index}
                                item={item}
                                index={index}
                                checked={checked}
                                setChecked={setChecked}
                                present={present[0]}
                              />
                            );
                          })}
                      </div>
                    </animated.div>
                  )
              )}
            </div>
          </>
        ) : (
          <ReactLoading
            type="spin"
            color="#0083C2"
            width={"50px"}
            height={"50px"}
            className="self-center"
          />
        )}
      </div>
    </>
  );
}
