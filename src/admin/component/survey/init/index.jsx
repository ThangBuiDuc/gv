import "../../../../App.css";
import { useState, useLayoutEffect, useEffect } from "react";
import Present from "./present";
import Question from "./question";
import ReactLoading from "react-loading";

export default function Index() {
  // let date = new Date();
  // const [startDate, setStartDate] = useState(date.toISOString().slice(0, 10));
  // const [endDate, setEndDate] = useState(
  //   new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  // );
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
        <h2 className="text-primary">Khởi tạo đợt đánh giá</h2>
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
        <div className="flex justify-center">
          <h3>
            Đã khởi tạo đợt đánh giá cho kỳ hiện tại trước đó. Vui lòng chuyển
            sang mục duyệt đánh giá cho lớp môn học!
          </h3>
        </div>
      ) : (
        <>
          <Present
            data={present}
            // startDate={startDate}
            // endDate={endDate}
            // setEndDate={setEndDate}
            // setStartDate={setStartDate}
          />
          <Question
            hocky={present.hocky}
            namhoc={present.manamhoc}
            // startDate={startDate}
            // endDate={endDate}
            setInited={setInited}
          />
        </>
      )}
    </div>
  );
}
