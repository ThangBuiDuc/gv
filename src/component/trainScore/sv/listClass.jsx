import { useState, Fragment } from "react";
import "../../../App.css";
import { AiOutlineRight } from "react-icons/ai";
import ListSV from "./listSV";
import { useQueryClient } from "@tanstack/react-query";

function Class({ item, index }) {
  const queryClient = useQueryClient();
  const [toggle, setToggle] = useState(false);
  return (
    <div className="flex flex-col gap-[10px]">
      {" "}
      <div className="flex border-t-[1px] border-solid border-bordercl justify-between p-[5px]">
        <h3>Lớp: {item.class_code}</h3>
        <h3>Mã lớp trưởng: {item.monitor_code}</h3>
        <h3>
          Họ tên:{" "}
          {item.monitor_name.first_name + " " + item.monitor_name.last_name}
        </h3>
        <AiOutlineRight
          size={"22px"}
          onClick={() => setToggle((pre) => !pre)}
          className={`transition-all cursor-pointer ${
            toggle ? "rotate-90" : ""
          }`}
        />
      </div>
      <div className="flex flex-col gap-[10px]">
        {toggle ? (
          <ListSV
            batch={queryClient.getQueryData(["getBatch_RL"])?.result[0].id}
            monitor_code={item.monitor_code}
            unique={index}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default function Index({ major }) {
  if (major.length === 0) {
    return (
      <>
        <h3>Không tìm thấy dữ liệu</h3>
      </>
    );
  }

  return major.map((item, index) => {
    return (
      <Fragment key={index}>
        <Class item={item} index={index} />
      </Fragment>
    );
  });
}
