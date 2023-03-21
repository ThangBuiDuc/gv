import { useAuth } from "@clerk/clerk-react";
import "../../../App.css";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";

export default function Index({ present }) {
  let date = new Date();
  const [data, setData] = useState(null);
  const [checked, setChecked] = useState(null);
  const [startDate, setStartDate] = useState(date.toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );
  const { getToken } = useAuth();

  useEffect(() => {
    const callApi = async () => {
      await fetch(
        `${import.meta.env.VITE_APPROVE_SUBJECT_API}${present.hocky}/${
          present.manamhoc
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
          if (res.result.length > 0) setData(res.result);
        });
    };

    callApi();
  }, []);

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

  const handleOnChange = (index) => {
    setChecked(
      checked.map((item, i) => {
        if (i === index) return (item = !item);
        else return item;
      })
    );
  };

  return (
    <>
      <div className="flex justify-evenly items-center">
        <p>
          <span className="font-semibold">Ngày bắt đầu:&nbsp;</span>
          <input
            type="date"
            className="rounded-[10px] overflow-hidden border-[1px] border-bordercl border-solid pl-[5px] pr-[5px]"
            onChange={(e) => setStartDate(e.target.value)}
            value={startDate}
          />
        </p>

        <p>
          <span className="font-semibold">Ngày kết thúc:&nbsp;</span>
          <input
            type="date"
            className="rounded-[10px] overflow-hidden border-[1px] border-bordercl border-solid pl-[5px] pr-[5px]"
            onChange={(e) => setEndDate(e.target.value)}
            value={endDate}
          />
        </p>
      </div>

      <div className="flex flex-col gap-[10px]">
        <p className="font-semibold">Danh sách lớp môn học chưa duyệt</p>
        {data && checked ? (
          data
            .filter((item) => item.status === false)
            .map((item, index) => {
              return (
                <div
                  key={index}
                  className="flex border-solid border-[1px] border-bordercl p-[20px] rounded-[10px] gap-[5%]"
                >
                  <label className="w-[15%]" htmlFor={index + "z"}>
                    {item.subject_code}
                  </label>
                  <label className="w-[15%]" htmlFor={index + "z"}>
                    {item.class_code}
                  </label>
                  <label className="w-[30%]" htmlFor={index + "z"}>
                    {item.class_name}
                  </label>
                  <label className="w-[20%]" htmlFor={index + "z"}>
                    {item.teacher_name}
                  </label>
                  <label className="w-[15%] text-center" htmlFor={index + "z"}>
                    SS: {item.total_student}
                  </label>
                  <input
                    // className="w-[5%]"
                    id={index + "z"}
                    type="checkbox"
                    checked={checked[index]}
                    onChange={() => handleOnChange(index)}
                  />
                </div>
              );
            })
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
