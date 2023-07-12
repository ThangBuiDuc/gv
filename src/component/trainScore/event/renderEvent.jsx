import { useTransition, animated } from "@react-spring/web";
import useMeasure from "react-use-measure";
import { useState } from "react";




function RenderEvent() {

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
        <div className="p-[5px] border-[2px] rounded-[10px] px-[20px]">
            <div className="flex justify-between">
                <h4>Khai giảng năm học mới 2023</h4>
                <button
                    onClick={() => setToggle(!toggle)}
                >
                    Chi tiết
                </button>
            </div>
            <p>05-09-2023</p>
            {transitions(
            (style, toggle) =>
            toggle && (
              <animated.div style={style}>
                <div
                  className="mx-[40px]  rounded-[10px]"
                  ref={ref}
                >
                  chi tiết
                </div>
              </animated.div>
            )
        )}
        </div>
     );
}

export default RenderEvent;