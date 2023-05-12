import "../../../../App.css";
import { useState, useLayoutEffect, useEffect } from "react";
import ReactLoading from "react-loading";
import Approve from "./approve";

export default function Index() {
  const [present, setPresent] = useState(null);
  const [inited, setInited] = useState("first");

  useLayoutEffect(() => {
    const callPresent = async () => {
      await fetch(`${import.meta.env.VITE_PRESENT_API}`)
        .then((res) => res.json())
        .then((res) => {
          setPresent(res.hientai.length > 0 ? res.hientai[0] : null);
        });
    };
    callPresent();
  }, []);

  useEffect(() => {
    const callCheck = async () => {
      await fetch(
        `${import.meta.env.VITE_CHECK_INITED_API}${present.hocky}/${
          present.manamhoc
        }`
      )
        .then((res) => res.json())
        .then((res) => setInited(res.result[0].result));
    };

    if (present) callCheck();
  }, [present]);

  return (
    <div className="wrapAdmin">
      <div className="flex justify-center">
        <h2 className="text-primary">Duyệt đánh giá lớp môn học</h2>
      </div>
      {inited === "first" ? (
        <ReactLoading
          type="spin"
          color="#0083C2"
          width={"50px"}
          height={"50px"}
          className="self-center"
        />
      ) : inited === true ? (
        <Approve present={present} />
      ) : (
        <div className="flex justify-center">
          <h3>Chưa khởi tạo đợt đánh giá, vui lòng khởi tạo đợt đánh giá!</h3>
        </div>
      )}
    </div>
  );
}
