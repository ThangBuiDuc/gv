import "../../../App.css";
import ReactLoading from "react-loading";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import { useTransition, animated } from "@react-spring/web";
import useMeasure from "react-use-measure";
import { useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";

import AddEvent from "./addEvent";
import RenderEvent from "./renderEvent";

export default function Index() {
  const [toggle, setToggle] = useState(false);

  const [ref, { height }] = useMeasure();

  const transitions = useTransition(toggle, {
    from: { opacity: 0, heigth: 0, overflow: "hidden" },
    // to:{opacity: 1, height: 100 },
    enter: { opacity: 1, height, overflow: "visible" },
    leave: { opacity: 0, height: 0, overflow: "hidden" },
    update: { height },
  });

  const { getToken } = useAuth();
  const role = useQuery({
    queryKey: ["RL_ROLE"],
    queryFn: async () => {
      return await fetch(import.meta.env.VITE_RL_ROLE, {
        method: "GET",
        headers: {
          authorization: `Bearer ${await getToken({
            template: import.meta.env.VITE_TEMPLATE_MANAGERMENT,
          })}`,
        },
      })
        .then((res) => res.json())
        .then((res) => (res.result[0] ? res.result[0] : null));
    },
  });

  const batch = useQuery({
    queryKey: ["RL_BATCH"],
    queryFn: async () => {
      return await fetch(import.meta.env.VITE_RL_BATCH)
        .then((res) => res.json())
        .then((res) => (res?.result.length > 0 ? res?.result[0] : null));
    },
    enabled:
      role.data !== null &&
      role.data !== undefined &&
      role.data?.role_id == import.meta.env.VITE_ROLE_RL_MANAGERMENT,
  });

  const listSV = useQuery({
    queryKey: ["RL_LIST_SV"],
    queryFn: async () => {
      return await fetch(import.meta.env.VITE_RL_LIST_SV, {
        method: "GET",
        headers: {
          authorization: `Bearer ${await getToken({
            template: import.meta.env.VITE_TEMPLATE_MANAGERMENT,
          })}`,
        },
      })
        .then((res) => res.json())
        .then((res) => res.result);
    },
    enabled:
      batch.data !== null &&
      batch.data !== undefined &&
      role.data?.role_id == import.meta.env.VITE_ROLE_RL_MANAGERMENT,
  });

  const listEvent = useQuery({
    queryKey: ["RL_LIST_EV"],
    queryFn: async () => {
      return await fetch(import.meta.env.VITE_RL_LIST_EVENT, {
        method: "GET",
        headers: {
          authorization: `Bearer ${await getToken({
            template: import.meta.env.VITE_TEMPLATE_MANAGERMENT,
          })}`,
        },
      })
        .then((res) => res.json())
        .then((res) => res.result);
    },
    enabled:
      role.data !== null &&
      role.data !== undefined &&
      role.data?.role_id == import.meta.env.VITE_ROLE_RL_MANAGERMENT,
  });

  // console.log(batch.data);
  // console.log(listSV.data);
  // console.log(listEvent.data);

  if (role.isFetching && role.isLoading) {
    return (
      <div className="eventWrap">
        <div className="flex justify-center">
          <h2 className="text-black">Nhật ký HPU</h2>
        </div>
        <ReactLoading
          type="spin"
          color="#0083C2"
          width={"50px"}
          height={"50px"}
          className="self-center"
        />
      </div>
    );
  }

  if (
    role.data === null ||
    role.data?.role_id != import.meta.env.VITE_ROLE_RL_MANAGERMENT
  ) {
    return (
      <div className="eventWrap">
        <div className="flex justify-center">
          <h2 className="text-black">Nhật ký HPU</h2>
        </div>
        <div className="flex justify-center">
          <h3>Tài khoản không có quyền thực hiện chức năng này!</h3>
        </div>
      </div>
    );
  }

  if (
    (batch.isFetching && batch.isLoading) ||
    (listEvent.isFetching && listEvent.isLoading) ||
    (listSV.isFetching && listSV.isLoading)
  ) {
    return (
      <div className="eventWrap">
        <div className="flex justify-center">
          <h2 className="text-black">Nhật ký HPU</h2>
        </div>
        <ReactLoading
          type="spin"
          color="#0083C2"
          width={"50px"}
          height={"50px"}
          className="self-center"
        />
      </div>
    );
  }

  return (
    <div className="eventWrap">
      <div className="flex justify-center my-[40px]">
        <h2 className="text-black">Nhật ký HPU</h2>
      </div>
      <button
        className="flex items-center w-[18%] cursor-pointer rounded-[20px] ml-[40px] pr-[40px] pl-[5px] text-[20px] text-[#1A73E8] font-medium hover:bg-[#f1f3f4]"
        onClick={() => setToggle(!toggle)}
      >
        <IoAddCircleOutline className="mr-[20px] " />
        Thêm sự kiện
      </button>
      <div>
        {transitions(
          (style, toggle) =>
            toggle && (
              <animated.div style={style}>
                <div className="mx-[40px]  rounded-[10px]" ref={ref}>
                  <AddEvent />
                </div>
              </animated.div>
            )
        )}
      </div>
      <div className="flex flex-col mt-[40px] mx-[40px] p-[5px] gap-[20px]">
        <RenderEvent />
        <RenderEvent />
        <RenderEvent />
        <RenderEvent />
        <RenderEvent />
        <RenderEvent />
      </div>
    </div>
  );
}
